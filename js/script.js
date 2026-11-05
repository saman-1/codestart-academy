
const menuToggle = document.querySelector("#menu-toggle");
const navbarList = document.querySelector("#navbar-list");

// Mobile Navigation
if (menuToggle && navbarList) {
    const navbarLinks = document.querySelectorAll("#navbar-list .link-item");

    menuToggle.addEventListener("click", () => {
        const isOpen = navbarList.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
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
}



// Contact Form
const contactForm = document.querySelector("#contact-form");
const toast = document.querySelector("#toast");

if (contactForm) {
    const formInputs = contactForm.querySelectorAll("input, textarea");
    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = document.querySelector("#contact-name");
        const emailInput = document.querySelector("#contact-email");
        const messageInput = document.querySelector("#contact-message");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        const nameError = nameInput.nextElementSibling;
        const emailError = emailInput.nextElementSibling;
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
                "اعتبارسنجی موفق بود اما ارسال واقعی هنوز فعال نیست.",
                "success"
            );

            submitButton.disabled = false;
            submitButton.textContent = "ارسال پیام";
        }, 1000);
    });

    formInputs.forEach((input) => {
        input.addEventListener("input", () => {
            input.classList.remove("is-invalid");
            input.nextElementSibling.textContent = "";
        });
    });
}


// Toast Notification
let toastTimeout;

function showToast(message, type = "error") {
    if (!toast) return;

    clearTimeout(toastTimeout);

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.hidden = false;

    toastTimeout = setTimeout(() => {
        toast.hidden = true;
    }, 10000);
}



// Dark / Light Theme
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const siteLogo = document.querySelector("#site-logo");

function updateLogo() {
    if (!siteLogo) return;

    const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";

    siteLogo.src = isDark
        ? "./images/logo-dark.png"
        : "./images/logo-light.png";
}

// Read and apply the saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
} else {
    document.documentElement.removeAttribute("data-theme");
}

function updateThemeControls() {
    if (!themeToggle || !themeIcon) return;

    const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";

    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تاریک"
    );
}

updateLogo();
updateThemeControls();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }

        updateThemeControls();
        updateLogo();
    });
}



// Modal JS Codes
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

if (
    authModal &&
    authModalOverlay &&
    authModalClose &&
    authModalTitle &&
    authModalDescription &&
    authForm &&
    authSwitchBtn &&
    authSubmitBtn &&
    authEmailInput &&
    authPasswordInput &&
    confirmPasswordInput &&
    confirmPasswordGroup &&
    authFormMessage
) {
    function clearAuthErrors() {
        authFormMessage.textContent = "";
        authFormMessage.className = "auth-form-message";

        [authEmailInput, authPasswordInput, confirmPasswordInput].forEach(
            (input) => {
                input.classList.remove("is-invalid");
                input.removeAttribute("aria-invalid");
            }
        );
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
        if (
            event.key === "Escape" &&
            authModal.classList.contains("is-open")
        ) {
            closeAuthModal();
        }
    });

    authSwitchBtn.addEventListener("click", () => {
        openAuthModal(authMode === "signin" ? "signup" : "signin");
    });

    [authEmailInput, authPasswordInput, confirmPasswordInput].forEach(
        (input) => {
            input.addEventListener("input", () => {
                input.classList.remove("is-invalid");
                input.removeAttribute("aria-invalid");

                authFormMessage.textContent = "";
                authFormMessage.className = "auth-form-message";
            });
        }
    );

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
}

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


// Search Box Toggle
const searchToggle = document.querySelector("#search-toggle");
const searchBox = document.querySelector("#search-box");

// Open Search Box
if (searchToggle && searchBox) {
    searchToggle.addEventListener("click", () => {
        searchBox.hidden = false;
        document.querySelector("#course-search").focus();
        searchToggle.setAttribute("aria-expanded", "true");
    });
}

// Close Search Box
const searchClose = document.querySelector("#search-close");

if (searchClose && searchBox) {
    searchClose.addEventListener("click", () => {
        searchBox.hidden = true;
        searchToggle.setAttribute("aria-expanded", "false");
    });
}

let activeCategory = "all";
let searchValue = "";
let activeSort = "newest";
let currentPage = 1;
const coursesPerPage = 6;

// Filter Courses
function filterCourses() {
    let filteredCourses = courses;

    // Filter Favorite Courses
    if (window.location.pathname.endsWith("favorites.html")) {
        filteredCourses = filteredCourses.filter(course =>
            favoriteCourses.includes(course.id)
        );
    }

    // Filter by category
    if (activeCategory !== "all") {
        filteredCourses = filteredCourses.filter(course =>
            course.categories.includes(activeCategory)
        );
    }

    // Filter by search
    if (searchValue) {
        filteredCourses = filteredCourses.filter(course =>
            course.title.toLowerCase().includes(searchValue) ||
            course.categories.some(category =>
                category.toLowerCase().includes(searchValue)
            )
        );
    }

    filteredCourses = [...filteredCourses];

    // Sort Courses
    switch (activeSort) {
        case "newest":
            filteredCourses.sort((a, b) => b.id - a.id);
            break;

        case "oldest":
            filteredCourses.sort((a, b) => a.id - b.id);
            break;

        case "beginner":
            filteredCourses.sort((a, b) => {
                const aIsBeginner = a.label === "مقدماتی";
                const bIsBeginner = b.label === "مقدماتی";

                return Number(bIsBeginner) - Number(aIsBeginner);
            });
            break;

        case "intermediate":
            filteredCourses.sort((a, b) => {
                const aIsIntermediate = a.label === "متوسط";
                const bIsIntermediate = b.label === "متوسط";

                return Number(bIsIntermediate) - Number(aIsIntermediate);
            });
            break;

        case "pro":
            filteredCourses.sort((a, b) => {
                const aIsAdvanced = a.label === "پیشرفته";
                const bIsAdvanced = b.label === "پیشرفته";

                return Number(bIsAdvanced) - Number(aIsAdvanced);
            });
            break;
    }

    renderCourses(filteredCourses);
}

// Course Search
const courseSearch = document.querySelector("#course-search");

if (courseSearch) {
    courseSearch.addEventListener("input", () => {
        searchValue = courseSearch.value.trim().toLowerCase();
        currentPage = 1;
        filterCourses();
    });
}

// Course Category Filter
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        activeCategory = button.dataset.category;
        currentPage = 1;

        filterCourses();
    });
});


// Course Sorting
const courseSort = document.querySelector("#course-sort");

if (courseSort) {
    courseSort.addEventListener("change", () => {
        activeSort = courseSort.value;
        currentPage = 1;
        filterCourses();
    });
}

// Clear Filters
const clearFiltersButton = document.querySelector("#clear-filters");

if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
        activeCategory = "all";
        searchValue = "";
        activeSort = "newest";

        currentPage = 1;

        const courseSearch = document.querySelector("#course-search");
        const courseSort = document.querySelector("#course-sort");

        if (courseSearch) courseSearch.value = "";
        if (courseSort) courseSort.value = "newest";

        categoryButtons.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.category === "all"
            );
        });

        filterCourses();
    });
}


// Course Cards Data
const courses = [
    {
        id: 1,
        title: "آموزش HTML",
        categories: ["HTML", "Front-end"],
        image: "./images/courses-img/HTML_Course.png",
        label: "مقدماتی",
        description: "اولین قدم برای ساخت صفحات وب را بردار و وب‌سایت خودت را طراحی کن.",
        level: "مناسب برای شروع",
        link: "./html_course.html"
    },
    {
        id: 2,
        title: "آموزش CSS",
        categories: ["CSS", "Front-end"],
        image: "./images/courses-img/CSS_Course.png",
        label: "متوسط",
        description: "با CSS ظاهر صفحات وب را زیبا و حرفه‌ای طراحی کن.",
        level: "آشنایی با HTML",
        link: "./css_course.html"
    },
    {
        id: 3,
        title: "آموزش JavaScript",
        categories: ["JavaScript", "Programming", "Front-end"],
        image: "./images/courses-img/JS_Course.png",
        label: "متوسط",
        description: "با JavaScript به صفحات وب خودت تعامل و پویایی اضافه کن.",
        level: "آشنایی با HTML و CSS",
        link: "./js_course.html"
    },
    {
        id: 4,
        title: "آموزش Python",
        categories: ["Python", "Programming"],
        image: "./images/courses-img/Python_Course.png",
        label: "مقدماتی",
        description: "با زبان Python برنامه‌نویسی رو یاد بگیر و اولین برنامه‌های خودت رو بساز.",
        level: "مناسب برای شروع",
        link: "./python_course.html"
    },
    {
        id: 5,
        title: "آموزش Bootstrap",
        categories: ["CSS", "Framework", "Front-end"],
        image: "./images/courses-img/Bootstrap_Course.png",
        label: "مقدماتی",
        description: "با Bootstrap سریع‌تر و ساده‌تر صفحات واکنش‌گرا طراحی کن.",
        level: "آشنایی با HTML و CSS",
        link: "#"
    },
    {
        id: 6,
        title: "آموزش Tailwind CSS",
        categories: ["CSS", "Framework", "Front-end"],
        image: "./images/courses-img/Tailwind_Course.png",
        label: "متوسط",
        description: "با کلاس‌های کاربردی Tailwind رابط‌های کاربری مدرن بساز.",
        level: "آشنایی با HTML و CSS",
        link: "#"
    },
    {
        id: 7,
        title: "آموزش Python پیشرفته",
        categories: ["Python", "Programming"],
        image: "./images/courses-img/Python_Advanced.png",
        label: "پیشرفته",
        description: "مفاهیم پیشرفته پایتون را با تمرین‌های کاربردی یاد بگیر.",
        level: "آشنایی با Python",
        link: "#"
    },
    {
        id: 8,
        title: "آموزش Git و GitHub",
        categories: ["Git", "Programming", "Github"],
        image: "./images/courses-img/Git_Course.png",
        label: "مقدماتی",
        description: "مدیریت نسخه پروژه‌ها و کار تیمی با Git و GitHub.",
        level: "مناسب برای شروع",
        link: "#"
    },
    {
        id: 9,
        title: "آموزش React",
        categories: ["JavaScript", "Framework", "Front-end"],
        image: "./images/courses-img/React_Course.png",
        label: "متوسط",
        description: "با React رابط‌های کاربری پویا و کامپوننت‌محور بساز.",
        level: "آشنایی با JavaScript",
        link: "#"
    },
    {
        id: 10,
        title: "آموزش PHP",
        categories: ["PHP", "Programming"],
        image: "./images/courses-img/PHP_Course.png",
        label: "مقدماتی",
        description: "برنامه‌نویسی سمت سرور را با PHP شروع کن.",
        level: "مناسب برای شروع",
        link: "#"
    },
    {
        id: 11,
        title: "آموزش MySQL",
        categories: ["SQL", "Back-end"],
        image: "./images/courses-img/MySQL_Course.png",
        label: "متوسط",
        description: "ساخت و مدیریت پایگاه داده با MySQL را یاد بگیر.",
        level: "آشنایی با SQL",
        link: "#"
    },
    {
        id: 12,
        title: "آموزش طراحی UI/UX",
        categories: ["Front-end"],
        image: "./images/courses-img/UIUX_Course.png",
        label: "مقدماتی",
        description: "اصول طراحی تجربه و رابط کاربری را یاد بگیر.",
        level: "مناسب برای شروع",
        link: "#"
    },
    {
        id: 13,
        title: "آموزش Node.js",
        categories: ["JavaScript", "Framework", "Back-end"],
        image: "./images/courses-img/NodeJS_Course.png",
        label: "متوسط",
        description: "با JavaScript در سمت سرور برنامه‌نویسی کن.",
        level: "آشنایی با JavaScript",
        link: "#"
    },
    {
        id: 14,
        title: "آموزش الگوریتم و ساختمان داده",
        categories: ["Programming", "Algoritm"],
        image: "./images/courses-img/Algorithm_Course.png",
        label: "پیشرفته",
        description: "مهارت حل مسئله و طراحی الگوریتم را تقویت کن.",
        level: "آشنایی با برنامه‌نویسی",
        link: "#"
    }
];

function renderCourses(courseList = courses) {
    const coursesContainer = document.querySelector("#courses-container");

    if (!coursesContainer) return;

    const coursesCount = document.querySelector("#courses-count");

    if (coursesCount) {
        coursesCount.textContent = courseList.length;
    }

    if (courseList.length === 0) {
        coursesContainer.innerHTML = `
            <div class="no-courses-message">
                ${window.location.pathname.endsWith("favorites.html")
                    ? `
                        <h3>هنوز دوره‌ای به علاقه‌مندی‌ها اضافه نکرده‌ای!</h3>
                        <p>با انتخاب علامت قلب روی دوره‌ها، آن‌ها را اینجا ذخیره کن.</p>
                    `
                    : `
                        <h3>دوره‌ای پیدا نشد!</h3>
                        <p>لطفاً عبارت جست‌وجو یا دسته‌بندی دیگری انتخاب کن.</p>
                    `
                }
            </div>
        `;
        const pagination = document.querySelector("#pagination");

        if (pagination) {
            pagination.innerHTML = "";
        }
        return;
    }

    // Pagination
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;

    const paginatedCourses = courseList.slice(startIndex, endIndex);

    coursesContainer.innerHTML = paginatedCourses.map(course => `
        <article class="card course-card">
            <div class="course-image">
                <button
                    type="button"
                    class="favorite-btn"
                    data-course-id="${course.id}"
                    aria-label="افزودن به علاقه‌مندی‌ها"
                    aria-pressed="false"
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                        />
                    </svg>
                </button>
                <div class="course-labels">
                    ${course.categories.map(category => `
                        <span class="course-label">${category}</span>
                    `).join("")}
                </div>
                <img src="${course.image}" alt="${course.title}">
            </div>

            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>

                <p class="course-description">
                    ${course.description}
                </p>

                <div class="course-footer">
                    <span class="course-level">${course.level}</span>
                    <a href="./course-details.html?id=${course.id}" class="course-link">
                        مشاهده دوره ←
                    </a>
                </div>
            </div>
        </article>
    `).join("");

    // Update Favorite Buttons
    coursesContainer.querySelectorAll(".favorite-btn").forEach(button => {
        const courseId = Number(button.dataset.courseId);
        const isFavorite = favoriteCourses.includes(courseId);

        button.classList.toggle("active", isFavorite);
        button.setAttribute("aria-pressed", String(isFavorite));

        button.setAttribute(
            "aria-label",
            isFavorite
                ? "حذف از علاقه‌مندی‌ها"
                : "افزودن به علاقه‌مندی‌ها"
        );
    });

    renderPagination(courseList);
}

// Favorite Courses
let favoriteCourses = JSON.parse(
    localStorage.getItem("favoriteCourses")
) || [];

// Update Favorite Count
function updateFavoriteCount() {
    const favoriteCount = document.querySelector("#favorite-count");

    if (favoriteCount) {
        favoriteCount.textContent = favoriteCourses.length;
    }
}

document.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest(".favorite-btn");

    if (!favoriteButton) return;

    const courseId = Number(favoriteButton.dataset.courseId);

    if (favoriteCourses.includes(courseId)) {
        favoriteCourses = favoriteCourses.filter(id => id !== courseId);
    } else {
        favoriteCourses.push(courseId);
    }

    localStorage.setItem(
        "favoriteCourses",
        JSON.stringify(favoriteCourses)
    );

    updateFavoriteCount();

    favoriteButton.classList.toggle(
        "active",
        favoriteCourses.includes(courseId)
    );

    const isFavorite = favoriteCourses.includes(courseId);

    favoriteButton.setAttribute("aria-pressed", String(isFavorite));
    favoriteButton.setAttribute(
        "aria-label",
        isFavorite
            ? "حذف از علاقه‌مندی‌ها"
            : "افزودن به علاقه‌مندی‌ها"
    );
});

function renderPagination(courseList) {
    const pagination = document.querySelector("#pagination");

    if (!pagination) return;

    const totalPages = Math.ceil(courseList.length / coursesPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    pagination.innerHTML = Array.from(
        { length: totalPages },
        (_, index) => {
            const page = index + 1;

            return `
                <button
                    class="pagination-btn ${page === currentPage ? "active" : ""}"
                    data-page="${page}"
                >
                    ${page}
                </button>
            `;
        }
    ).join("");

    const paginationButtons = pagination.querySelectorAll(".pagination-btn");

    paginationButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentPage = Number(button.dataset.page);
            filterCourses();

            requestAnimationFrame(() => {
                setTimeout(() => {
                    const coursesSection = document.querySelector("#courses-section");

                    if (!coursesSection) return;

                    const topPosition =
                        coursesSection.getBoundingClientRect().top +
                        window.scrollY - 120;

                    window.scrollTo({
                        top: topPosition,
                        behavior: "smooth"
                    });
                }, 150);
            });
        });
    });
}

const isAllCoursesPage = document.querySelector("#all-courses-page");

updateFavoriteCount();

const isFavoritesPage = window.location.pathname.endsWith("favorites.html");

// Get Course ID from URL
const urlParams = new URLSearchParams(window.location.search);
const courseId = Number(urlParams.get("id"));

// Find Selected Course
const selectedCourse = courses.find(course => course.id === courseId);

// Update Page Title
if (selectedCourse) {
    document.title = `${selectedCourse.title} | CodeStart Academy`;
}

// Get Course Details Container
const courseDetailsContainer = document.querySelector("#course-details");

// Render Course Details
if (selectedCourse && courseDetailsContainer) {
    courseDetailsContainer.innerHTML = `
        <section class="course-details-content">
            <img
                src="${selectedCourse.image}"
                alt="${selectedCourse.title}"
                class="course-details-image"
            >
            <h1>${selectedCourse.title}</h1>

            <div class="course-details-categories">
                ${selectedCourse.categories.map(category => `
                    <span class="course-category">${category}</span>
                `).join("")}
            </div>

            <p>${selectedCourse.description}</p>

            <span class="course-level">
                ${selectedCourse.label}
            </span>

            <a href="./all_courses.html" class="btn course-back-btn">
                بازگشت به همه دوره‌ها
            </a>
        </section>
    `;
}
else if (courseDetailsContainer) {
    courseDetailsContainer.innerHTML = `
        <section class="course-details-content">
            <h2>دوره موردنظر پیدا نشد!</h2>
            <p>لطفاً از صفحه دوره‌ها، یک دوره معتبر انتخاب کن.</p>
            <a href="./all_courses.html" class="btn">
                مشاهده همه دوره‌ها
            </a>
        </section>
    `;
}

if (isFavoritesPage) {
    filterCourses();
} else if (isAllCoursesPage) {
    renderCourses();
} else {
    renderCourses(courses.slice(-3).reverse());
}

