# summarizer.py

import os
import re
import json
import requests
from typing import List
from dotenv import load_dotenv
import bleach
from bs4 import BeautifulSoup

load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

TOGETHER_API_URL = "https://api.together.ai/v1/chat/completions"
TOGETHER_MODEL = "mistralai/Mistral-7B-Instruct-v0.1"

HEADERS = {
    "Authorization": f"Bearer {TOGETHER_API_KEY}",
    "Content-Type": "application/json"
}

ALLOWED_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u']

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()

def summarize_with_together(prompt: str) -> str:
    payload = {
        "model": TOGETHER_MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that summarizes transcripts into structured notes."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5,
        "top_p": 0.9,
        "max_tokens": 2048
    }

    try:
        response = requests.post(TOGETHER_API_URL, headers=HEADERS, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Together API error: {str(e)}")

def extract_body_content(html: str) -> str:
    soup = BeautifulSoup(html, 'html.parser')
    return str(soup.body or html)

def sanitize_html(html_content: str) -> str:
    cleaned = bleach.clean(html_content, tags=ALLOWED_TAGS)
    cleaned = bleach.clean(cleaned, tags=ALLOWED_TAGS, attributes={}, strip=True)
    return cleaned

def generate_structured_notes(transcript: str) -> str:
    cleaned = clean_text(transcript)
    if not cleaned or len(cleaned.split()) < 20:
        return "<p><strong>Transcript too short to generate detailed notes.</strong></p>"

    try:
        prompt = (
            "Convert the following transcript into well-structured, detailed notes in HTML format. "
            "Use <h2> for section headings, <p> for paragraphs, <table><th><tr> for tables, and <ul><li> for short lists.\n\n"
            + cleaned
        )
        summary = summarize_with_together(prompt)
        html_body = extract_body_content(summary)
        return sanitize_html(html_body)
    except Exception as e:
        print(f"[ERROR] Together summarization failed: {e}")
        return "<p><strong>Structured notes could not be generated.</strong></p>"

def generate_quiz_from_transcript(transcript: str) -> List[dict]:
    cleaned = clean_text(transcript)
    if not cleaned or len(cleaned.split()) < 20:
        return []

    quiz_prompt = (
        "From the following video transcript, generate a quiz with 5 to 10 multiple choice questions. "
        "Each question should include:\n"
        "- A clear question\n"
        "- 4 answer options labeled A, B, C, D (do not include A., B. in the value)\n"
        "- One correct answer (just the letter A/B/C/D, not full text)\n"
        "- Return the output as a valid JSON array with each object having 'question', 'options', and 'answer' fields\n\n"
        f"Transcript:\n{cleaned}"
    )

    try:
        response = summarize_with_together(quiz_prompt)
        questions = json.loads(response)

        for q in questions:
            if isinstance(q["options"], list):
                q["options"] = {chr(65 + i): opt for i, opt in enumerate(q["options"])}

            for key in list(q["options"].keys()):
                value = q["options"][key]
                q["options"][key] = re.sub(rf"^{key}\.\s*", "", value).strip()

            if q["answer"] not in q["options"]:
                for k, v in q["options"].items():
                    if q["answer"].strip().lower() == v.strip().lower():
                        q["answer"] = k
                        break
                else:
                    q["answer"] = next(iter(q["options"]))

        return questions

    except Exception as e:
        print(f"[ERROR] Quiz generation failed: {e}")
        return []

def generate_flashcards_from_transcript(transcript: str) -> List[dict]:
    cleaned = clean_text(transcript)
    if not cleaned or len(cleaned.split()) < 20:
        return []

    prompt = (
        "From the following transcript, generate 5 flashcards that help in learning. "
        "Each flashcard should have a 'question' and a 'short answer'. "
        "Return it as a JSON list like this:\n"
        "[{\"question\": \"What is X?\", \"answer\": \"X is...\"}, ...]\n\n"
        f"Transcript:\n{cleaned}"
    )

    try:
        response = summarize_with_together(prompt)
        return json.loads(response)
    except Exception as e:
        print(f"[ERROR] Flashcard generation failed: {e}")
        return []

def answer_question_about_transcript(transcript: str, user_question: str) -> str:
    cleaned = clean_text(transcript)
    if not cleaned or len(cleaned.split()) < 20:
        return "Transcript is too short to answer questions."

    prompt = (
        f"Answer this question based on the transcript below.\n\n"
        f"Question: {user_question}\n\n"
        f"Transcript: {cleaned}"
    )

    try:
        return summarize_with_together(prompt)
    except Exception as e:
        print(f"[ERROR] Question answering failed: {e}")
        return "Sorry, I couldn't answer that question."
