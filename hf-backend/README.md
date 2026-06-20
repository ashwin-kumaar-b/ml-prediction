# DR Detection Backend

This folder contains a FastAPI backend that loads your ONNX model and returns a diabetic retinopathy classification report from `/predict`.

## Local run

Place your ONNX file in the repo, for example `dr_model_fixed.onnx`, or set `MODEL_PATH` to the file path.

```bash
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

Test the endpoint:

```bash
curl -F "file=@/path/to/image.jpg" http://localhost:8000/predict
```

## Render deploy

The repo root includes a [render.yaml](../render.yaml) blueprint that deploys this backend as a Python web service.

Use these settings:

- Root directory: `hf-backend`
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --workers 1`

## Model location

The app automatically searches for `*.onnx` files starting from the repo root. You can also set `MODEL_PATH` explicitly in Render environment variables.
