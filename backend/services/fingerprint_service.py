import imagehash
from PIL import Image


def generate_fingerprints(image_path):

    image = Image.open(image_path)

    phash = str(
        imagehash.phash(image)
    )

    dhash = str(
        imagehash.dhash(image)
    )

    return {
        "phash": phash,
        "dhash": dhash
    }



def calculate_hamming_distance(
    hash1,
    hash2
):

    hash1 = imagehash.hex_to_hash(
        hash1
    )

    hash2 = imagehash.hex_to_hash(
        hash2
    )

    return hash1 - hash2