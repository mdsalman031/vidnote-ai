from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
import re

def extract_video_id(url: str) -> str:
    """
    Extract the video ID from a YouTube URL.
    """
    match = re.search(r"(?:v=|v\/|embed\/|youtu\.be\/|\/v=)([0-9A-Za-z_-]{11})", url)
    if not match:
        raise ValueError("Invalid YouTube URL format")
    return match.group(1)

def transcribe_audio(url: str) -> str:
    """
    Get the transcript text from a YouTube video using YouTubeTranscriptApi.
    """
    video_id = extract_video_id(url)

    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=["en", "hi"])
        full_text = " ".join([entry["text"] for entry in transcript_list])
        return full_text
    except TranscriptsDisabled:
        raise RuntimeError("Transcript is disabled for this video.")
    except Exception as e:
        raise RuntimeError(f"[ERROR] Failed to fetch transcript: {e}")
