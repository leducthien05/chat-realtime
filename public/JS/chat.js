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
        }
    });
}

// End Send Mess

// Return Mess
socket.on("SERVER_RETURN_MESS", (data)=>{
    const divBody = document.querySelector(".messages");
    const myID = divBody.getAttribute("myID");
    const div = document.createElement("div");
    let html = ``;
    let conten = ``;
    let userName = ``;
    if(data.myID == myID){
        html = `
            <div class="msg-row out">
                <div class="bubble out">${data.content}</div>
            </div>
        `;
    }else{
        html = `
            <div class="msg-row">
                <div class="msg-avatar av-purple">${data.userName} </div>
            </div>
            <div class="bubble in">${data.content}</div>
        `;
    }
    div.innerHTML = `
        ${html}
    `;
    divBody.appendChild(div);
});