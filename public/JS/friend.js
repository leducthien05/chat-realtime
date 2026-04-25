// CLIENT_REQUEST_FRIEND
const listBtnFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnFriend.length > 0) {
    listBtnFriend.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idUser = btn.getAttribute("btn-add-friend");
            const divBody = btn.closest(".friend-actions");
            divBody.classList.add("requested");
            socket.emit("CLIENT_REQUEST_FRIEND", idUser);
        });
    });
}

// SERVER_RETURN_REQUEST
const divBody = document.querySelector("[data-accept-friend]");
if (divBody) {
    socket.on("SERVER_RETURN_REQUEST", (data) => {
        const yourID = divBody.getAttribute("data-accept-friend");
        if (yourID == data.userID) {
            const divCard = document.createElement("div");
            let html = ``;
            html = `
                <div class="card" id="cart-friend">
                    <img src="${data.myUser.avatar}" alt="${data.myUser.userName}">
                    <h4>${data.myUser.userName}</h4>
                    <div class="friend-actions">
                        <button class="btn add btn-add btn-accept" btn-accept-friend="${data.myID}">Đồng ý</button>
                        <button class="btn btn-remove" btn-refuse-request="${data.myID}">Từ chối</button>
                        <button class="btn btn-danger btn-sm btn-refuse">Đã từ chối</button>
                        <a class="btn btn-danger btn-sm btn-friend" href="/chat">Nhắn tin</a>
                    </div>
                </div>
            `;
            divCard.innerHTML = html;
            divBody.appendChild(divCard);
            const btnAccept = divCard.querySelector("[btn-accept-friend]");
            btnAccept.addEventListener("click", (e) => {
                const idUser = btnAccept.getAttribute("btn-accept-friend");
                const divBody = btnAccept.closest(".friend-actions");
                divBody.classList.add("friend");
                socket.emit("CLIENT_ACCEPT_FRIEND", idUser);
            });
        }
    });
}

// CLIENT_ACCEPT_FRIEND
const listBtnAccept = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAccept.length > 0) {
    listBtnAccept.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idUser = btn.getAttribute("btn-accept-friend");
            const divBody = btn.closest(".friend-actions");
            divBody.classList.add("friend");
            socket.emit("CLIENT_ACCEPT_FRIEND", idUser);
        });
    });
}



// CLIENT_CANCEL_FREQUEST
const listBtnCancel = document.querySelectorAll("[btn-cancel-friend]");
console.log(listBtnCancel)
if (listBtnCancel.length > 0) {
    listBtnCancel.forEach(btn => {
        btn.addEventListener("click", (e) => {
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
if (listBtnCancelSuggest.length > 0) {
    listBtnCancelSuggest.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idUser = btn.getAttribute("btn-remove-suggest");
            const divBody = btn.closest(".friend-actions");
            divBody.classList.add("unsuggest");
            socket.emit("CLIENT_CANCEL_SUGGEST", idUser);
        });
    });
}

// SERVER_RETURN_LENGTH_REQUEST
const badgeReq = document.querySelector("[data-badge-users-request]");
const badgeAccept = document.querySelector("[data-badge-users-accept]");
if (badgeReq && badgeAccept) {
    socket.on("SERVER_RETURN_LENGTH_REQUEST", (data) => {
        const myID = badgeReq.getAttribute("data-badge-users-request");
        if (myID == data.myID) {
            badgeReq.innerHTML = data.lengthReq;
        }
        const yourID = badgeAccept.getAttribute("data-badge-users-accept");
        if (yourID == data.userID) {
            badgeAccept.innerHTML = data.lengthAccept;
        }
    });
}


// CLIENT_UNFRIEND
const listBtnUnfriend = document.querySelectorAll("[btn-unfriend]");
if (listBtnUnfriend.length > 0) {
    listBtnUnfriend.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idUser = btn.getAttribute("btn-unfriend");
            const divBody = btn.closest(".friend-actions");
            divBody.classList.remove("friend");
            divBody.classList.add("unfriended");
            socket.emit("CLIENT_UNFRIEND", idUser);
        });
    });
}

// SERVER_RETURN_LENGTH_FRIEND
const badgeFriend = document.querySelector("[data-badge-users-friend]");
if (badgeFriend) {
    socket.on("SERVER_RETURN_LENGTH_FRIEND", (data) => {
        const myID = badgeFriend.getAttribute("data-badge-users-friend");
        if (myID == data.myID) {
            badgeFriend.innerHTML = data.lengthFriendA;
        }
        const yourID = badgeFriend.getAttribute("data-badge-users-friend");
        if (yourID == data.userID) {
            badgeFriend.innerHTML = data.lengthFriendB;
        }
    });
}


// CLIENT_REFUSE_FRIEND
const listBtnRefuse = document.querySelectorAll("[btn-refuse-request]");
if (listBtnRefuse.length > 0) {
    listBtnRefuse.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idUser = btn.getAttribute("btn-refuse-request");
            const divBody = btn.closest(".friend-actions");
            divBody.classList.remove("requested");
            divBody.classList.add("refused");
            socket.emit("CLIENT_REFUSE_FRIEND", idUser);
        });
    });
}

// STATUS_ONLINE
const listStatusOnline = document.querySelectorAll("[data-status-online]");
if (listStatusOnline.length > 0) {
    socket.on("STATUS_ONLINE", (data) => {
        const yourID = listStatusOnline[0].getAttribute("data-status-online");
        if (yourID == data.userId) {
            listStatusOnline.forEach(item => {
                if (data.statusOnline === "online") {
                    item.classList.add("online");
                } else {
                    item.classList.remove("online");
                }
            });
        }
    });
}

// Tìm kiếm
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        let url = new URL(window.location.href);
        const inputSearch = formSearch.querySelector("input");
        const value = inputSearch.value;
        if (value) {
            url.searchParams.set("keyword", value);
        }
        window.location.href = url.href;
    });
}