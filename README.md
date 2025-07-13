# 📽️ VidNote.AI - AI-Powered Video Learning Assistant

**VidNote.AI** is an intelligent platform that transforms educational videos into structured learning resources. Powered by GenAI and FastAPI, it enables learners and educators to extract transcripts, generate notes, quizzes, flashcards, and key frames — along with an AI chatbot for Q&A — from any YouTube video.

---

## 🚀 Features

- 🎥 **YouTube Video Input**  
  Paste a YouTube URL to begin automatic processing.

- 📝 **Structured Notes Generation**  
  Summarizes the transcript into well-formatted HTML with export options (PDF / Markdown).

- ❓ **MCQ Quiz Creator**  
  Generates 5–10 multiple choice questions based on the video content.

- 🧠 **Flashcard Generation**  
  Creates compact flashcards for quick revision.

- 🖼️ **Key Frame Extraction**  
  Captures visual key moments from the video using frame sampling.

- 🤖 **AI Chatbot for Q&A**  
  Lets users ask questions related to the transcript with contextual answers.

- 📤 **Export Quiz to Google Form**  
  Teachers can export generated quizzes to Google Forms for classroom use.

---

## 🧰 Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | React.js, Tailwind CSS        |
| Backend      | FastAPI (Python)              |
| AI/LLM       | Together.ai (`Mistral-7B`)    |
| Transcription| Whisper / YouTube Transcript  |
| Libraries    | BeautifulSoup, Bleach, Requests, UUID, PrintJS |
| Deployment   | Vercel (frontend), Render (backend) |

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mdsalman031/vidnote-ai.git
cd vidnote-ai
````

### 2. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:

```
TOGETHER_API_KEY=your_together_ai_key
```

Run the server:

```bash
uvicorn main:app --reload
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔥 Example Use Case

> 🎓 A computer science student pastes a YouTube lecture link on ReactJS. VidNote.AI generates structured notes, quizzes, and flashcards. The student uses the chatbot to ask, “What is useEffect?” and gets an instant answer. The teacher exports the quiz to Google Forms for a class test.

---

## 📸 Screenshots

* **Structured Notes View**
* **MCQ Quiz Panel**
* **Flashcards Component**
* **Video Key Frames**
* **Floating Chatbot Assistant**

---

## 📈 Future Scope

* Support for PDF/PPT uploads
* User login and dashboard
* Multi-language transcript processing
* Smart topic-based clipping
* Analytics for teachers

---

## 📚 References

* [Together.ai API](https://docs.together.ai/)
* [OpenAI Whisper](https://github.com/openai/whisper)
* [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
* [Mistral-7B on HuggingFace](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1)

---
