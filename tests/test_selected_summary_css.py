from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "assets/css/custom.css").read_text()
CONFIG = (ROOT / "hugo.toml").read_text()
SUMMARY_JS = (ROOT / "assets/js/selected-summary.js").read_text()


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


class SelectedSummaryCSSTest(unittest.TestCase):
    def test_selected_summary_rule_wins_over_global_page_paragraphs(self):
        page_paragraph_index = CSS.index(".page p,\n.page li")
        selected_summary_index = CSS.index(".home-page .selected-card p")

        self.assertGreater(
            selected_summary_index,
            page_paragraph_index,
            "Selected summaries must be declared after global page paragraphs "
            "so mobile and desktop line-clamp metrics are not overwritten.",
        )

    def test_selected_summary_has_stable_two_line_crop(self):
        declarations = declaration_block(".home-page .selected-card p")

        expected = {
            "--selected-summary-line-height": "1.55",
            "--selected-summary-max-height": "4.2rem",
            "--selected-summary-ellipsis-width": "1.7em",
            "display": "block",
            "overflow": "hidden",
            "text-align": "start",
            "word-break": "normal",
            "overflow-wrap": "break-word",
            "max-width": "100%",
            "max-height": "var(--selected-summary-max-height)",
            "padding-inline-end": "var(--selected-summary-ellipsis-width)",
            "position": "relative",
        }

        for prop, value in expected.items():
            self.assertEqual(
                declarations.get(prop),
                value,
                f"{prop} should remain {value} to keep Selected summaries stable.",
            )

        self.assertEqual(declarations.get("font-size"), "1.35rem")
        self.assertEqual(
            declarations.get("line-height"),
            "var(--selected-summary-line-height)",
        )

    def test_selected_summary_ellipsis_has_leading_space(self):
        declarations = declaration_block(".home-page .selected-card p.is-clamped::after")

        self.assertEqual(declarations.get("content"), '" ..."')
        self.assertEqual(declarations.get("position"), "absolute")
        self.assertEqual(declarations.get("inset-inline-end"), "0")
        self.assertEqual(declarations.get("width"), "var(--selected-summary-ellipsis-width)")
        self.assertEqual(declarations.get("background"), "var(--site-bg)")

    def test_mobile_breakpoint_does_not_override_selected_summary_clamp(self):
        mobile_css = CSS.split("@media (max-width: 768px)", 1)[1]

        self.assertNotIn(
            ".selected-card p",
            mobile_css,
            "Mobile should use the same stable Selected summary clamp as desktop.",
        )

    def test_selected_summary_js_is_loaded_and_detects_overflow(self):
        self.assertIn('customJS = ["js/selected-summary.js"]', CONFIG)
        self.assertIn(".home-page .selected-card p", SUMMARY_JS)
        self.assertIn("scrollHeight > summary.clientHeight + 1", SUMMARY_JS)
        self.assertIn('classList.add("is-clamped")', SUMMARY_JS)
        self.assertIn('classList.remove("is-clamped")', SUMMARY_JS)
        self.assertIn('window.addEventListener("resize"', SUMMARY_JS)


if __name__ == "__main__":
    unittest.main()
