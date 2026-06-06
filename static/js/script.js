const chatContainer = document.getElementById("chat-container");
const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const typingIndicator = document.getElementById("typing-indicator");
const clearBtn = document.getElementById("clear-chat-btn");
const themeBtn = document.getElementById("theme-toggle");
const voiceBtn = document.getElementById("voice-btn");
const activateBtn = document.getElementById("activate-btn");


const statusDot =
document.getElementById(
    "status-dot"
);

const statusText =
document.getElementById(
    "status-text"
);

messageInput.addEventListener(
    "input",
    () => {

        messageInput.style.height =
        "auto";

        messageInput.style.height =
        messageInput.scrollHeight +
        "px";
    }
);


let assistantMode = false;
let autoSendVoice = false;
let speechDetected = false;

const assistantModeBtn =
document.getElementById(
    "assistant-mode-btn"
);
assistantModeBtn.addEventListener(
    "click",
    () => {

        assistantMode =
        !assistantMode;

        assistantModeBtn.classList.toggle(
            "assistant-active"
        );

        speak(
            assistantMode
            ? "Hands free mode activated"
            : "Hands free mode deactivated"
        );

    }
);


function speak(text) {

    speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onend = () => {

        if(assistantMode){

            setTimeout(() => {

                try{

                    recognition.start();

                }catch(err){}

            }, 500);
        }
    };

    speechSynthesis.speak(speech);
}

function setOnlineStatus(){

    statusDot.classList.remove(
        "error"
    );

    statusText.innerText =
        "System Online";
}

function setErrorStatus(){

    statusDot.classList.add(
        "error"
    );

    statusText.innerText =
        "System Error";
}


/* -----------------------------
   LOCAL STORAGE
------------------------------*/

let messages = JSON.parse(localStorage.getItem("jarvis-chat")) || [];

function saveMessages() {
    localStorage.setItem(
        "jarvis-chat",
        JSON.stringify(messages)
    );
}

/* -----------------------------
   CHAT UI
------------------------------*/

function scrollBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = `message ${sender}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";

    avatar.innerHTML =
        sender === "user"
            ? '<i class="fas fa-user"></i>'
            : '<i class="fas fa-robot"></i>';

    const content = document.createElement("div");
    content.className = "message-content";

    content.innerHTML =marked.parse(text);

    message.appendChild(avatar);
    message.appendChild(content);

    if (sender === "bot") {

        const copyBtn = document.createElement("button");

        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';

        copyBtn.style.marginLeft = "10px";
        copyBtn.style.cursor = "pointer";

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(text);
            copyBtn.innerHTML =
                '<i class="fas fa-check"></i>';

            setTimeout(() => {
                copyBtn.innerHTML =
                    '<i class="fas fa-copy"></i>';
            }, 1500);
        };

        content.appendChild(document.createElement("br"));
        content.appendChild(copyBtn);
    }

    chatContainer.appendChild(message);

    scrollBottom();
}

/* -----------------------------
   LOAD OLD CHATS
------------------------------*/

function loadHistory() {

    if (messages.length === 0) return;

    chatContainer.innerHTML = "";

    messages.forEach(msg => {

        addMessage(
            msg.text,
            msg.sender
        );

    });

}

loadHistory();

if(messages.length === 0){

    chatContainer.innerHTML =
        getWelcomeMessage();
}

/* -----------------------------
   SEND MESSAGE
------------------------------*/

async function sendMessage() {

    const message = messageInput.value.trim();

    if (!message) return;

    addMessage(message, "user");

    messages.push({
        sender: "user",
        text: message
    });

    saveMessages();

    messageInput.value = "";

    typingIndicator.classList.remove("hidden");

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        if(!response.ok){

            throw new Error(
                "Server Error"
            );

        }

        const data = await response.json();

        if(data.type === "news") {

            typingIndicator.classList.add(
                "hidden"
            );

            let newsText =
                "Top Headlines:\n\n";

            data.headlines.forEach(
                (headline, index) => {

                    newsText +=
                    `${index + 1}. ${headline}\n\n`;
                }
            );

            addMessage(
                newsText,
                "bot"
            );

            messages.push({
                sender: "bot",
                text: newsText
            });

            saveMessages();

            speak(
                "Here are today's top headlines"
            );

            return;
        }

        if(data.type === "weather") {

            typingIndicator.classList.add(
                "hidden"
            );

            const weather =
                data.weather;

            const weatherText =

                `Weather in ${weather.city}

        Temperature:
        ${weather.temp}°C

        Humidity:
        ${weather.humidity}%

        Condition:
        ${weather.description}`;

            addMessage(
                weatherText,
                "bot"
            );

            messages.push({
                sender: "bot",
                text: weatherText
            });

            saveMessages();

            speak(
                `Current temperature in
                ${weather.city}
                is ${weather.temp}
                degrees Celsius`
            );

            return;
        }

        if(data.type === "music") {

            typingIndicator.classList.add(
                "hidden"
            );

            messages.push({
                sender: "bot",
                text: `Playing ${data.song}...`
            });

            saveMessages();

            speak(
                `Playing ${data.song}`
            );

            addMessage(
                `🎵 Playing ${data.song}`,
                "bot"
            );

            const musicMessage =
                document.createElement("div");

            musicMessage.className =
                "message bot";

            musicMessage.innerHTML = `
                <div class="avatar">
                    <i class="fas fa-robot"></i>
                </div>

                <div class="message-content">
                    <iframe
                        src="https://www.youtube.com/embed/${data.video_id}?autoplay=1"
                        allow="autoplay"
                        allowfullscreen>
                    </iframe>
                    <br><br>
                    <a
                        href="https://www.youtube.com/watch?v=${data.video_id}"
                        target="_blank"
                        class="youtube-link"
                    >
                        ▶ Open in YouTube
                    </a>
                </div>
            `;

            chatContainer.appendChild(
                musicMessage
            );

            scrollBottom();

            return;
        }

        if(data.type === "time") {

            typingIndicator.classList.add(
                "hidden"
            );

            addMessage(
                `Current time is ${data.time}`,
                "bot"
            );

            messages.push({
                sender: "bot",
                text: `Current time is ${data.time}`
            });

            saveMessages();

            speak(
                `Current time is ${data.time}`
            );

            return;
        }


        if(data.type === "website") {

            typingIndicator.classList.add(
                "hidden"
            );

            addMessage(
                `Opening ${data.website}...`,
                "bot"
            );

            messages.push({
                sender: "bot",
                text: `Opening ${data.website}...`
            });

            saveMessages();

            speak(
                `Opening ${data.website}`
            );

            let site =
                data.website
                .toLowerCase()
                .trim();

            const knownSites = {

                "youtube":
                "https://www.youtube.com",

                "google":
                "https://www.google.com",

                "github":
                "https://github.com",

                "linkedin":
                "https://www.linkedin.com",

                "instagram":
                "https://www.instagram.com",

                "reddit":
                "https://www.reddit.com",

                "facebook":
                "https://www.facebook.com",

                "x":
                "https://x.com",

                "twitter":
                "https://x.com",

                "chatgpt":
                "https://chatgpt.com",

                "spotify":
                "https://open.spotify.com",

                "netflix":
                "https://www.netflix.com",

                "amazon":
                "https://www.amazon.in",

                "flipkart":
                "https://www.flipkart.com",

                "leetcode":
                "https://leetcode.com",

                "geeksforgeeks":
                "https://www.geeksforgeeks.org",

                "stackoverflow":
                "https://stackoverflow.com",

                "wikipedia":
                "https://www.wikipedia.org",

                "iit kanpur":
                "https://www.iitk.ac.in",

                "iit delhi":
                "https://home.iitd.ac.in",

                "iit bombay":
                "https://www.iitb.ac.in",

                "iit madras":
                "https://www.iitm.ac.in"
            };

            let url =
                knownSites[site];

            if(!url){

                url =
                `https://www.google.com/search?q=${encodeURIComponent(site)}`;
            }

            setTimeout(() => {

                const newWindow =
                    window.open(
                        url,
                        "_blank"
                    );

                if(newWindow){
                    newWindow.focus();
                }

            }, 1000);

            return;
        }

        typingIndicator.classList.add("hidden");

        if (data.error) {

            setErrorStatus();

            addMessage(
                data.error,
                "bot"
            );

            setTimeout(() => {

                setOnlineStatus();

            },5000);

            return;
        }

        addMessage(
            data.reply,
            "bot"
        );

        speak(
            data.reply.slice(0, 300)
        );
        
        messages.push({
            sender: "bot",
            text: data.reply
        });

        saveMessages();

    } catch (error) {

        setErrorStatus();

        typingIndicator.classList.add(
            "hidden"
        );

        addMessage(
            "Something went wrong.",
            "bot"
        );

        console.error(error);

        setTimeout(() => {

            setOnlineStatus();

        }, 5000);

    }

}

/* -----------------------------
   EVENTS
------------------------------*/

sendBtn.addEventListener(
    "click",
    sendMessage
);

messageInput.addEventListener(
    "keydown",
    function (e) {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();
        }

    }
);

/* -----------------------------
   CLEAR CHAT
------------------------------*/


function getWelcomeMessage() {

    return `

    <div class="message bot">

        <div class="avatar">
            <i class="fas fa-robot"></i>
        </div>

        <div class="message-content">

            JARVIS ONLINE

            <br><br>

            Available Commands:

            <br>

            • Open Any Website

            <br>

            • Play Any Song

            <br>

            • Weather in Cityname

            <br>

            • Latest News

            <br>

            • Current Time

            <br>

            • Ask Any Question

        </div>

    </div>

    `;
}



clearBtn.addEventListener(
    "click",
    () => {

        if (
            confirm(
                "Clear all chat history?"
            )
        ) {

            localStorage.removeItem(
                "jarvis-chat"
            );

            messages = [];

            chatContainer.innerHTML = getWelcomeMessage();

        }
    }
);

/* -----------------------------
   DARK MODE
------------------------------*/

const theme =
    localStorage.getItem("theme");

if (theme === "light") {

    document.body.classList.add(
        "light-mode"
    );

}

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-mode"
        );

        if (
            document.body.classList.contains(
                "light-mode"
            )
        ) {

            localStorage.setItem(
                "theme",
                "light"
            );

        } else {

            localStorage.setItem(
                "theme",
                "dark"
            );
        }
    }
);

/* -----------------------------
   VOICE INPUT
------------------------------*/

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
    
    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;

    voiceBtn.addEventListener(
        "click",
        () => {

            try{

                recognition.start();

            }catch(err){}

            voiceBtn.innerHTML =
                '<i class="fas fa-microphone-lines"></i>';

        }
    );

    recognition.onresult = function(event) {

        speechDetected = true;

        const transcript =
            event.results[0][0].transcript.trim();

        messageInput.value = transcript;

        messageInput.focus();

        messageInput.style.height = "auto";
        messageInput.style.height =
            messageInput.scrollHeight + "px";

        if(autoSendVoice || assistantMode){

            autoSendVoice = false;

            if(transcript.length < 8){
                return;
            }

            sendMessage();
        }
    };

    recognition.onend = () => {

        voiceBtn.innerHTML =
            '<i class="fas fa-microphone"></i>';

        if(
            assistantMode &&
            !speechDetected
        ){

            setTimeout(() => {

                try{

                    recognition.start();

                }catch(err){}

            }, 500);
        }

        speechDetected = false;
    };


    recognition.onerror = (event) => {

    console.log(
        "Recognition error:",
        event.error
    );

    };

} else {

    voiceBtn.style.display =
        "none";

}

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            speak(
                "Initializing Jarvis. Ready to assist."
            );

        }, 1000);
    }
);


    activateBtn.addEventListener(
        "click",
        () => {

            if(!recognition){

                alert(
                    "Speech recognition not supported."
                );

                return;
            }

            autoSendVoice = true;

            speak("Listening");

            try{

                recognition.start();

            }catch(err){}
        }
    );