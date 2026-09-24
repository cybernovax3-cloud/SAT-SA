import os

import requests
from dotenv import load_dotenv


load_dotenv()


def get_model_name():
    return os.getenv("OLLAMA_MODEL", "llama3.2:3b")


class OllamaClientError(RuntimeError):
    """Raised when the local Ollama service cannot generate a response."""


def generate_response(prompt: str, response_format=None) -> str:
    base_url = os.getenv("OLLAMA_URL", "http://localhost:11434").rstrip("/")
    model = get_model_name()
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }
    if response_format:
        payload["format"] = response_format
    payload["options"] = {"temperature": 0}

    try:
        response = requests.post(
            f"{base_url}/api/generate",
            json=payload,
            timeout=float(os.getenv("OLLAMA_TIMEOUT", "120")),
        )
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError as exc:
        raise OllamaClientError(
            "Ollama rejected the local generation request."
        ) from exc
    except requests.exceptions.RequestException as exc:
        raise OllamaClientError(
            "Local Ollama is unavailable. Start Ollama and verify its local endpoint."
        ) from exc
    except ValueError as exc:
        raise OllamaClientError(
            "Ollama returned an invalid JSON response."
        ) from exc

    generated_text = data.get("response") if isinstance(data, dict) else None
    if not isinstance(generated_text, str):
        raise OllamaClientError("Ollama returned no generated response.")
    return generated_text.strip()
