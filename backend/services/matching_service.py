from backend.models import Fingerprint
from backend.services.fingerprint_service import calculate_hamming_distance


def find_similar_images(
    new_phash,
    db,
    threshold=10
):

    fingerprints = db.query(
        Fingerprint
    ).all()

    matches = []

    for fingerprint in fingerprints:

        distance = calculate_hamming_distance(
            new_phash,
            fingerprint.phash
        )

        if distance <= threshold:

            matches.append({
                "image_id": fingerprint.image_id,
                "distance": distance
            })

    return matches