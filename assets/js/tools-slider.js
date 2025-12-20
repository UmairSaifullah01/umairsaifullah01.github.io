document.addEventListener("DOMContentLoaded", function () {
  const toolsList = document.querySelector(".tools-list");
  if (!toolsList) return;

  const scrollSpeed = 1;
  const scrollPause = 2000;
  let isPaused = false;
  let isWaiting = false;
  let scrollDirection = 1;
  let animationFrameId;

  function autoScroll() {
    if (!isPaused && !isWaiting) {
      toolsList.scrollLeft += scrollSpeed * scrollDirection;

      const maxScroll = toolsList.scrollWidth - toolsList.clientWidth;

      if (scrollDirection === 1 && toolsList.scrollLeft >= maxScroll - 1) {
        isWaiting = true;
        setTimeout(() => {
          scrollDirection = -1;
          isWaiting = false;
        }, scrollPause);
      } else if (scrollDirection === -1 && toolsList.scrollLeft <= 0) {
        isWaiting = true;
        setTimeout(() => {
          scrollDirection = 1;
          isWaiting = false;
        }, scrollPause);
      }
    }
    animationFrameId = requestAnimationFrame(autoScroll);
  }

  autoScroll();

  toolsList.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  toolsList.addEventListener("mouseleave", () => {
    isPaused = false;
  });
});
