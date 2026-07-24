(function () {
  "use strict";

  var DETACH_THRESHOLD = 0.82;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function enhanceReveal(root) {
    var sticker = root.querySelector(".song-reveal__sticker");
    var content = root.querySelector(".song-reveal__content");
    var status = root.querySelector("[data-song-reveal-status]");
    var state = {
      edge: "left",
      departure: "right",
      directionLocked: false,
      value: 0,
      pointerId: null,
      startX: 0,
      startY: 0,
      frame: null,
      revealed: false,
    };

    root.classList.add("is-enhanced");
    content.setAttribute("inert", "");
    content.setAttribute("aria-hidden", "true");

    function lockGestureDirection(deltaX, deltaY) {
      if (state.directionLocked || Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 5) {
        return;
      }

      if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        state.edge = deltaX >= 0 ? "left" : "right";
        state.departure = deltaX >= 0 ? "right" : "left";
      } else {
        state.edge = deltaY >= 0 ? "top" : "bottom";
        state.departure = deltaY >= 0 ? "bottom" : "top";
      }
      state.directionLocked = true;
    }

    function clipPath(value) {
      var percent = clamp(value, 0, 1) * 100;
      var remaining = 100 - percent;
      if (state.edge === "left") {
        return "polygon(" + percent + "% 0, 100% 0, 100% 100%, " + percent + "% 100%)";
      }
      if (state.edge === "right") {
        return "polygon(0 0, " + remaining + "% 0, " + remaining + "% 100%, 0 100%)";
      }
      if (state.edge === "top") {
        return "polygon(0 " + percent + "%, 100% " + percent + "%, 100% 100%, 0 100%)";
      }
      return "polygon(0 0, 100% 0, 100% " + remaining + "%, 0 " + remaining + "%)";
    }

    function render(value) {
      state.value = clamp(value, 0, 1);
      sticker.style.clipPath = clipPath(state.value);
      sticker.style.setProperty("--song-peel", state.value.toFixed(3));
      sticker.style.setProperty("--song-peel-pct", Math.round(state.value * 100) + "%");
      sticker.dataset.edge = state.edge;
      sticker.dataset.departure = state.departure;
    }

    function stopSpring() {
      if (state.frame !== null) {
        window.cancelAnimationFrame(state.frame);
        state.frame = null;
      }
    }

    function springBack() {
      stopSpring();
      if (reducedMotion.matches) {
        render(0);
        return;
      }

      var velocity = 0;
      function spring() {
        velocity = (velocity - state.value * 0.18) * 0.72;
        render(state.value + velocity);
        if (state.value < 0.002 && Math.abs(velocity) < 0.002) {
          render(0);
          state.frame = null;
          return;
        }
        state.frame = window.requestAnimationFrame(spring);
      }
      state.frame = window.requestAnimationFrame(spring);
    }

    function reveal() {
      if (state.revealed) return;
      state.revealed = true;
      stopSpring();
      sticker.style.clipPath = "";
      sticker.classList.add("is-leaving");
      sticker.setAttribute("aria-expanded", "true");

      function finishReveal() {
        root.classList.add("is-revealed");
        sticker.hidden = true;
        content.removeAttribute("inert");
        content.removeAttribute("aria-hidden");
        status.textContent = sticker.dataset.revealedLabel;
        var firstLink = content.querySelector("a");
        if (firstLink) firstLink.focus({ preventScroll: true });
      }

      if (reducedMotion.matches) {
        finishReveal();
      } else {
        window.setTimeout(finishReveal, 440);
      }
    }

    sticker.addEventListener("pointerdown", function (event) {
      if (state.revealed || (event.button !== undefined && event.button !== 0)) return;
      stopSpring();
      state.directionLocked = false;
      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;
      sticker.focus({ preventScroll: true });
      sticker.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    sticker.addEventListener("pointermove", function (event) {
      if (state.pointerId !== event.pointerId || state.revealed) return;
      var deltaX = event.clientX - state.startX;
      var deltaY = event.clientY - state.startY;
      lockGestureDirection(deltaX, deltaY);
      if (!state.directionLocked) return;
      var rect = sticker.getBoundingClientRect();
      var axis = state.edge === "left" || state.edge === "right" ? rect.width : rect.height;
      var dragDistance = Math.min(190, axis * 0.78);
      render(Math.max(Math.abs(deltaX), Math.abs(deltaY)) / dragDistance);
    });

    function finishPointer() {
      if (state.pointerId === null || state.revealed) return;
      state.pointerId = null;
      if (state.value >= DETACH_THRESHOLD) {
        reveal();
      } else {
        springBack();
      }
    }

    sticker.addEventListener("pointerup", finishPointer);
    sticker.addEventListener("pointercancel", finishPointer);
    window.addEventListener("pointerup", finishPointer);
    window.addEventListener("pointercancel", finishPointer);
    sticker.addEventListener("lostpointercapture", finishPointer);

    sticker.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        reveal();
        event.preventDefault();
      } else if (event.key === "Escape") {
        springBack();
        event.preventDefault();
      }
    });

    render(0);
  }

  document.querySelectorAll("[data-song-reveal]").forEach(enhanceReveal);
})();
