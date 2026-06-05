"""
News Service

This module fetches the latest news headlines
using the News API service.
"""

# ==================================================
# Imports
# ==================================================

import requests
import os
from dotenv import load_dotenv


# ==================================================
# Environment Configuration
# ==================================================

# Load environment variables from .env file
load_dotenv()


# ==================================================
# News Fetching
# ==================================================

def get_news():
    """
    Fetch the latest India-related news headlines.

    Returns:
        list:
            A list containing up to five news headlines.
            Returns an empty list if the request fails
            or no API key is configured.
    """

    try:

        # Retrieve News API key from environment variables
        api_key = os.getenv(
            "NEWS_API_KEY"
        )

        # Exit if API key is missing
        if not api_key:
            return []

        # News API endpoint with query parameters
        url = (
            "https://newsapi.org/v2/everything"
            "?q=india"
            "&language=en"
            "&sortBy=publishedAt"
            f"&apiKey={api_key}"
        )

        # Send request to News API
        response = requests.get(
            url,
            timeout=5
        )

        # Return empty list if request was unsuccessful
        if response.status_code != 200:
            return []

        # Parse JSON response
        data = response.json()

        # Extract articles list
        articles = data.get(
            "articles",
            []
        )

        # Store extracted headlines
        headlines = []

        # Collect first five article titles
        for article in articles[:5]:

            headlines.append(
                article["title"]
            )

        return headlines

    except Exception:

        # Return empty list on any unexpected error
        return []