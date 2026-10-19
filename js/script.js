

const menuToggle = document.querySelector("#menu-toggle");
const navbarList = document.querySelector("#navbar-list");
const navbarLinks = document.querySelectorAll("#navbar-list .link-item");
const contactForm = document.querySelector("#contact-form");
const toast = document.querySelector("#toast");


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

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // console.log("فرم ارسال شد!");

    const name = document.querySelector("#contact-name").value.trim();
    const email = document.querySelector("#contact-email").value.trim();
    const message = document.querySelector("#contact-message").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 3) {
        showToast("نام باید حداقل ۳ کاراکتر باشد.");
        return;
    }

    if (!emailPattern.test(email)) {
        showToast("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
        return;
    }

    if (message.length < 10) {
        showToast("پیام باید حداقل ۱۰ کاراکتر باشد.");
        return;
    }

    contactForm.reset();
    showToast("اطلاعات فرم معتبر است.", "success");
});


let toastTimeout;
function showToast(message, type = "error") {
    clearTimeout(toastTimeout);

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.hidden = false;

    toastTimeout = setTimeout(() => {
        toast.hidden = true;
    }, 10000);
}

// showToast("این یک پیام آزمایشی است.", "error");
