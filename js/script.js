

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

// Read the saved theme
const savedTheme = localStorage.getItem("theme");

// Apply the saved theme
if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.textContent = "☀️";
    themeToggle.setAttribute("aria-label", "فعال‌کردن حالت روشن");
}

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");

        themeIcon.textContent = "🌙";
        themeToggle.setAttribute("aria-label", "فعال‌کردن حالت تاریک");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");

        themeIcon.textContent = "☀️";
        themeToggle.setAttribute("aria-label", "فعال‌کردن حالت روشن");
    }
});

// Modal Js Codes
const authModal = document.querySelector("#auth-modal");
const authModalOverlay = document.querySelector("#auth-modal-overlay");
const authModalClose = document.querySelector("#auth-modal-close");
const authModalTitle = document.querySelector("#auth-modal-title");
const authModalDescription = document.querySelector("#auth-modal-description");
const authForm = document.querySelector("#auth-form");
const authSwitchBtn = document.querySelector("#auth-switch-btn");
const authSubmitBtn = document.querySelector(".auth-submit-btn");

const authEmailInput = document.querySelector("#auth-email");
const authPasswordInput = document.querySelector("#auth-password");
const confirmPasswordInput = document.querySelector("#auth-confirm-password");
const confirmPasswordGroup = document.querySelector("#confirm-password-group");
const authFormMessage = document.querySelector("#auth-form-message");

const authButtons = document.querySelectorAll(
    "#desktop-signup-btn, #desktop-signin-btn, #mobile-signup-btn, #mobile-signin-btn"
);

let authMode = "signin";

function clearAuthErrors() {
    authFormMessage.textContent = "";
    authFormMessage.className = "auth-form-message";

    [authEmailInput, authPasswordInput, confirmPasswordInput].forEach((input) => {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
    });
}

function showAuthMessage(message, type = "error") {
    authFormMessage.textContent = message;
    authFormMessage.className = `auth-form-message is-${type}`;
}

function openAuthModal(mode) {
    authMode = mode;

    const isSignup = authMode === "signup";

    authModalTitle.textContent = isSignup
        ? "ایجاد حساب کاربری"
        : "ورود به حساب کاربری";

    authModalDescription.textContent = isSignup
        ? "برای ساخت حساب، اطلاعاتت رو وارد کن."
        : "برای ادامه، اطلاعات حساب خودت رو وارد کن.";

    authSubmitBtn.textContent = isSignup ? "ثبت نام" : "ورود";
    authSwitchBtn.textContent = isSignup ? "ورود" : "ثبت نام";

    confirmPasswordGroup.hidden = !isSignup;
    confirmPasswordInput.disabled = !isSignup;
    confirmPasswordInput.required = isSignup;

    authPasswordInput.autocomplete = isSignup
        ? "new-password"
        : "current-password";

    authForm.reset();
    clearAuthErrors();

    authModal.classList.add("is-open");
    authModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    authEmailInput.focus();
}

function closeAuthModal() {
    authModal.classList.remove("is-open");
    authModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    clearAuthErrors();
    authForm.reset();
}

authButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const mode = button.classList.contains("signup-btn")
            ? "signup"
            : "signin";

        openAuthModal(mode);
    });
});

authModalClose.addEventListener("click", closeAuthModal);
authModalOverlay.addEventListener("click", closeAuthModal);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && authModal.classList.contains("is-open")) {
        closeAuthModal();
    }
});

authSwitchBtn.addEventListener("click", () => {
    openAuthModal(authMode === "signin" ? "signup" : "signin");
});

[authEmailInput, authPasswordInput, confirmPasswordInput].forEach((input) => {
    input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");

        authFormMessage.textContent = "";
        authFormMessage.className = "auth-form-message";
    });
});

authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAuthErrors();

    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!email) {
        authEmailInput.classList.add("is-invalid");
        authEmailInput.setAttribute("aria-invalid", "true");
        showAuthMessage("لطفاً ایمیلت رو وارد کن.");
        authEmailInput.focus();
        return;
    }

    if (!authEmailInput.validity.valid) {
        authEmailInput.classList.add("is-invalid");
        authEmailInput.setAttribute("aria-invalid", "true");
        showAuthMessage("لطفاً یک آدرس ایمیل معتبر وارد کن.");
        authEmailInput.focus();
        return;
    }

    if (!password) {
        authPasswordInput.classList.add("is-invalid");
        authPasswordInput.setAttribute("aria-invalid", "true");
        showAuthMessage("لطفاً رمز عبورت رو وارد کن.");
        authPasswordInput.focus();
        return;
    }

    if (password.length < 8) {
        authPasswordInput.classList.add("is-invalid");
        authPasswordInput.setAttribute("aria-invalid", "true");
        showAuthMessage("رمز عبور باید حداقل ۸ کاراکتر داشته باشه.");
        authPasswordInput.focus();
        return;
    }

    if (authMode === "signup" && password !== confirmPassword) {
        confirmPasswordInput.classList.add("is-invalid");
        confirmPasswordInput.setAttribute("aria-invalid", "true");
        showAuthMessage("رمز عبور و تکرار اون با هم مطابقت ندارن.");
        confirmPasswordInput.focus();
        return;
    }

    if (authMode === "signup") {
        showAuthMessage(
            "اعتبارسنجی انجام شد؛ ثبت‌نام واقعی هنوز به بک‌اند نیاز داره.",
            "success"
        );
    } else {
        showAuthMessage(
            "اطلاعات از نظر اولیه معتبره؛ ورود واقعی هنوز پیاده‌سازی نشده.",
            "success"
        );
    }
});

const passwordToggleButtons = document.querySelectorAll(".password-toggle");

passwordToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.target;
        const passwordInput = document.getElementById(targetId);

        if (!passwordInput) return;

        const isPasswordHidden = passwordInput.type === "password";

        passwordInput.type = isPasswordHidden ? "text" : "password";

        button.setAttribute(
            "aria-pressed",
            String(isPasswordHidden)
        );

        button.setAttribute(
            "aria-label",
            isPasswordHidden
                ? "مخفی کردن رمز عبور"
                : "نمایش رمز عبور"
        );
    });
});
