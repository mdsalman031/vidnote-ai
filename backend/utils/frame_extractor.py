# frame_extractor.py

import cv2
import os
import uuid
import numpy as np

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

        # Calculate frame extraction interval
        frame_interval = max(1, total_frames // max_frames)
        
        # Use more efficient frame sampling
        for frame_idx in range(0, total_frames, frame_interval):
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            success, frame = cap.read()
            
            if not success:
                continue

            # Save the frame
            frame_filename = f"{uuid.uuid4().hex}.jpg"
            path = os.path.join(output_dir, frame_filename)
            cv2.imwrite(path, frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            saved_frames.append(path)

            if len(saved_frames) >= max_frames:
                break

        return saved_frames
    finally:
        if 'cap' in locals() and cap.isOpened():
            cap.release()