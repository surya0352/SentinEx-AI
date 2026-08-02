from backend.models import Fingerprint, Image
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

            # ------------------------------------------------
            # Find image details
            # ------------------------------------------------

            image = db.query(
                Image
            ).filter(
                Image.id == fingerprint.image_id
            ).first()


            # ------------------------------------------------
            # Determine case information
            # ------------------------------------------------

            if image is not None:

                matches.append({

                    "image_id":
                        fingerprint.image_id,

                    "case_id":
                        image.case_id,

                    "distance":
                        int(distance)

                })

            else:

                matches.append({

                    "image_id":
                        fingerprint.image_id,

                    "case_id":
                        None,

                    "distance":
                        int(distance)

                })

    return matches