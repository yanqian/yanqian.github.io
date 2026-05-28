(function () {
  function updateSelectedSummaries() {
    document.querySelectorAll(".home-page .selected-card p").forEach(function (summary) {
      summary.classList.remove("is-clamped");

      if (summary.scrollHeight > summary.clientHeight + 1) {
        summary.classList.add("is-clamped");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateSelectedSummaries);
  } else {
    updateSelectedSummaries();
  }

  window.addEventListener("resize", updateSelectedSummaries);
})();
