"use strict";

// Pagination variables
const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let filteredProjects = [];

// Function to load and display portfolio projects
const loadPortfolioProjects = async function () {
  try {
    console.log("Loading portfolio projects...");
    const response = await fetch("./assets/json/portfolio.json");
    console.log("Response:", response);
    const projects = await response.json();
    console.log("Projects:", projects);

    const projectList = document.querySelector(".project-list");
    console.log("Project list element:", projectList);

    if (!projectList) {
      console.error("Project list element not found");
      return;
    }

    // Store all projects
    filteredProjects = projects;

    // Display first page
    displayProjects();

    // Add pagination controls
    addPaginationControls();

    // Initialize filters after loading projects
    initializeFilters(projects);
  } catch (error) {
    console.error("Error loading portfolio projects:", error);
  }
};

// Function to display projects for current page
const displayProjects = function () {
  const projectList = document.querySelector(".project-list");
  projectList.innerHTML = "";

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const projectsToShow = filteredProjects.slice(startIndex, endIndex);

  // Create and append project items
  projectsToShow.forEach((project) => {
    console.log("Creating project:", project);
    const projectItem = document.createElement("li");
    projectItem.className = "project-item active";
    projectItem.setAttribute("data-filter-item", "");
    projectItem.setAttribute("data-category", project.category);

    if (project.type === "video") {
      // Create video project item
      projectItem.innerHTML = `
        <div class="project-content-box">
          <div class="project-img">
            <video
              width="100%"
              height="200"
              controls
              preload="metadata"
              playsinline
              controlsList="nodownload"
            >
              <source src="${project.video}" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="project-title">${project.title}</div>
          <div class="project-category">Game Videos</div>
        </div>
      `;
    } else {
      // Create image project item
      projectItem.innerHTML = `
        <a href="${project.link}" target="_blank">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
            <img
              src="${project.image}"
              alt="${project.alt}"
              loading="lazy"
            />
          </figure>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-category">${project.category
            .split(" ")
            .join(" ")}</p>
        </a>
      `;
    }

    projectList.appendChild(projectItem);
  });
};

// Function to add pagination controls
const addPaginationControls = function () {
  const projectsSection = document.querySelector(".projects");

  // Create pagination container
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";

  // Calculate total pages
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  // Create pagination HTML
  let paginationHTML = `
    <div class="pagination">
      <button class="pagination-btn" data-page="prev" ${
        currentPage === 1 ? "disabled" : ""
      }>
        <ion-icon name="chevron-back-outline"></ion-icon>
      </button>
      <div class="page-numbers">
        ${generatePageNumbers(currentPage, totalPages)}
      </div>
      <button class="pagination-btn" data-page="next" ${
        currentPage === totalPages ? "disabled" : ""
      }>
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </button>
    </div>
  `;

  paginationContainer.innerHTML = paginationHTML;
  projectsSection.appendChild(paginationContainer);

  // Add event listeners to pagination buttons
  const paginationBtns =
    paginationContainer.querySelectorAll(".pagination-btn");
  paginationBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.page === "prev" && currentPage > 1) {
        currentPage--;
      } else if (btn.dataset.page === "next" && currentPage < totalPages) {
        currentPage++;
      }
      displayProjects();
      updatePaginationControls();
    });
  });

  // Add event listeners to page numbers
  const pageNumbers = paginationContainer.querySelectorAll(".page-number");
  pageNumbers.forEach((page) => {
    page.addEventListener("click", () => {
      currentPage = parseInt(page.dataset.page);
      displayProjects();
      updatePaginationControls();
    });
  });
};

// Function to generate page numbers
const generatePageNumbers = function (currentPage, totalPages) {
  let html = "";
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    html += `<button class="page-number" data-page="1">1</button>`;
    if (startPage > 2) {
      html += `<span class="page-dots">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-number ${
      i === currentPage ? "active" : ""
    }" data-page="${i}">${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `<span class="page-dots">...</span>`;
    }
    html += `<button class="page-number" data-page="${totalPages}">${totalPages}</button>`;
  }

  return html;
};

// Function to update pagination controls
const updatePaginationControls = function () {
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginationContainer = document.querySelector(".pagination-container");

  if (paginationContainer) {
    paginationContainer.innerHTML = `
      <div class="pagination">
        <button class="pagination-btn" data-page="prev" ${
          currentPage === 1 ? "disabled" : ""
        }>
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>
        <div class="page-numbers">
          ${generatePageNumbers(currentPage, totalPages)}
        </div>
        <button class="pagination-btn" data-page="next" ${
          currentPage === totalPages ? "disabled" : ""
        }>
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </div>
    `;

    // Reattach event listeners
    const paginationBtns =
      paginationContainer.querySelectorAll(".pagination-btn");
    paginationBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.page === "prev" && currentPage > 1) {
          currentPage--;
        } else if (btn.dataset.page === "next" && currentPage < totalPages) {
          currentPage++;
        }
        displayProjects();
        updatePaginationControls();
      });
    });

    const pageNumbers = paginationContainer.querySelectorAll(".page-number");
    pageNumbers.forEach((page) => {
      page.addEventListener("click", () => {
        currentPage = parseInt(page.dataset.page);
        displayProjects();
        updatePaginationControls();
      });
    });
  }
};

// Function to initialize filter functionality
const initializeFilters = function (projects) {
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const select = document.querySelector("[data-select]");
  const selectValue = document.querySelector("[data-select-value]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  // Filter function
  const filterFunc = function (selectedValue) {
    // Reset to first page when filtering
    currentPage = 1;

    // Filter projects based on selected category
    if (selectedValue === "All") {
      filteredProjects = projects;
    } else {
      filteredProjects = projects.filter((project) =>
        project.category.includes(selectedValue)
      );
    }

    // Update display and pagination
    displayProjects();
    updatePaginationControls();
  };

  // Add event to all select items
  selectItems.forEach((item) => {
    item.addEventListener("click", function () {
      let selectedValue = this.innerText;
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });

  // Add event to all filter button items for large screen
  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      let selectedValue = this.innerText;
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });
};

// Initialize portfolio functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing portfolio...");
  loadPortfolioProjects();
});
