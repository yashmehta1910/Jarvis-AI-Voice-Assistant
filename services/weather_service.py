"""
Weather Service

This module retrieves current weather information
for a specified city using the OpenWeather API.
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
# Weather Fetching
# ==================================================

def get_weather(city):
    """
    Fetch current weather information for a city.

    Args:
        city (str):
            Name of the city to query.

    Returns:
        dict | None:
            Weather information including:
                - city
                - temp
                - humidity
                - description

            Returns None if the request fails.
    """

    try:

        # Retrieve OpenWeather API key from environment variables
        api_key = os.getenv(
            "OPENWEATHER_API_KEY"
        )

        # Build API request URL
        url = (
            "https://api.openweathermap.org/data/2.5/weather"
            f"?q={city}"
            f"&appid={api_key}"
            "&units=metric"
        )

        # Send request to OpenWeather API
        response = requests.get(
            url,
            timeout=5
        )

        # Return None if request was unsuccessful
        if response.status_code != 200:
            return None

        # Parse JSON response
        data = response.json()

        # Extract and return relevant weather details
        return {
            "city": data["name"],
            "temp": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "description": data["weather"][0]["description"]
        }

    except Exception:

        # Return None on any unexpected error
        return None