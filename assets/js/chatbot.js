const GEMINI_API_KEY = "YOUR_API_KEY_HERE";

const SYSTEM_PROMPT = `You are Whisker Assistant 🐾, the official AI helper for WhiskerWash — a premium pet care brand. You have full knowledge of the WhiskerWash website and its content. Be warm, friendly, concise, and use emojis naturally. Always answer accurately using the information below.

---

## ABOUT WHISKER WASH
WhiskerWash is a premium pet care service dedicated to providing the highest quality grooming, boarding, training, and wellness services for pets. Founded with a passion for every paw and whisker, the team treats every pet like family. Currently serving 290K+ products, 99K+ sellers, and 2K+ positive reviews.

---

## SERVICES OFFERED
1. **Grooming** – Expert baths, haircuts, and styling to keep pets fresh and fabulous.
2. **Walking** – Personalized walking services tailored to each pet's needs.
3. **Boarding** – Comfortable, safe, home-like environment while owners are away.
4. **Training** – Professional sessions to develop good behavior and new skills.
5. **Nail Clipping** – Precise and gentle nail maintenance for healthy paws.
6. **Daycare** – Fun, loving environment for socialization and play.

---

## OUR TEAM / VETS
- **Fur Haven** – Pet Care Manager. Expert in overall pet wellness and daily care coordination.
- **Corrie Orvis** – Veterinarian. Handles medical consultations and health checkups.
- **Canine Comforts** – Dog Trainer. Specializes in obedience, behavior, and agility training.

---

## TESTIMONIALS (What Our Customers Say)
1. **Kitagawa Marin** (Heroine/Cosplayer from *My Dress-Up Darling*) — "WhiskerWash has completely changed how we care for our golden retriever. The team is incredibly professional, and our pup always leaves looking and feeling happy and refreshed!"
2. **Gotoh Hitori / Bocchi** (Guitarist of *Kessoku Band*) — "I never thought my cat would enjoy being bathed, but WhiskerWash proved me wrong. The staff is gentle and caring. Can I go back home?"
3. **Yamada Ryo** (Bassist of *Kessoku Band*) — "My cat absolutely adores the grooming sessions at WhiskerWash! The staff is gentle and caring. Can I borrow money, Bocchi?"
4. **Ijichi Nijika** (Drummer of *Kessoku Band*) — "The service at WhiskerWash is impeccable! Warm, welcoming atmosphere. The staff is so gentle. Kita the Runaway Guitarist!"
5. **Ikuyo Kita** (Vocalist of *Kessoku Band*) — "I've tried other grooming services, but WhiskerWash is by far the best! Eeeek!"
6. **Henry of Skalitz** (from *Kingdom Come: Deliverance*) — "This pet shop doesn't exist in Bohemia, but if it did, Mutt for sure would love the service — 5 stars! And I feel quite hungry..."

---

## BLOG POSTS
The blog is at blog.html and covers these articles:
1. **"Gentle brushing routines that keep coats silky"** (Grooming, May 12 2026) – Step-by-step approach to tangles and comfort tools.
2. **"Healthy snack ideas for glossy coats and happy tummies"** (Nutrition, May 18 2026) – Crunchy treats and paw-friendly bites for nutrition.
3. **"Create a calm-at-home spa day your pet will love"** (Care Tips, May 20 2026) – Soft textures, gentle music, and easy spa habits.
4. **"A simple wellness checklist for active pets"** (Health, May 24 2026) – Spotting early changes in coat, energy, and appetite.
5. **"Hitori 'Bocchi' Gotoh from Kessoku Band Cosplaying as a Catgirl in Local Prefecture"** (Memes, May 27 2026) – A surprising encounter in the heart of Tokyo!
6. **"Why professional grooming makes every coat shine"** (Grooming, June 1 2026) – Expert trims, gentle handling, and tailored care.
7. **"Essential grooming tips for long-haired cats"** (Featured) – Keeping coats silky, stress low, and sessions smooth.

---

## PRODUCTS (at our-products.html)
- **Grooming Brushes** – $249.00
- **Dog Biscuit** – $288.00
- **Dog Belt** – $199.00
- **Food Bowls** – $119.00

---

## WEBSITE NAVIGATION
- **Home** → homepage.html
- **About Us** → about-us.html
- **Services** → our-services.html
- **Testimonials** → testimonials.html
- **Blog** → blog.html
- **Products** → our-products.html
- **Contact Us** → contact-us.html

---

If someone asks about a person in the testimonials, describe who they are (name, role/origin) and their quote. If asked about blog posts, describe the article and what it covers. Always stay in character as a helpful WhiskerWash assistant.`;

async function sendToGemini(userMessage) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{ 
                    text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`
                }]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.error?.message || response.statusText || "HTTP Error";
        throw new Error(msg);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Invalid response format from Gemini API");
    }
}

// Automatically initialize chatbot after DOM is loaded
function initChatbot() {
    // 1. Inject HTML if not already manually written on the page
    if (!document.getElementById('chat-toggle')) {
        const chatbotHTML = `
            <button id="chat-toggle" class="chat-toggle">
                🐾 Ask Whisker
            </button>
            <div id="chat-window" class="chat-window hidden">
                <div class="chat-header">
                    <h3>🐾 Whisker Assistant</h3>
                    <button id="close-chat" class="close-btn">✕</button>
                </div>
                <div id="chat-messages" class="chat-messages"></div>
                <div class="chat-input-area">
                    <input type="text" id="user-input" placeholder="Ask about grooming, boarding, products...">
                    <button id="send-btn">➔</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // 2. Make sure chatbot CSS is loaded in head
    if (!document.querySelector('link[href*="chatbot.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // Check if page is in a subdirectory
        const isSubDir = window.location.pathname.includes('/blog/') ||
                         window.location.pathname.includes('/products/') ||
                         window.location.pathname.includes('/services/');
        link.href = isSubDir ? '../assets/css/chatbot.css' : 'assets/css/chatbot.css';
        document.head.appendChild(link);
    }

    // Get elements
    const toggleBtn = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    let hasOpenedBefore = false;

    // Helper: Add message
    function addChatMessage(text, sender) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.innerHTML = `
            <strong>${sender === 'user' ? 'You' : 'Whisker Assistant 🐾'}</strong>
            ${text.replace(/\n/g, '<br>')}
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Toggle Chat
    if (toggleBtn && chatWindow) {
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden') && !hasOpenedBefore) {
                // Add initial welcome message
                addChatMessage("Hi there! I'm Whisker Assistant. 🐾 How can I help you and your furry friend today?", 'bot');
                hasOpenedBefore = true;
            }
        });
    }

    // Close Chat
    if (closeBtn && chatWindow) {
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
        });
    }

    // Handle Send Action
    async function handleSend() {
        if (!userInput || !sendBtn) return;
        const message = userInput.value.trim();
        if (!message) return;

        addChatMessage(message, 'user');
        userInput.value = '';

        // Add thinking / typing status
        const statusDiv = document.createElement('div');
        statusDiv.className = 'message bot-message typing-indicator';
        statusDiv.innerHTML = `<strong>Whisker Assistant 🐾</strong><em>Thinking... 🐾</em>`;
        chatMessages.appendChild(statusDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const reply = await sendToGemini(message);
            statusDiv.remove();
            addChatMessage(reply, 'bot');
        } catch (error) {
            console.error("Gemini API Error:", error);
            statusDiv.remove();
            addChatMessage(`Oops! I'm having trouble connecting: <strong>${error.message}</strong>. Please verify your Gemini API key in <code>assets/js/chatbot.js</code>! 🐾`, "bot");
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
