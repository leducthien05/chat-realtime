const divChat = document.querySelectorAll("[data-room]");
if (divChat.length > 0) {
    divChat.forEach(item => {
        item.addEventListener("click", () => {
            const idRoom = item.getAttribute("data-room");
            window.location.href = `/chat/room/${idRoom}`;
        });
    });
}

const divBody = document.querySelector(".messages");
setTimeout(() => {
    divBody.scrollTop = divBody.scrollHeight;
}, 0);
// Upload-file-with-preview
// register plugin
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
);

const pond = FilePond.create(document.querySelector('.filepond'), {
    labelIdle: '',
    labelDrop: '',
    labelTapToCancel: '',
    labelTapToRetry: '',
    labelTapToUndo: '',
    allowMultiple: true,
    imagePreviewHeight: 120,
    allowImagePreview: true,
    allowImageExifOrientation: true,
    instantUpload: false
});
// click button mở file picker
const btnUpload = document.getElementById("btnUpload");
const inputUpload = document.querySelector(".upload-wrapper");
if (btnUpload) {
    btnUpload.addEventListener("click", () => {
        console.log("đã chạy vào đây")
        document.querySelector('.filepond--browser').click();
        inputUpload.classList.remove("hidden");
    });
}

// Send Message
const formSendMess = document.querySelector("[form-chat]");

if (formSendMess) {
    formSendMess.addEventListener("submit", async (e) => {
        e.preventDefault();

        const divBody = document.querySelector(".messages");
        const myID = divBody.getAttribute("myID");
        console.log(myID);
        const valueInput = formSendMess.querySelector("input").value;

        const files = pond.getFiles();
        const buffers = [];

        for (let item of files) {
            const file = item.file;
            const arrayBuffer = await file.arrayBuffer();
            buffers.push(arrayBuffer);
        }

        if (valueInput !== "" || buffers.length > 0) {
            socket.emit("CLIENT_SEND_MESS", {
                myID,
                content: valueInput,
                image: buffers
            });

            formSendMess.querySelector("input").value = "";
            pond.removeFiles();
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
    const listTyping = document.querySelector(".messages .inner-list-typing");

    let htmlImage = "";

    // 👉 render images
    if (data.image && data.image.length > 0) {
        htmlImage += `<div class="inner-images">`;

        for (const item of data.image) {
            htmlImage += `<img src="${item}" />`;
        }

        htmlImage += `</div>`;
    }

    // 👉 message
    let content = "";
    let message = "";

    if (data.myID == myID) {
        if (data.content) {
            message = `
            <div class="bubble out">
                ${data.content}
            </div>
        `;
        }
        content = `
            <div class="msg-row out">
                ${message}
                ${htmlImage}
            </div>
        `;
    } else {
        if (data.content) {
            message = `
            <div class="bubble in">
                ${data.content}
            </div>
        `;
        }
        content = `
            <div class="msg-row">
                <div class="msg-avatar av-purple">
                    <img src="${data.user.avatar}" width="30" />
                </div>

                ${message}
                ${htmlImage}
            </div>
        `;
    }

    div.innerHTML = content;

    divBody.insertBefore(div, listTyping);
    const gallery = new Viewer(divBody);
    divBody.scrollTop = divBody.scrollHeight;
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

// Preview-full-image
const bodyChatPreviewImage = document.querySelector(".messages");
if(bodyChatPreviewImage){
    const gallery = new Viewer(bodyChatPreviewImage);
}