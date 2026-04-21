// CLIENT_REQUEST_FRIEND
const listBtnFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnFriend.length > 0){
    listBtnFriend.forEach(btn =>{
        btn.addEventListener("click", (e)=>{
            const idUser = btn.getAttribute("btn-add-friend");
            const divBody = btn.closest(".friend-actions");
            divBody.classList.add("requested");
            socket.emit("CLIENT_REQUEST_FRIEND", idUser);
        });
    });
}

// CLIENT_CANCEL_FREQUEST
const listBtnCancel = document.querySelectorAll("[btn-cancel-friend]");
console.log(listBtnCancel)
if(listBtnCancel.length > 0){
    listBtnCancel.forEach(btn =>{
        btn.addEventListener("click", (e)=>{
            const idUser = btn.getAttribute("btn-cancel-friend");
            const divBody = btn.closest(".friend-actions");
            divBody.classList.remove("requested");
            console.log(divBody);
            socket.emit("CLIENT_CANCEL_FREQUEST", idUser);
        });
    });
}

// CLIENT_CANCEL_SUGGEST
const listBtnCancelSuggest = document.querySelectorAll("[btn-remove-suggest]");
if(listBtnCancelSuggest.length > 0){
    listBtnCancelSuggest.forEach(btn =>{
        btn.addEventListener("click", (e)=>{
            const idUser = btn.getAttribute("btn-remove-suggest");
            const divBody = btn.closest(".friend-actions");
            divBody.classList.add("unsuggest");
            socket.emit("CLIENT_CANCEL_SUGGEST", idUser);
        });
    });
}

// SERVER_RETURN_LENGTH_REQUEST
const badge = document.querySelector("[data-badge-users-request]");
console.log(badge.getAttribute("data-badge-users-request"))
if(badge){
    socket.on("SERVER_RETURN_LENGTH_REQUEST", (data)=>{
        const myID = badge.getAttribute("data-badge-users-request");
        if(myID == data.myID){
            badge.innerHTML = data.length;
        }
    });
}