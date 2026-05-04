// STATUS_ONLINE
const listStatusOnline = document.querySelectorAll("[data-status-online]");
console.log("OK")
if (listStatusOnline.length > 0) {
    socket.on("STATUS_ONLINE", (data) => {
        const yourID = listStatusOnline[0].getAttribute("data-status-online");
        if (yourID == data.userId) {
            listStatusOnline.forEach(item => {
                if (data.statusOnline === "online") {
                    item.classList.add("online-dot");
                } else {
                    item.classList.remove("online-dot");
                }
            });
        }
    });
}