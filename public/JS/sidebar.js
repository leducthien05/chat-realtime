const listMenu = document.querySelectorAll("[menu-item]");

if (listMenu.length > 0) {
    const href = window.location.pathname;

    for (const item of listMenu) {
        const taga = item.querySelector("a");
        const linka = taga.getAttribute("href");

        // ✅ Trang chủ
        if (linka === "/" && href === "/") {
            item.classList.add("active");
            break;
        }

        // ✅ Trang khác (tránh "/" và match đúng prefix)
        if (linka !== "/" && href.startsWith(linka + "/") || href === linka) {
            item.classList.add("active");
            break;
        }
    }
}