"""
YouTube Service

This module searches YouTube for a video based on
a user query and returns the first matching video ID.
"""

# ==================================================
# Imports
# ==================================================

from googleapiclient.discovery import build
from dotenv import load_dotenv
import os


# ==================================================
# Environment Configuration
# ==================================================

# Load environment variables from .env file
load_dotenv()


# ==================================================
# YouTube Search
# ==================================================

def search_video(query):
    """
    Search YouTube and return the first matching video ID.

    Args:
        query (str):
            Search term provided by the user.

    Returns:
        str | None:
            YouTube video ID if a result is found.
            Returns None if no result is found or
            if an error occurs.
    """

    try:

        # Retrieve YouTube API key from environment variables
        api_key = os.getenv(
            "YOUTUBE_API_KEY"
        )

        # Exit if API key is missing
        if not api_key:
            return None

        # Create YouTube API client
        youtube = build(
            "youtube",
            "v3",
            developerKey=api_key
        )

        # Build search request
        request = youtube.search().list(
            q=query,
            part="snippet",
            maxResults=1,
            type="video"
        )

        # Execute API request
        response = request.execute()

        # Extract search results
        items = response.get("items")

        # Return None if no results were found
        if not items:
            return None

        # Return the first video's ID
        return items[0]["id"]["videoId"]

    except Exception:

        # Return None on any unexpected error
        return None