import requests

API_URL = "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image"
headers = {"Authorization": "Bearer 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"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

n = input("Query:")
image_bytes = query({
    "inputs": n,
})
# print(image_bytes)
# You can access the image with PIL.Image for example
import io
from PIL import Image
image = Image.open(io.BytesIO(image_bytes))
print(image)
image.show()
