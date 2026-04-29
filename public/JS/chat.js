const divChat = document.querySelectorAll("[data-room]");
if (divChat.length > 0) {
    divChat.forEach(item => {
        item.addEventListener("click", () => {
            const idRoom = item.getAttribute("data-room");
            window.location.href = `/chat/room/${idRoom}`;
        });
    });
}

// Send Message
const formSendMess = document.querySelector("[form-chat]");
if (formSendMess) {
    formSendMess.addEventListener("submit", (e) => {
        e.preventDefault();
        const divBody = document.querySelector(".messages");
        const myID = divBody.getAttribute("myID");
        const valueInput = formSendMess.querySelector("input").value;
        if (valueInput != "") {
            socket.emit("CLIENT_SEND_MESS", {
                myID: myID,
                content: valueInput
            });
            formSendMess.querySelector("input").value = "";
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}

// End Send Mess

//Show Typing
let timeout;
const showTyping = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 5000);
}
//End Show Typing

// Return Mess
socket.on("SERVER_RETURN_MESS", (data) => {
    const divBody = document.querySelector(".messages");
    const myID = divBody.getAttribute("myID");
    const div = document.createElement("div");
    let html = ``;
    let conten = ``;
    let userName = ``;
    if (data.myID == myID) {
        html = `
            <div class="msg-row out">
                <div class="bubble out">${data.content}</div>
            </div>
        `;
    } else {
        html = `
            <div class="msg-row">
                <div class="msg-avatar av-purple">
                    <image src=${data.user.avatar} width="60"
                </div>
            </div>
            <div class="bubble in">${data.content}</div>
        `;
    }
    div.innerHTML = `
        ${html}
    `;
    divBody.appendChild(div);
});

// Emoji-picker-element
import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

const btnIcon = document.querySelector("#emojiBtn");
if (btnIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(btnIcon, tooltip);
    btnIcon.addEventListener("click", () => {
        tooltip.classList.toggle('shown');
    });
}

// icon message
const picker = document.querySelector("emoji-picker");
if (picker) {
    const input = document.querySelector(".chat-input .input-field-wrap input[name='content']");
    picker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;
        input.value = input.value + icon;
        const end = input.value.length
        input.focus();
        input.setSelectionRange(end, end);
        showTyping();
    });
    input.addEventListener("keyup", () => {
        if (input.value != "") {
            socket.emit("CLIENT_SEND_TYPING", "show");
        }
        showTyping();
    });
}

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".messages .inner-list-typing");
if (elementListTyping) {
    const divBody = document.querySelector(".messages");
    socket.on("SERVER_RETURN_TYPING", data => {
        if (data.type == "show") {
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userID}"]`);
            if (!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userID);
                boxTyping.innerHTML = `
                    <div class="inner-name">${data.userName}</div>
                    <div class="msg-avatar av-purple">
                        <image src=${data.avatar} width="30" style="border-radius: 30px;">
                    </div>
                    <div class="typing-bubble">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;

                elementListTyping.appendChild(boxTyping);
            }
        } else {
            const elementRemove = elementListTyping.querySelector(`[user-id="${data.userID}"]`);
            if (elementRemove) {
                elementListTyping.removeChild(elementRemove);
            }
        }
        divBody.scrollTop = divBody.scrollHeight;

    });

}
// End SERVER_RETURN_TYPING
