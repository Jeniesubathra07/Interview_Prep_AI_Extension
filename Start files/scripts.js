document.addEventListener("DOMContentLoaded", function () {
    const messagesDiv = document.getElementById("messages");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatList = document.querySelector(".sidebar ul");
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const plusBtn = document.getElementById("plusBtn");
    const plusOptions = document.getElementById("plusOptions");

    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [[]]; // Ensure at least one chat exists
    let activeChatIndex = chatHistory.length - 1; // Always start with the last chat

    const newChatBtn = document.createElement("li");
    newChatBtn.textContent = "New Chat";
    chatList.prepend(newChatBtn);
    newChatBtn.addEventListener("click", startNewChat);

    const API_KEY = "AIzaSyDIrYy1oaVF7bXM0MumPPLxsPV_TF9cyHk";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });

    // ☰ Menu Toggle Functionality
    menuBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        sidebar.classList.toggle("open");
    });

    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
            sidebar.classList.remove("open");
        }
    });

    // + Button Functionality
    plusBtn.addEventListener("mouseenter", () => plusOptions.style.display = "flex");
    plusBtn.addEventListener("click", () => plusOptions.style.display = (plusOptions.style.display === "flex") ? "none" : "flex");
    plusOptions.addEventListener("mouseleave", () => plusOptions.style.display = "none");

    function startNewChat() {
        messagesDiv.innerHTML = "";
        chatHistory.push([]); // Start a fresh chat while keeping old ones
        activeChatIndex = chatHistory.length - 1; // Set new chat as active
        saveChatToSidebar();
        saveChatHistory();
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage(message, "user-message");
        saveMessage(message, "user");
        userInput.value = "";

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Answer only interview preparation related topics. User question: ${message}` }] }]
            })
        })
        .then(response => response.json())
        .then(data => {
            const botMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that request.";
            appendMessage(botMessage, "bot-message");
            saveMessage(botMessage, "bot");
        })
        .catch(error => {
            console.error("Error fetching response:", error);
            appendMessage("Error communicating with AI service.", "bot-message");
        });
    }

    function appendMessage(text, className) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${className}`;
        messageDiv.textContent = text;
        messagesDiv.appendChild(messageDiv);
        setTimeout(() => {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 100);
    }

    function saveMessage(text, sender) {
        chatHistory[activeChatIndex].push({ sender, text });
        saveChatHistory();
    }

    function saveChatToSidebar() {
        const chatTitle = `Chat ${chatHistory.length}`;
        const chatItem = createChatListItem(chatTitle, chatHistory.length - 1);
        chatList.appendChild(chatItem);
    }

    function createChatListItem(title, index) {
        const chatItem = document.createElement("li");
        chatItem.textContent = title;
        chatItem.addEventListener("click", () => loadChat(index));
        return chatItem;
    }

    function loadChat(index) {
        messagesDiv.innerHTML = "";
        activeChatIndex = index; // Switch to selected chat
        chatHistory[index].forEach(({ sender, text }) => {
            appendMessage(text, sender === "user" ? "user-message" : "bot-message");
        });
    }

    function saveChatHistory() {
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }

    function loadChatList() {
        chatList.innerHTML = "";
        chatList.appendChild(newChatBtn);
        chatHistory.forEach((_, index) => {
            chatList.appendChild(createChatListItem(`Chat ${index + 1}`, index));
        });
    }

    loadChatList();
    loadChat(activeChatIndex); // Load the last active chat on page load
});
