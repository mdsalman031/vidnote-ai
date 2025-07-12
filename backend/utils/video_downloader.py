# video_downloader.py

import yt_dlp
import uuid
import os

def download_video(youtube_url: str, output_dir='downloads/') -> str:
    """
    Downloads a YouTube video using yt_dlp and returns the path to the downloaded file.
    """
    os.makedirs(output_dir, exist_ok=True)
    video_filename = f"{uuid.uuid4().hex}.mp4"
    video_path = os.path.join(output_dir, video_filename)

    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': video_path,
        'quiet': True,
        'merge_output_format': 'mp4'
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])
        print(f"[INFO] Video downloaded successfully: {video_path}")
        return video_path

    except Exception as e:
        print(f"[DOWNLOAD ERROR] {e}")
        raise Exception("❌ Failed to download the YouTube video. It may be unavailable, private, restricted, or rate-limited.")
