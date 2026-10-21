const menuButton = document.querySelector("#mb");
const mobileMenu = document.querySelector("#menu");

if (menuButton && mobileMenu) {
  const closeMenu = () => {
    mobileMenu.classList.remove("on");
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("on");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });

  mobileMenu.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
}

const revealItems = document.querySelectorAll(
  ".experience-page .reveal, #courses .section-intro, #courses .course-card, #join .join-copy, #join .join-form, #recent-videos .section-intro"
);

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealItems.forEach(item => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach(item => {
    item.classList.add("reveal");
    revealObserver.observe(item);
  });
}

const tiltItems = document.querySelectorAll("[data-tilt], [data-depth]");
const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canTilt) {
  tiltItems.forEach(item => {
    item.addEventListener("pointermove", event => {
      const bounds = item.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      item.style.setProperty("--tilt-x", `${-y * 5}deg`);
      item.style.setProperty("--tilt-y", `${x * 7}deg`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
    });
  });
}
