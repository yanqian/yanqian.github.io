(function () {
  function setupToc(toc) {
    var nestedLists = toc.querySelectorAll("li > ul");

    nestedLists.forEach(function (list) {
      var parent = list.parentElement;
      var link = parent ? parent.querySelector(":scope > a") : null;

      if (!link) {
        return;
      }

      parent.classList.add("toc-item-collapsible");
      list.hidden = true;

      var button = document.createElement("button");
      button.className = "toc-toggle";
      button.type = "button";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Toggle subsections");
      button.textContent = "+";

      button.addEventListener("click", function () {
        var expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        button.textContent = expanded ? "+" : "-";
        list.hidden = expanded;
      });

      parent.insertBefore(button, link);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toc").forEach(setupToc);
  });
})();
