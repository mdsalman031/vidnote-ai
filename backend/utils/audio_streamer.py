import subprocess
import yt_dlp
import uuid
import os

def get_audio_stream_url(youtube_url: str) -> str:
    ydl_opts = {
        'format': 'bestaudio[ext=m4a]/bestaudio/best',
        'quiet': True,
        'skip_download': True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(youtube_url, download=False)
        return info_dict['url']

def stream_audio_to_wav(youtube_url: str, output_dir='downloads/', duration=60) -> str:
    os.makedirs(output_dir, exist_ok=True)

    temp_audio_file = os.path.join(output_dir, f"{uuid.uuid4().hex}.m4a")
    output_wav_file = os.path.join(output_dir, f"{uuid.uuid4().hex}.wav")

    ydl_opts = {
        'format': 'bestaudio[ext=m4a]/bestaudio/best',
        'outtmpl': temp_audio_file,
        'quiet': True,
        'noplaylist': True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])

    command = [
        'ffmpeg',
        '-y',
        '-i', temp_audio_file,
        '-t', str(duration),
        '-vn',
        '-acodec', 'pcm_s16le',
        '-ar', '16000',
        '-ac', '1',
        '-f', 'wav',
        output_wav_file
    ]

    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"FFmpeg failed:\n{result.stderr}")

    print(f"[INFO] Created audio file: {output_wav_file}")

    os.remove(temp_audio_file)

    return output_wav_file
