// Audio del motor
const soundBtn = document.getElementById("soundBtn");
if (soundBtn) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const motorAudio = new Audio("audio/ZX10R.mp3");

  soundBtn.addEventListener("click", () => {
    motorAudio.currentTime = 0;
    motorAudio.play();
    soundBtn.style.animation = "pulse 0.5s ease-out";
    setTimeout(() => (soundBtn.style.animation = ""), 500);
  });
}

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const counters = document.querySelectorAll("[data-count]");

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 1400;
      const start = performance.now();

      const updateCounter = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(target * eased);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
      countObserver.unobserve(element);
    });
  },
  {
    threshold: 0.9,
  }
);

counters.forEach((counter) => countObserver.observe(counter));

document.addEventListener("mousemove", (event) => {
  const frame = document.querySelector(".hero-frame");
  if (!frame || window.innerWidth < 981) return;

  const { innerWidth, innerHeight } = window;
  const rotateY = ((event.clientX / innerWidth) - 0.5) * 8;
  const rotateX = (0.5 - event.clientY / innerHeight) * 5;

  frame.style.transform =
    `perspective(1200px) rotateY(${rotateY - 6}deg) rotateX(${rotateX + 2}deg)`;
});
