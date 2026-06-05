# Jarvis AI Voice Assistant

A web-based AI voice assistant inspired by JARVIS, built using Flask, JavaScript, and Google's Gemini AI.

## Features

* AI-powered conversations using Gemini
* Voice input using Speech Recognition
* Hands-Free conversation mode
* Text-to-Speech responses
* Play music from YouTube
* Open websites using voice commands
* Real-time weather information
* Latest news headlines
* Dark and Light mode support
* Chat history saved using Local Storage

## Tech Stack

### Backend

* Python
* Flask
* Gemini API

### Frontend

* HTML5
* CSS3
* JavaScript

### APIs & Services

* Gemini AI
* YouTube Search
* Weather API
* News API
* Web Speech API

## Project Structure

```text
Jarvis-AI-Voice-Assistant/
│
├── app.py
├── requirements.txt
├── .gitignore
│
├── services/
│   ├── command_processor.py
│   ├── gemini_service.py
│   ├── youtube_service.py
│   ├── weather_service.py
│   └── news_service.py
│
├── templates/
│   └── index.html
│
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/yashmehta1910/Jarvis-AI-Voice-Assistant.git
cd Jarvis-AI-Voice-Assistant
```

### 2. Create Virtual Environment

```bash
python -m venv .venv
```

### 3. Activate Virtual Environment

Windows:

```bash
.venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Create Environment File

Create a `.env` file and add your API keys:

```env
GEMINI_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
```

### 6. Run Application

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Voice Commands

### Open Website

```text
open youtube
open github
open google
```

### Play Music

```text
play shape of you
play believer
```

### Weather

```text
weather in delhi
weather in london
```

### News

```text
latest news
```

### Time

```text
what time is it
```

## Future Improvements

* Wake word detection ("Hey Jarvis")
* Spotify integration
* System automation commands
* Smart home integration
* Desktop application
* Better music recommendations

## Author

Yash Kumar Mehta

Built as a personal AI assistant project using Flask and Gemini AI.
