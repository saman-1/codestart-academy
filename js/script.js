

const menuToggle = document.querySelector("#menu-toggle");
const navbarList = document.querySelector("#navbar-list");
const navbarLinks = document.querySelectorAll("#navbar-list .link-item");
const contactForm = document.querySelector("#contact-form");
const toast = document.querySelector("#toast");
const formInputs = document.querySelectorAll(
    "#contact-form input, #contact-form textarea"
);
const submitButton = contactForm.querySelector(
    'button[type="submit"]'
);


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
    const nameInput = document.querySelector("#contact-name");
    const nameError = nameInput.nextElementSibling;
    const email = document.querySelector("#contact-email").value.trim();
    const emailInput = document.querySelector("#contact-email");
    const emailError = emailInput.nextElementSibling;
    const message = document.querySelector("#contact-message").value.trim();
    const messageInput = document.querySelector("#contact-message");
    const messageError = messageInput.nextElementSibling;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 3) {
        nameInput.classList.add("is-invalid");
        nameError.textContent = "نام باید حداقل ۳ کاراکتر باشد.";

        showToast("نام باید حداقل ۳ کاراکتر باشد.");
        return;
    }

    nameInput.classList.remove("is-invalid");
    nameError.textContent = "";

    if (!emailPattern.test(email)) {
        emailInput.classList.add("is-invalid");
        emailError.textContent = "لطفاً یک آدرس ایمیل معتبر وارد کنید.";

        showToast("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
        return;
    }

    emailInput.classList.remove("is-invalid");
    emailError.textContent = "";

    if (message.length < 10) {
        messageInput.classList.add("is-invalid");
        messageError.textContent = "پیام باید حداقل ۱۰ کاراکتر باشد.";

        showToast("پیام باید حداقل ۱۰ کاراکتر باشد.");
        return;
    }

    messageInput.classList.remove("is-invalid");
    messageError.textContent = "";

    submitButton.disabled = true;
    submitButton.textContent = "در حال ارسال ...";

    setTimeout(() => {
        contactForm.reset();

        showToast(
            "اعتبار سنجی موفق بود اما ارسال واقعی هنوز فعال نیست.",
            "success"
        );

        submitButton.disabled = false;
        submitButton.textContent = "ارسال پیام";
    }, 1000);
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

formInputs.forEach((input) => {
    input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
        input.nextElementSibling.textContent = "";
    });
});

// Dark / Light Theme
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        themeIcon.textContent = "🌙";
        themeToggle.setAttribute("aria-label", "فعال‌کردن حالت تاریک");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        themeIcon.textContent = "☀️";
        themeToggle.setAttribute("aria-label", "فعال‌کردن حالت روشن");
    }
});
