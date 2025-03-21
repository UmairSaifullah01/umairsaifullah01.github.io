"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]"
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]"
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// blog modal variables
const blogItems = document.querySelectorAll(".blog-post-item");
const blogModalContainer = document.querySelector(
  "[data-blog-modal-container]"
);
const blogModalCloseBtn = document.querySelector("[data-blog-modal-close-btn]");
const blogOverlay = document.querySelector("[data-blog-overlay]");
const blogModalImg = document.querySelector("[data-blog-modal-img]");
const blogModalTitle = document.querySelector("[data-blog-modal-title]");
const blogModalMeta = document.querySelector("[data-blog-modal-meta]");
const blogModalText = document.querySelector("[data-blog-modal-text]");
const blogModalFullText = document.querySelector("[data-blog-modal-full-text]");
const blogReadMoreBtn = document.querySelector("[data-blog-read-more]");

// blog modal toggle function
const blogModalFunc = function () {
  blogModalContainer.classList.toggle("active");
  blogOverlay.classList.toggle("active");

  // Reset content state when closing
  if (!blogModalContainer.classList.contains("active")) {
    blogModalText.style.display = "block";
    blogModalFullText.style.display = "none";
    blogReadMoreBtn.querySelector("span").textContent =
      "Click to read full story";
    blogReadMoreBtn
      .querySelector("ion-icon")
      .setAttribute("name", "chevron-down-outline");
  }
};

// add click event to blog item
blogItems[0].addEventListener("click", function (e) {
  e.preventDefault();

  // Set modal content
  blogModalImg.src = this.querySelector(".blog-banner-box img").src;
  blogModalImg.alt = this.querySelector(".blog-banner-box img").alt;
  blogModalTitle.innerHTML = this.querySelector(".blog-item-title").innerHTML;
  blogModalMeta.innerHTML = this.querySelector(".blog-meta").innerHTML;

  const fullText = this.querySelector(".blog-text").innerHTML;
  // Get first sentence for preview (split by period and take first one)
  const firstSentence = fullText.split(".")[0] + ".";

  blogModalText.innerHTML = firstSentence;
  blogModalFullText.innerHTML = fullText;

  // Always show read more button since we're only showing one sentence
  blogReadMoreBtn.style.display = "flex";

  blogModalFunc();
});

// Toggle between preview and full text
blogReadMoreBtn.addEventListener("click", function () {
  const isShowingPreview = blogModalText.style.display !== "none";

  if (isShowingPreview) {
    blogModalText.style.display = "none";
    blogModalFullText.style.display = "block";
    this.querySelector("span").textContent = "Show less";
    this.querySelector("ion-icon").setAttribute("name", "chevron-up-outline");
  } else {
    blogModalText.style.display = "block";
    blogModalFullText.style.display = "none";
    this.querySelector("span").textContent = "Click to read full story";
    this.querySelector("ion-icon").setAttribute("name", "chevron-down-outline");
  }
});

// add click event to blog modal close button
blogModalCloseBtn.addEventListener("click", blogModalFunc);
blogOverlay.addEventListener("click", blogModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText;
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "All") {
      filterItems[i].classList.add("active");
    } else if (filterItems[i].dataset.category.includes(selectedValue)) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText;
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}
