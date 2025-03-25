"use strict";

// blog modal variables
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

// Function to set up blog item click events
const setupBlogItems = function () {
  const blogItems = document.querySelectorAll(".blog-post-item");

  blogItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Set modal content
      blogModalImg.src = this.querySelector(".blog-banner-box img").src;
      blogModalImg.alt = this.querySelector(".blog-banner-box img").alt;
      blogModalTitle.innerHTML =
        this.querySelector(".blog-item-title").innerHTML;
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
  });
};

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

// Function to load and display blog posts
const loadBlogPosts = async function () {
  try {
    console.log("Loading blog posts...");
    const response = await fetch("./assets/json/blogs.json");
    console.log("Response:", response);
    const blogPosts = await response.json();
    console.log("Blog posts:", blogPosts);

    const blogList = document.querySelector(".blog-list");
    console.log("Blog list element:", blogList);

    if (!blogList) {
      console.error("Blog list element not found");
      return;
    }

    // Clear existing blog posts
    blogList.innerHTML = "";

    // Create and append blog post items
    blogPosts.forEach((post) => {
      console.log("Creating blog post:", post);
      const blogItem = document.createElement("li");
      blogItem.className = "blog-post-item";
      blogItem.innerHTML = `
        <a href="#">
          <figure class="blog-banner-box">
            <img
              src="${post.image}"
              alt="${post.alt}"
              loading="lazy"
            />
          </figure>

          <div class="blog-content">
            <div class="blog-meta">
              <p class="blog-category">${post.category}</p>
              <span class="dot"></span>
              <time datetime="${post.date}">${new Date(
        post.date
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}</time>
            </div>

            <h3 class="h3 blog-item-title">
              ${post.title}
            </h3>

            <p class="blog-text">
              ${post.description}
            </p>
          </div>
        </a>
      `;
      blogList.appendChild(blogItem);
    });

    // Set up click events for the new blog items
    setupBlogItems();
  } catch (error) {
    console.error("Error loading blog posts:", error);
  }
};

// Initialize blog functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing blog...");
  loadBlogPosts();
});
