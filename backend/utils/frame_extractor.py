import cv2
import os
import uuid

def extract_key_frames(video_path, output_dir="downloads/", max_frames=10):
    os.makedirs(output_dir, exist_ok=True)
    saved_frames = []

    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return saved_frames

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames == 0:
            return saved_frames

        # Calculate 10 evenly spaced frame indices
        frame_indices = [int(i * total_frames / max_frames) for i in range(max_frames)]

        for frame_idx in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            success, frame = cap.read()

            if not success:
                continue

            frame_filename = f"{uuid.uuid4().hex}.jpg"
            path = os.path.join(output_dir, frame_filename)
            cv2.imwrite(path, frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            saved_frames.append(path)

        return saved_frames
    finally:
        if 'cap' in locals() and cap.isOpened():
            cap.release()
