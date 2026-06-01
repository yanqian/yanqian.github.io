from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "assets/css/custom.css").read_text()
CONFIG = (ROOT / "hugo.toml").read_text()


def declaration_block(selector):
    pattern = re.compile(rf"{re.escape(selector)}\s*\{{(?P<body>.*?)\n\}}", re.S)
    match = pattern.search(CSS)
    if not match:
        raise AssertionError(f"Missing CSS rule for {selector}")

    declarations = {}
    for raw_line in match.group("body").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("/*") or ":" not in line:
            continue
        prop, value = line.rstrip(";").split(":", 1)
        declarations[prop.strip()] = value.strip()
    return declarations


class ArticleCodeBlocksCSSTest(unittest.TestCase):
    def test_chroma_uses_class_based_highlighting(self):
        self.assertIn("noClasses = false", CONFIG)
        self.assertIn('customCSS = ["css/syntax.css", "css/custom.css"]', CONFIG)

    def test_code_panel_background_uses_inline_code_background(self):
        self.assertIn("--site-code-panel-bg: var(--site-code-bg);", CSS)
        self.assertIn("--site-code-panel-header: var(--site-code-bg);", CSS)

    def test_chroma_background_is_overridden_inside_code_panels(self):
        declarations = declaration_block(
            "body:not(#syntax-boost) .highlight .chroma,\n"
            "body:not(#syntax-boost) .highlight pre.chroma"
        )
        self.assertEqual(declarations.get("background"), "var(--site-code-panel-bg)")
        self.assertEqual(
            declarations.get("background-color"),
            "var(--site-code-panel-bg)",
        )

    def test_text_language_label_stays_hidden(self):
        declarations = declaration_block('.highlight code[data-lang="text"]::before')
        self.assertEqual(declarations.get("content"), "none")
        self.assertEqual(declarations.get("display"), "none")

    def test_language_label_does_not_create_separate_header_bar(self):
        declarations = declaration_block(".highlight code::before")
        self.assertEqual(declarations.get("background"), "transparent")
        self.assertEqual(declarations.get("border-bottom"), "0")
        self.assertEqual(declarations.get("content"), "attr(data-lang)")


if __name__ == "__main__":
    unittest.main()
