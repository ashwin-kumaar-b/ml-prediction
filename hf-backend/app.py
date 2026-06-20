import io
import os
from typing import Dict

from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel

from PIL import Image
import numpy as np

import onnxruntime as ort
import cv2
import glob
from pathlib import Path

app = FastAPI(title="DR Detection API")


def resolve_model_path() -> str | None:
    env_path = os.environ.get("MODEL_PATH")
    if env_path and Path(env_path).is_file():
        return env_path
    here = Path(__file__).resolve().parent.parent
    patterns = [
        str(here / "dr_model.onnx"),
        str(here / "**" / "dr_model*.onnx"),
        str(here / "**" / "*.onnx"),
    ]
    for p in patterns:
        matches = glob.glob(p, recursive=True)
        if matches:
            return matches[0]
    return None


MODEL_PATH = resolve_model_path()
SESSION: ort.InferenceSession | None = None
onnx_input_name = None
onnx_output_name = None

if MODEL_PATH:
    try:
        SESSION = ort.InferenceSession(MODEL_PATH)
        onnx_input_name = SESSION.get_inputs()[0].name
        onnx_output_name = SESSION.get_outputs()[0].name
        print(f"Loaded ONNX model: {MODEL_PATH}")
    except Exception as e:
        print(f"ONNX model load error: {e}")
        SESSION = None
else:
    print("ONNX model not found. Set MODEL_PATH or add dr_model.onnx in repo.")


CLASS_NAMES = ["No DR", "Mild", "Moderate", "Severe", "Proliferative"]

SEVERITY_DESCRIPTIONS = {
    0: "No signs of diabetic retinopathy detected. The retinal examination appears normal.",
    1: "Mild Non-Proliferative Diabetic Retinopathy (NPDR) detected.",
    2: "Moderate Non-Proliferative Diabetic Retinopathy (NPDR) detected.",
    3: "Severe Non-Proliferative Diabetic Retinopathy (NPDR) detected.",
    4: "Proliferative Diabetic Retinopathy (PDR) detected.",
}

def preprocess_image(image: Image.Image, return_tensor: bool = False):
    img = image.resize((512, 512))
    img_array = np.array(img)
    lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    lab = cv2.merge([l, a, b])
    img_array = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    img_array = img_array.astype(np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    img_array = (img_array - mean) / std
    img_array = img_array.astype(np.float32).transpose(2, 0, 1)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


class PredictResponse(BaseModel):
    report: str
    label: str
    confidence: float
    scores: Dict[str, float]


@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    if SESSION is None:
        raise HTTPException(status_code=500, detail="ONNX model not loaded")
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    # Preprocess and run ONNX
    input_data = preprocess_image(image, return_tensor=False)
    outputs = SESSION.run([onnx_output_name], {onnx_input_name: input_data})[0]
    exp_outputs = np.exp(outputs - np.max(outputs, axis=1, keepdims=True))
    probabilities = exp_outputs / exp_outputs.sum(axis=1, keepdims=True)
    probabilities = probabilities[0]
    predicted_class = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_class]) * 100
    max_prob = float(np.max(probabilities))
    second_prob = float(np.partition(probabilities, -2)[-2])
    confidence_gap = max_prob - second_prob

    # Build report text
    if max_prob < 0.5 or confidence_gap < 0.15:
        result_text = f"⚠️ LOW CONFIDENCE PREDICTION\n\nClassification: {CLASS_NAMES[predicted_class]}\nConfidence Level: {confidence:.1f}%\n\nThe model's confidence is below the recommended threshold. Consider retaking the image or consulting an ophthalmologist."
    else:
        certainty = "high" if confidence >= 85 else "moderate" if confidence >= 70 else "fair"
        result_text = f"DIAGNOSTIC ANALYSIS REPORT\n\nPRIMARY DIAGNOSIS: {CLASS_NAMES[predicted_class]}\nConfidence Level: {confidence:.1f}%\n\nCLINICAL FINDINGS:\n{SEVERITY_DESCRIPTIONS[predicted_class]}\n\nNEXT STEPS: Consult an ophthalmologist for confirmation."

    return {
        "report": result_text,
        "label": CLASS_NAMES[predicted_class],
        "confidence": confidence,
        "scores": {CLASS_NAMES[i]: float(probabilities[i]) for i in range(len(probabilities))},
    }
