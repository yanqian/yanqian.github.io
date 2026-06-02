from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
HEAD_EXTENSIONS = (ROOT / "layouts/_partials/head/extensions.html").read_text()
SCRIPT = (ROOT / "assets/js/selection-comment.js").read_text()
CSS = (ROOT / "assets/css/custom.css").read_text()


class SelectionCommentTest(unittest.TestCase):
    def test_post_pages_load_selection_comment_script(self):
        self.assertIn('resources.Get "js/selection-comment.js"', HEAD_EXTENSIONS)
        self.assertIn('{{ if eq .Section "posts" }}', HEAD_EXTENSIONS)
        self.assertIn('integrity="{{ $selectionCommentScript.Data.Integrity }}"', HEAD_EXTENSIONS)

    def test_selection_is_scoped_to_article_content(self):
        self.assertIn('document.querySelector(".post-content")', SCRIPT)
        self.assertIn("article.contains(element)", SCRIPT)
        self.assertIn('document.querySelector(".post-comments")', SCRIPT)

    def test_selected_text_becomes_markdown_quote(self):
        self.assertIn("MAX_QUOTE_LENGTH = 1200", SCRIPT)
        self.assertIn("SOURCE_THRESHOLD = 160", SCRIPT)
        self.assertIn('return "> " + line.trim();', SCRIPT)
        self.assertIn("normalized.length < SOURCE_THRESHOLD", SCRIPT)
        self.assertIn('"Source: " + document.title', SCRIPT)
        self.assertIn(r"\u00b7", SCRIPT)
        self.assertIn('window.location.href.split("#")[0]', SCRIPT)

    def test_clipboard_has_secure_and_fallback_paths(self):
        self.assertIn("navigator.clipboard", SCRIPT)
        self.assertIn("window.isSecureContext", SCRIPT)
        self.assertIn("navigator.clipboard.writeText(text)", SCRIPT)
        self.assertIn('document.execCommand("copy")', SCRIPT)
        self.assertIn("selection-comment-copy-buffer", SCRIPT)
        self.assertIn('throw new Error("Copy command failed")', SCRIPT)

    def test_click_scrolls_to_comments_and_shows_feedback(self):
        self.assertIn('button.textContent = "Comment"', SCRIPT)
        self.assertIn("handleCommentClick", SCRIPT)
        self.assertIn('showToast("Quote copied. Paste it into the comment box.")', SCRIPT)
        self.assertIn("window.setTimeout(function ()", SCRIPT)
        self.assertIn('comments.scrollIntoView({ behavior: "smooth", block: "start" })', SCRIPT)

    def test_button_positions_on_selection_top_right(self):
        self.assertIn("rect.right - node.offsetWidth", SCRIPT)
        self.assertNotIn("rect.width / 2 - node.offsetWidth / 2", SCRIPT)

    def test_selection_comment_controls_are_styled(self):
        self.assertIn(".selection-comment-button {", CSS)
        self.assertIn("position: absolute;", CSS)
        self.assertIn("z-index: 120;", CSS)
        self.assertIn(".selection-comment-toast {", CSS)
        self.assertIn("position: fixed;", CSS)
        self.assertIn(".selection-comment-copy-buffer {", CSS)


if __name__ == "__main__":
    unittest.main()
