document.addEventListener("DOMContentLoaded", function () {
  const toolsList = document.querySelector(".tools-list");
  if (!toolsList) return;

  let scrollPosition = 0;
  const scrollAmount = 1;
  let isScrollingRight = true;
  let scrollInterval;

  function startAutoScroll() {
    scrollInterval = setInterval(() => {
      const maxScroll = toolsList.scrollWidth - toolsList.clientWidth;

      if (isScrollingRight) {
        scrollPosition += scrollAmount;
        if (scrollPosition >= maxScroll) {
          isScrollingRight = false;
          setTimeout(() => {
            scrollPosition = maxScroll;
          }, 1000);
        }
      } else {
        scrollPosition -= scrollAmount;
        if (scrollPosition <= 0) {
          isScrollingRight = true;
          setTimeout(() => {
            scrollPosition = 0;
          }, 1000);
        }
      }

      toolsList.scrollLeft = scrollPosition;
    }, 20);
  }

  function stopAutoScroll() {
    clearInterval(scrollInterval);
  }

  // Start auto-scrolling
  startAutoScroll();

  // Pause on hover
  toolsList.addEventListener("mouseenter", stopAutoScroll);
  toolsList.addEventListener("mouseleave", startAutoScroll);

  // Stop scrolling when the page is not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  });

  // Cleanup
  window.addEventListener("beforeunload", stopAutoScroll);
});
