// Audio del motor
const soundBtn = document.getElementById("soundBtn");
const heroFrame = document.querySelector(".hero-frame");
const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (soundBtn) {
  const motorAudio = new Audio("audio/ZX10R.mp3");
  motorAudio.preload = "auto";

  const updateSoundButtonState = (isPlaying) => {
    soundBtn.setAttribute("aria-pressed", String(isPlaying));
    soundBtn.setAttribute(
      "aria-label",
      isPlaying ? "Pausar sonido del motor" : "Reproducir sonido del motor"
    );
  };

  updateSoundButtonState(false);

  soundBtn.addEventListener("click", async () => {
    if (motorAudio.paused) {
      try {
        await motorAudio.play();
        updateSoundButtonState(true);
        soundBtn.style.animation = "pulse 0.5s ease-out";
        setTimeout(() => (soundBtn.style.animation = ""), 500);
      } catch (error) {
        updateSoundButtonState(false);
      }

      return;
    }

    motorAudio.pause();
    updateSoundButtonState(false);
  });

  motorAudio.addEventListener("ended", () => {
    updateSoundButtonState(false);
  });
}

if ("IntersectionObserver" in window && !prefersReducedMotion) {
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

  counters.forEach((counter) => {
    counter.textContent = "0";
    countObserver.observe(counter);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (heroFrame && !prefersReducedMotion && window.innerWidth >= 981) {
  let animationFrameId = null;

  document.addEventListener("mousemove", (event) => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    animationFrameId = requestAnimationFrame(() => {
      const { innerWidth, innerHeight } = window;
      const rotateY = ((event.clientX / innerWidth) - 0.5) * 8;
      const rotateX = (0.5 - event.clientY / innerHeight) * 5;

      heroFrame.style.animation = "none";
      heroFrame.style.transform =
        `perspective(1200px) rotateY(${rotateY - 6}deg) rotateX(${rotateX + 2}deg)`;
    });
  });
}
