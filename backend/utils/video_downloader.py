import yt_dlp
import uuid
import os

def download_video(youtube_url: str, output_dir='downloads/') -> str:
    os.makedirs(output_dir, exist_ok=True)
    video_path = os.path.join(output_dir, f"{uuid.uuid4().hex}.mp4")

    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': video_path,
        'quiet': True,
        'merge_output_format': 'mp4'
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])

    return video_path
