def process_command(command):
    """
    Process a user command and determine the requested action.

    Supported command types:
        - Open website
        - Play music
        - Get weather information
        - Get current time
        - Get latest news

    Args:
        command (str): User input command.

    Returns:
        dict | None:
            Dictionary containing command details if recognized,
            otherwise None.
    """

    # Normalize command for easier comparison
    cmd = command.lower().strip()

    # --------------------------------------------------
    # Website Commands
    # Example: "open youtube"
    # --------------------------------------------------
    if cmd.startswith("open "):

        website = cmd[5:].strip()

        return {
            "type": "website",
            "website": website
        }

    # --------------------------------------------------
    # Music Commands
    # Example: "play shape of you"
    # --------------------------------------------------
    if cmd.startswith("play "):

        song = command[5:].strip()

        return {
            "type": "music",
            "song": song
        }

    # --------------------------------------------------
    # Weather Commands
    # Example: "weather in london"
    # --------------------------------------------------
    if "weather in" in cmd:

        city = cmd.split(
            "weather in" , 1)[1].strip()

        return {
            "type": "weather",
            "city": city
        }

    # --------------------------------------------------
    # Time Commands
    # --------------------------------------------------
    if cmd in [
        "time",
        "what time is it",
        "what time it is",
        "current time",
        "tell me the time",
        "can you tell me the time",
        "whats the time",
        "what's the time"
    ]:

        return {
            "type": "time"
        }

    # --------------------------------------------------
    # News Commands
    # --------------------------------------------------
    if cmd in [
        "news",
        "latest news",
        "today news",
        "today's news"
    ]:

        return {
            "type": "news"
        }

    # --------------------------------------------------
    # No matching command found
    # --------------------------------------------------
    return None