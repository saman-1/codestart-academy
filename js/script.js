

const menuToggle = document.querySelector("#menu-toggle");
const navbarList = document.querySelector("#navbar-list");
const navbarLinks = document.querySelectorAll("#navbar-list .link-item");


menuToggle.addEventListener("click", () => {
    const isOpen = navbarList.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "بستن منو" : "باز کردن منو"
    );
});

navbarLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navbarList.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "باز کردن منو");
    });
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        navbarList.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "باز کردن منو");
    }
});

