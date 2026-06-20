import torch
import torch.nn.functional as F
import numpy as np


class GradCAM:
    def __init__(self, model: torch.nn.Module, target_layer_name: str):
        self.model = model
        self.target_layer_name = target_layer_name
        self.activations = None
        self.gradients = None
        self._register_hooks()

    def _find_target_layer(self):
        for name, module in self.model.named_modules():
            if name == self.target_layer_name:
                return module
        raise ValueError(f"Layer {self.target_layer_name} not found")

    def _register_hooks(self):
        layer = self._find_target_layer()

        def forward_hook(module, input, output):
            self.activations = output.detach()

        def backward_hook(module, grad_in, grad_out):
            self.gradients = grad_out[0].detach()

        layer.register_forward_hook(forward_hook)
        layer.register_backward_hook(backward_hook)

    def generate(self, input_tensor: torch.Tensor, class_idx: int):
        self.model.zero_grad()
        output = self.model(input_tensor)
        if output.ndim == 1 or output.shape[0] == 1:
            score = output[0]
        else:
            score = output[0, class_idx]
        score.backward(retain_graph=True)

        grads = self.gradients[0]
        acts = self.activations[0]
        weights = grads.mean(dim=(1, 2), keepdim=True)
        cam = (weights * acts).sum(dim=0)
        cam = F.relu(cam)
        cam = cam - cam.min()
        if cam.max() > 0:
            cam = cam / cam.max()
        return cam.cpu().numpy()
