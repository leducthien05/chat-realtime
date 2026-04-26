const divChat = document.querySelectorAll("[data-room]");
console.log(divChat);
if(divChat.length > 0){
    divChat.forEach(item =>{
        item.addEventListener("click", ()=>{
            const idRoom = item.getAttribute("data-room");
            window.location.href = `/chat/room/${idRoom}`;
        });
    });
}

// Send Message
