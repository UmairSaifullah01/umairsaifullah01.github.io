document.addEventListener("DOMContentLoaded", function () {
  const clientsList = document.querySelector(".clients-list");
  if (!clientsList) return;

  const scrollSpeed = 1;
  const scrollPause = 3000;
  let isPaused = false;
  let isWaiting = false;
  let scrollDirection = 1;
  let animationFrameId;

  function autoScroll() {
    if (!isPaused && !isWaiting) {
      clientsList.scrollLeft += scrollSpeed * scrollDirection;

      const maxScroll = clientsList.scrollWidth - clientsList.clientWidth;

      if (scrollDirection === 1 && clientsList.scrollLeft >= maxScroll - 1) {
        isWaiting = true;
        setTimeout(() => {
          scrollDirection = -1;
          isWaiting = false;
        }, scrollPause);
      } else if (scrollDirection === -1 && clientsList.scrollLeft <= 0) {
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

  clientsList.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  clientsList.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  // Cleanup if needed (though this is a global script)
  // window.addEventListener('unload', () => cancelAnimationFrame(animationFrameId));
});
