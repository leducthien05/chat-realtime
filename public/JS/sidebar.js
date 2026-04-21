const listMenu = document.querySelectorAll("[menu-item]");
if(listMenu.length > 0){
    listMenu.forEach(item =>{
        const href = window.location.href;
        const taga = item.querySelector("a");
        const linka = taga.href;
        if(href.startsWith(linka)){
            item.classList.add("active");
        }
    });
}