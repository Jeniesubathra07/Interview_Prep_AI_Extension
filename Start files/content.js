(function () {
    console.log("LinkedIn Chatbox Script Loaded!");

    // Ensure it only runs on LinkedIn
    if (!window.location.href.includes("linkedin.com")) return;

    // Check if button already exists
    if (document.getElementById("chatbox-btn")) return;

    // Create Chatbox Toggle Button (Black Circle)
    const chatButton = document.createElement("button");
    chatButton.id = "chatbox-btn";
    chatButton.innerText = "⚫";
    chatButton.style.position = "fixed";
    chatButton.style.bottom = "20px";
    chatButton.style.right = "20px";
    chatButton.style.width = "50px";
    chatButton.style.height = "50px";
    chatButton.style.backgroundColor = "#0073b1";
    chatButton.style.color = "#fff";
    chatButton.style.border = "none";
    chatButton.style.borderRadius = "50%";
    chatButton.style.fontSize = "24px";
    chatButton.style.cursor = "pointer";
    chatButton.style.zIndex = "9999";
    chatButton.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";

    document.body.appendChild(chatButton);

    // Create Chatbox Container (Initially Hidden)
    const chatContainer = document.createElement("div");
    chatContainer.id = "chatbox-container";
    chatContainer.style.position = "fixed";
    chatContainer.style.bottom = "80px";
    chatContainer.style.right = "20px";
    chatContainer.style.width = "420px";
    chatContainer.style.height = "600px";
    chatContainer.style.backgroundColor = "#fff";
    chatContainer.style.borderRadius = "10px";
    chatContainer.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
    chatContainer.style.display = "none";
    chatContainer.style.overflow = "hidden";
    chatContainer.style.zIndex = "9999";
    chatContainer.innerHTML = `
        <div style="background:#0073b1; color:#fff; padding:10px; text-align:center; font-weight:bold;">
            AI Chatbox
            <button id="close-chatbox" style="float:right; background:none; border:none; color:#fff; font-size:16px; cursor:pointer;">✖</button>
        </div>
        <iframe id="chat-frame" src="${chrome.runtime.getURL("index.html")}" style="width:100%; height:100%; border:none;"></iframe>
    `;

    document.body.appendChild(chatContainer);

    // Toggle Chatbox on Black Circle Click
    chatButton.addEventListener("click", function () {
        chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
    });

    // Close Chatbox Button
    document.getElementById("close-chatbox").addEventListener("click", function () {
        chatContainer.style.display = "none";
    });
})();
