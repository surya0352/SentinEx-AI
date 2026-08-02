from PIL import Image
from transformers import pipeline


# Load the image classification model once
classifier = pipeline(
    "image-classification",
    model="Falconsai/nsfw_image_detection"
)


def detect_sensitive_content(image_path):

    # Open image
    image = Image.open(
        image_path
    ).convert("RGB")


    # Run AI model
    results = classifier(
        image
    )


    # Get highest confidence prediction
    top_result = max(
        results,
        key=lambda x: x["score"]
    )


    label = top_result["label"]

    confidence = top_result["score"]


    # Determine whether content is sensitive
    is_sensitive = (
        label.lower() == "nsfw"
    )


    return {
        "is_sensitive": is_sensitive,
        "confidence": round(
            confidence,
            4
        ),
        "label": label
    }