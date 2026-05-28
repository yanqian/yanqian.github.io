from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "assets/css/custom.css").read_text()


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

    def test_selected_summary_has_stable_two_line_clamp(self):
        declarations = declaration_block(".home-page .selected-card p")

        expected = {
            "display": "-webkit-box",
            "-webkit-box-orient": "vertical",
            "-webkit-line-clamp": "2",
            "overflow": "hidden",
            "text-align": "start",
            "word-break": "normal",
            "overflow-wrap": "break-word",
            "max-width": "100%",
        }

        for prop, value in expected.items():
            self.assertEqual(
                declarations.get(prop),
                value,
                f"{prop} should remain {value} to prevent mobile clamp overlap.",
            )

        self.assertEqual(declarations.get("font-size"), "1.35rem")
        self.assertEqual(declarations.get("line-height"), "1.55")

    def test_mobile_breakpoint_does_not_override_selected_summary_clamp(self):
        mobile_css = CSS.split("@media (max-width: 768px)", 1)[1]

        self.assertNotIn(
            ".selected-card p",
            mobile_css,
            "Mobile should use the same stable Selected summary clamp as desktop.",
        )


if __name__ == "__main__":
    unittest.main()
