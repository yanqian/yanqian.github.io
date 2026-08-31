(() => {
  const root = document.querySelector("[data-talk-root]");
  if (!root) {
    return;
  }

  const body = document.body;
  const toggle = root.querySelector("[data-talk-toggle]");
  const presentShell = root.querySelector("[data-present-shell]");
  const progress = root.querySelector("[data-talk-progress]");
  const sceneItems = Array.from(root.querySelectorAll(".hj-talk__scene-item"));
  const scenes = Array.from(root.querySelectorAll("[data-scene]"));
  const prevButton = root.querySelector("[data-prev-scene]");
  const nextButton = root.querySelector("[data-next-scene]");
  const exitButton = root.querySelector("[data-exit-present]");
  const masthead = root.querySelector(".hj-talk__masthead");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!toggle || !presentShell || !progress || scenes.length === 0) {
    return;
  }

  let activeIndex = 0;
  let presenting = false;
  let readingScrollY = 0;

  toggle.hidden = false;

  const updateSceneState = () => {
    sceneItems.forEach((item, index) => {
      const active = index === activeIndex;
      item.classList.toggle("is-active", active);
      item.hidden = presenting ? !active : false;
      scenes[index].setAttribute("aria-hidden", presenting && !active ? "true" : "false");
    });

    progress.textContent = `Scene ${activeIndex + 1} of ${scenes.length}`;
    prevButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === scenes.length - 1;

    if (presenting) {
      scenes[activeIndex].focus({ preventScroll: prefersReducedMotion.matches });
    }
  };

  const requestFullscreen = async () => {
    if (typeof root.requestFullscreen !== "function") {
      return;
    }

    try {
      await root.requestFullscreen();
    } catch (_error) {
      // Present mode still works if fullscreen is unavailable or denied.
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement && typeof document.exitFullscreen === "function") {
      try {
        await document.exitFullscreen();
      } catch (_error) {
        // Exit still completes even if fullscreen teardown fails.
      }
    }
  };

  const enterPresent = async () => {
    readingScrollY = window.scrollY;
    presenting = true;
    body.classList.add("hj-talk--presenting");
    masthead?.setAttribute("aria-hidden", "true");
    window.scrollTo(0, 0);
    presentShell.hidden = false;
    toggle.textContent = "Return to Reading mode";
    toggle.setAttribute("aria-pressed", "true");
    updateSceneState();
    await requestFullscreen();
  };

  const exitPresent = async () => {
    presenting = false;
    body.classList.remove("hj-talk--presenting");
    presentShell.hidden = true;
    sceneItems.forEach((item) => {
      item.hidden = false;
      item.classList.remove("is-active");
    });
    scenes.forEach((scene) => {
      scene.setAttribute("aria-hidden", "false");
    });
    toggle.textContent = "Enter Present mode";
    toggle.setAttribute("aria-pressed", "false");
    masthead?.removeAttribute("aria-hidden");
    toggle.focus({ preventScroll: true });
    await exitFullscreen();
    window.scrollTo(0, readingScrollY);
  };

  const moveTo = (index) => {
    const nextIndex = Math.max(0, Math.min(index, scenes.length - 1));
    if (nextIndex === activeIndex && presenting) {
      updateSceneState();
      return;
    }
    activeIndex = nextIndex;
    updateSceneState();
  };

  toggle.addEventListener("click", async () => {
    if (presenting) {
      await exitPresent();
      return;
    }
    await enterPresent();
  });

  prevButton?.addEventListener("click", () => moveTo(activeIndex - 1));
  nextButton?.addEventListener("click", () => moveTo(activeIndex + 1));
  exitButton?.addEventListener("click", () => {
    void exitPresent();
  });

  document.addEventListener("keydown", (event) => {
    if (!presenting) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      void exitPresent();
      return;
    }

    if (event.key === " " && event.shiftKey) {
      event.preventDefault();
      moveTo(activeIndex - 1);
      return;
    }

    const nextKeys = ["ArrowRight", "ArrowDown", "PageDown", " ", "Spacebar"];
    const prevKeys = ["ArrowLeft", "ArrowUp", "PageUp"];

    if (nextKeys.includes(event.key)) {
      event.preventDefault();
      moveTo(activeIndex + 1);
      return;
    }

    if (prevKeys.includes(event.key)) {
      event.preventDefault();
      moveTo(activeIndex - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      moveTo(scenes.length - 1);
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (presenting && !document.fullscreenElement) {
      toggle.textContent = "Return to Reading mode";
    }
  });

  updateSceneState();
})();
