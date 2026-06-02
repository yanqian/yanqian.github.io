(function () {
  var MAX_QUOTE_LENGTH = 1200;
  var SOURCE_THRESHOLD = 160;
  var button = null;
  var toast = null;
  var hideTimer = null;
  var lastSelectionText = "";

  function getArticleSelection() {
    var selection = window.getSelection();
    var article = document.querySelector(".post-content");

    if (!selection || selection.rangeCount === 0 || !article) {
      return null;
    }

    var text = selection.toString().replace(/\s+/g, " ").trim();
    if (!text) {
      return null;
    }

    var range = selection.getRangeAt(0);
    var ancestor = range.commonAncestorContainer;
    var element = ancestor.nodeType === Node.ELEMENT_NODE ? ancestor : ancestor.parentElement;

    if (!element || !article.contains(element)) {
      return null;
    }

    return { selection: selection, range: range, text: text };
  }

  function formatQuote(text) {
    var normalized = text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (normalized.length > MAX_QUOTE_LENGTH) {
      normalized = normalized.slice(0, MAX_QUOTE_LENGTH).replace(/\s+\S*$/, "") + "...";
    }

    var quote = normalized
      .split(/\n+/)
      .map(function (line) {
        return "> " + line.trim();
      })
      .join("\n");

    if (normalized.length < SOURCE_THRESHOLD) {
      return quote;
    }

    return quote + "\n\n" + "Source: " + document.title.replace(/\s+\u00b7\s+.*$/, "") + " - " + window.location.href.split("#")[0];
  }

  function ensureButton() {
    if (button) {
      return button;
    }

    button = document.createElement("button");
    button.className = "selection-comment-button";
    button.type = "button";
    button.hidden = true;
    button.setAttribute("aria-label", "Comment on selected text");
    button.textContent = "Comment";
    button.addEventListener("click", handleCommentClick);
    document.body.appendChild(button);
    return button;
  }

  function ensureToast() {
    if (toast) {
      return toast;
    }

    toast = document.createElement("div");
    toast.className = "selection-comment-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.hidden = true;
    document.body.appendChild(toast);
    return toast;
  }

  function showToast(message) {
    var node = ensureToast();
    node.textContent = message;
    node.hidden = false;

    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(function () {
      node.hidden = true;
    }, 3200);
  }

  function hideButton() {
    if (button) {
      button.hidden = true;
    }
  }

  function positionButton(range) {
    var node = ensureButton();
    var rect = range.getBoundingClientRect();

    if (!rect || rect.width === 0 || rect.height === 0) {
      hideButton();
      return;
    }

    node.hidden = false;

    var top = window.scrollY + rect.top - node.offsetHeight - 10;
    var left = window.scrollX + rect.right - node.offsetWidth;
    var maxLeft = window.scrollX + document.documentElement.clientWidth - node.offsetWidth - 12;

    node.style.top = Math.max(window.scrollY + 12, top) + "px";
    node.style.left = Math.max(window.scrollX + 12, Math.min(left, maxLeft)) + "px";
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.className = "selection-comment-copy-buffer";
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  function scrollToComments() {
    var comments = document.querySelector(".post-comments");

    if (comments) {
      comments.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function handleCommentClick() {
    var selected = getArticleSelection();
    if (!selected && !lastSelectionText) {
      hideButton();
      return;
    }

    var quote = formatQuote(selected ? selected.text : lastSelectionText);

    try {
      var copied = await copyText(quote);
      if (!copied) {
        throw new Error("Copy command failed");
      }

      scrollToComments();
      window.setTimeout(function () {
        showToast("Quote copied. Paste it into the comment box.");
      }, 450);
    } catch (error) {
      showToast("Copy failed. Select the quote again and copy manually.");
    }

    hideButton();
  }

  function updateFromSelection() {
    var selected = getArticleSelection();

    if (!selected) {
      hideButton();
      return;
    }

    lastSelectionText = selected.text;
    positionButton(selected.range);
  }

  document.addEventListener("selectionchange", function () {
    window.setTimeout(updateFromSelection, 0);
  });

  document.addEventListener("scroll", hideButton, { passive: true });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      hideButton();
    }
  });
})();
