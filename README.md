# Jarvis AI Voice Assistant

Jarvis is a voice-enabled AI assistant built with Flask, JavaScript, and Google's Gemini API.

## Features

* AI-powered chat using Gemini
* Voice-to-text input
* Text-to-speech responses
* Hands-Free Mode
* Open websites using voice commands
* Play songs from YouTube
* Weather information
* Latest news headlines
* Current time lookup
* Dark/Light mode
* Chat history using Local Storage

## Technologies Used

### Backend

* Python
* Flask
* Gemini API
* OpenWeather API
* News API
* YouTube Data API

### Frontend

* HTML
* CSS
* JavaScript
* Web Speech API

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/jarvis-ai.git
cd jarvis-ai
```

### Create Virtual Environment

```bash
python -m venv .venv
```

### Activate Environment

Windows:

```bash
.venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Create .env File

```env
GEMINI_API_KEY=your_key
OPENWEATHER_API_KEY=your_key
YOUTUBE_API_KEY=your_key
NEWS_API_KEY=your_key
```

### Run Application

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Voice Commands

### Open Websites

```text
open youtube
open github
open iit kanpur
```

### Play Music

```text
play shape of you
```

### Weather

```text
weather in delhi
```

### News

```text
latest news
```

### Time

```text
what time is it
```

## Project Structure

```text
jarvis-ai/
│
├── app.py
├── requirements.txt
├── .env
│
├── services/
│   ├── command_processor.py
│   ├── gemini_service.py
│   ├── weather_service.py
│   ├── news_service.py
│   └── youtube_service.py
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── script.js
│
└── README.md
```

## Future Improvements

* Wake word detection ("Hey Jarvis")
* Multi-language support
* AI memory
* Calendar integration
* Email integration
* Smart home controls

## Author

Yash Kumar Mehta
