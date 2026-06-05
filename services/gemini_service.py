"""
Gemini AI Service

This module handles communication with the Gemini API
and returns AI-generated responses for user queries.
"""

# ==================================================
# Imports
# ==================================================

import os
from dotenv import load_dotenv
from google import genai


# ==================================================
# Environment Configuration
# ==================================================

# Load environment variables from .env file
load_dotenv()


# ==================================================
# Gemini Client Initialization
# ==================================================

# Create Gemini client using API key from environment
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# ==================================================
# Response Generation
# ==================================================

def get_response(message):
    """
    Generate a response using the Gemini model.

    Args:
        message (str):
            User message or query.

    Returns:
        str:
            AI-generated response text.
            Returns an error message if processing fails.
    """

    try:

        # System prompt used to guide the AI assistant
        prompt = f"""
        You are Jarvis, an intelligent AI assistant.

        Rules:
        - Be helpful.
        - Be concise.
        - Give clear answers.
        - Use markdown when useful.

        User: {message}
        """

        # Send request to Gemini model
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # Return generated text response
        return response.text

    except Exception as e:

        print("GEMINI ERROR:", e)

        if "RESOURCE_EXHAUSTED" in str(e):

            return (
                "Gemini API rate limit reached. "
                "Please wait a few seconds and try again."
            )

        return (
            "Sorry, I am unable to "
            "process that request right now."
        )