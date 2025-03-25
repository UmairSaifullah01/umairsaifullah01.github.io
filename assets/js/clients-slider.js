document.addEventListener("DOMContentLoaded", function () {
  const clientsList = document.querySelector(".clients-list");
  if (!clientsList) return;

  let scrollAmount = 0;
  const scrollSpeed = 0.5; // Reduced speed for smoother movement
  const scrollPause = 3000; // 3 seconds pause at each end
  let isPaused = false;
  let scrollDirection = 1;
  let pauseTimeout;
  let animationFrameId;

  function smoothScroll(targetScroll) {
    const currentScroll = clientsList.scrollLeft;
    const difference = targetScroll - currentScroll;
    const step = difference * 0.05; // Smooth interpolation factor

    if (Math.abs(difference) > 1) {
      clientsList.scrollLeft = currentScroll + step;
      requestAnimationFrame(() => smoothScroll(targetScroll));
    } else {
      clientsList.scrollLeft = targetScroll;
    }
  }

  function autoScroll() {
    if (isPaused) {
      animationFrameId = requestAnimationFrame(autoScroll);
      return;
    }

    scrollAmount += scrollSpeed * scrollDirection;

    // Calculate the maximum scroll position
    const maxScroll = clientsList.scrollWidth - clientsList.clientWidth;

    // Check if we've reached the end
    if (scrollAmount >= maxScroll) {
      isPaused = true;
      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        scrollDirection = -1;
        isPaused = false;
      }, scrollPause);
    }
    // Check if we've reached the start
    else if (scrollAmount <= 0) {
      isPaused = true;
      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        scrollDirection = 1;
        isPaused = false;
      }, scrollPause);
    }

    smoothScroll(scrollAmount);
    animationFrameId = requestAnimationFrame(autoScroll);
  }

  // Start auto-scrolling
  autoScroll();

  // Pause on hover
  clientsList.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  clientsList.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  // Cleanup on page change/unmount
  return () => {
    cancelAnimationFrame(animationFrameId);
    clearTimeout(pauseTimeout);
  };
});
