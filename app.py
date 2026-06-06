"""
Main Flask Application

This module serves as the entry point for the Jarvis web application.
It handles routing, user requests, command processing, and AI responses.
"""

# ==================================================
# Imports
# ==================================================

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

from services.gemini_service import get_response
from services.command_processor import process_command

from services.youtube_service import search_video
from datetime import datetime
from services.weather_service import get_weather
from services.news_service import get_news


# ==================================================
# Environment Configuration
# ==================================================

# Load environment variables from .env file
load_dotenv()


# ==================================================
# Flask Application Initialization
# ==================================================

app = Flask(__name__)


# ==================================================
# Routes
# ==================================================

@app.route("/")
def home():
    """
    Render the main application page.

    Returns:
        HTML page for the Jarvis interface.
    """
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    """
    Process chat requests from the frontend.

    Handles:
        - Music requests
        - Website opening requests
        - Weather requests
        - Time requests
        - News requests
        - General AI conversations

    Returns:
        JSON response containing the requested data
        or an error message.
    """

    try:

        # Retrieve JSON payload from request
        data = request.get_json()

        # Extract and clean user message
        user_message = data.get("message", "").strip()

        # Validate input
        if not user_message:
            return jsonify({
                "error": "Message cannot be empty."
            }), 400

        # Determine whether the message matches
        # a supported command
        action = process_command(user_message)

        # ==================================================
        # Music Commands
        # ==================================================

        if action and action["type"] == "music":

            video_id = search_video(
                action["song"]
            )

            if not video_id:

                return jsonify({
                    "error":
                    "Unable to find that song."
                }), 404

            return jsonify({
                "type": "music",
                "song": action["song"],
                "video_id": video_id
            })

        # ==================================================
        # Website Commands
        # ==================================================

        if action and action["type"] == "website":

            return jsonify({
                "type": "website",
                "website": action["website"]
            })

        # ==================================================
        # Weather Commands
        # ==================================================

        if action and action["type"] == "weather":

            weather = get_weather(
                action["city"]
            )

            if not weather:

                return jsonify({
                    "error":
                    "Unable to fetch weather."
                }), 500

            return jsonify({
                "type": "weather",
                "weather": weather
            })

        # ==================================================
        # Time Commands
        # ==================================================

        if action and action["type"] == "time":

            current_time = datetime.now().strftime(
                "%I:%M %p"
            )

            return jsonify({
                "type": "time",
                "time": current_time
            })

        # ==================================================
        # News Commands
        # ==================================================

        if action and action["type"] == "news":

            headlines = get_news()

            if not headlines:

                return jsonify({
                    "error":
                    "No news available."
                }), 404

            return jsonify({
                "type": "news",
                "headlines": headlines
            })

        # ==================================================
        # Fallback Command Response
        # ==================================================

        if action:
            return jsonify(action)

        # ==================================================
        # AI Chat Response
        # ==================================================

        reply = get_response(
            user_message
        )

        if (
            reply ==
            "Sorry, I am unable to "
            "process that request right now."
        ):

            return jsonify({
                "error":
                "AI service unavailable."
            }), 500

        return jsonify({
            "type": "chat",
            "reply": reply
        })

    except Exception as e:

        # Log error for debugging
        print("ERROR:", e)

        return jsonify({
            "error":
            "Internal server error."
        }), 500


# ==================================================
# Application Entry Point
# ==================================================

if __name__ == "__main__":
    app.run()