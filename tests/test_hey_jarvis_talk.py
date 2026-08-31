from html.parser import HTMLParser
from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
TALK_DIR = ROOT / "static/talks/hey-jarvis"
HTML = (TALK_DIR / "index.html").read_text()
CSS = (TALK_DIR / "talk.css").read_text()
JS = (TALK_DIR / "talk.js").read_text()
HTML_COMPACT = " ".join(HTML.split())


class TalkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sections = []
        self.links = []
        self.buttons = []
        self.images = []
        self.script_srcs = []
        self.link_hrefs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "section" and "data-scene" in attrs:
            self.sections.append(attrs)
        if tag == "a" and "href" in attrs:
            self.links.append(attrs["href"])
        if tag == "button":
            self.buttons.append(attrs)
        if tag == "img":
            self.images.append(attrs)
        if tag == "script" and "src" in attrs:
            self.script_srcs.append(attrs["src"])
        if tag == "link" and attrs.get("rel") == "stylesheet" and "href" in attrs:
            self.link_hrefs.append(attrs["href"])


PARSER = TalkParser()
PARSER.feed(HTML)


class HeyJarvisTalkSourceTest(unittest.TestCase):
    def test_static_bundle_exists(self):
        self.assertTrue((TALK_DIR / "index.html").is_file())
        self.assertTrue((TALK_DIR / "talk.css").is_file())
        self.assertTrue((TALK_DIR / "talk.js").is_file())
        self.assertTrue((TALK_DIR / "assets/hey-jarvis-app-ui.png").is_file())

    def test_html_uses_semantic_standalone_structure(self):
        self.assertIn("<!DOCTYPE html>", HTML)
        self.assertIn('<html lang="en" class="hj-talk-page">', HTML)
        self.assertIn('<main id="talk-content" class="hj-talk__content">', HTML)
        self.assertEqual(len(PARSER.sections), 6)
        self.assertEqual(HTML.count('class="hj-talk__scene-index"'), 6)
        self.assertIn('aria-label="Presentation controls"', HTML)
        self.assertIn("Skip to talk", HTML)

    def test_scene_content_and_public_links_match_the_brief(self):
        required_lines = [
            "A voice demo became useful only after it failed in the real world",
            "One wake becomes a complete conversation.",
            "The architecture is really a microphone handoff.",
            "The bugs were not edge cases. They defined the product.",
            '"I\'m here" could arrive before Jarvis was ready.',
            "Acknowledgement playback and Realtime initialization can race",
            '"I\'m here" is emitted only after a two-condition readiness barrier',
            "verifiable system promise instead of hopeful polish",
            "AI accelerated the loop; evidence decided whether a change survived.",
            "Do not scale the demo. First make failure observable.",
            "https://github.com/yanqian/hey-jarvis",
            "https://www.youtube.com/watch?v=Cpv3dhFmS3M",
            "https://github.com/yanqian/hey-jarvis/releases/tag/v0.1.0-internal",
            "/posts/publish/building-hey-jarvis/",
            "/posts/publish/building-hey-jarvis-voice-interaction/",
            "/posts/publish/building-hey-jarvis-mac-product/",
            "/posts/publish/building-hey-jarvis-future/",
            "unsigned and not notarized",
            "Apple Silicon Macs on macOS 14 or later",
            "your own OpenAI API key",
        ]
        for line in required_lines:
            self.assertIn(line, HTML_COMPACT)

    def test_assets_and_dependencies_are_scoped_and_local(self):
        self.assertEqual(PARSER.link_hrefs, ["./talk.css"])
        self.assertEqual(PARSER.script_srcs, ["./talk.js"])
        self.assertEqual(len(PARSER.images), 1)
        self.assertEqual(
            PARSER.images[0]["src"], "./assets/hey-jarvis-app-ui.png"
        )
        self.assertEqual(
            PARSER.images[0]["alt"],
            "Hey Jarvis app welcome screen showing the Ready state, voice-assistant headline, and Enable voice assistant button",
        )
        self.assertNotIn("hey-jarvis-header-background.png", HTML)
        self.assertNotIn("cdn", HTML.lower())
        self.assertNotIn("unpkg", HTML.lower())
        self.assertNotIn("react", HTML.lower())
        self.assertNotIn("vue", HTML.lower())
        self.assertNotIn("svelte", HTML.lower())

    def test_palette_and_typography_match_site_tokens(self):
        for token in (
            "--hj-bg: #f5f7f6;",
            "--hj-surface: #eef3f1;",
            "--hj-ink: #252b29;",
            "--hj-muted: #697371;",
            "--hj-accent: #0f766e;",
            "--hj-accent-ink: #fff;",
            "--hj-border: #dce3e0;",
            "--hj-bg: #202827;",
            "--hj-ink: #e8eeee;",
            "--hj-muted: #9fb0ad;",
            "--hj-accent-ink: #202827;",
            "--hj-border: #34413f;",
            "font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;",
        ):
            self.assertIn(token, CSS)

        self.assertIn("background: var(--hj-bg);", CSS)
        self.assertIn("color: var(--hj-accent-ink);", CSS)
        self.assertNotIn("radial-gradient(circle at top", CSS)
        self.assertIn(".hj-talk__hero img {", CSS)
        self.assertIn("height: auto;", CSS)

    def test_present_mode_controls_and_keyboard_contracts_exist(self):
        button_attrs = "\n".join(str(button) for button in PARSER.buttons)
        for token in (
            "data-talk-toggle",
            "data-prev-scene",
            "data-next-scene",
            "data-exit-present",
        ):
            self.assertIn(token, button_attrs)

        self.assertIn("requestFullscreen", JS)
        self.assertIn("exitFullscreen", JS)
        for key_name in (
            "ArrowRight",
            "ArrowLeft",
            "ArrowDown",
            "ArrowUp",
            "PageDown",
            "PageUp",
            "Home",
            "End",
            "Escape",
            "Spacebar",
        ):
            self.assertIn(key_name, JS)
        self.assertIn("prefers-reduced-motion", JS)
        self.assertIn("window.scrollTo(0, 0)", JS)
        self.assertIn("window.scrollTo(0, readingScrollY)", JS)

    def test_no_persistence_or_framework_apis_are_used(self):
        forbidden = [
            "localStorage",
            "sessionStorage",
            "indexedDB",
            "cookie",
            "import ",
            "from \"react\"",
            "from 'react'",
        ]
        for token in forbidden:
            self.assertNotIn(token, JS)
            self.assertNotIn(token, HTML)

    def test_mobile_and_accessibility_styles_are_present(self):
        for token in (
            "@media (max-width: 640px)",
            "@media (prefers-reduced-motion: reduce)",
            ".hj-talk__skip-link",
            ".hj-talk__present-toggle",
            "min-width: 320px",
            "overflow: hidden",
            "height: 100vh",
            "min-height: 0",
            "grid-template-rows: minmax(0, 1fr) auto;",
            ".hj-talk--presenting .hj-talk__masthead",
            ".hj-talk--presenting .hj-talk__content {",
            ".hj-talk--presenting .hj-talk__scene-list {",
            ".hj-talk--presenting .hj-talk__scene-item {",
            ".hj-talk--presenting .hj-talk__scene {",
            ".hj-talk--presenting .hj-talk__scene-shell",
            "max-height: 100%",
            ".hj-talk--presenting .hj-talk__present-actions {",
            "grid-template-columns: repeat(3, minmax(0, 1fr));",
            ".hj-talk--presenting .hj-talk__present-actions button {",
            "width: auto",
            ".hj-talk--presenting .hj-talk__present-shell {",
            "background: var(--hj-surface-dark);",
            "color: var(--hj-present-ink);",
            ".hj-talk--presenting .hj-talk__progress {",
            ".hj-talk--presenting .hj-talk__present-help {",
            ".hj-talk--presenting .hj-talk__present-actions button:last-child {",
            "border-color: var(--hj-present-border);",
        ):
            self.assertIn(token, CSS)


class HeyJarvisTalkBuildTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.TemporaryDirectory()
        cls.public_dir = Path(cls.temp_dir.name)
        result = subprocess.run(
            [
                "hugo",
                "--destination",
                str(cls.public_dir),
                "--baseURL",
                "https://yanqian.github.io/",
            ],
            cwd=ROOT,
            text=True,
            capture_output=True,
        )
        if result.returncode != 0:
            raise AssertionError(result.stdout + result.stderr)

    @classmethod
    def tearDownClass(cls):
        cls.temp_dir.cleanup()

    def read_output(self, relative_path):
        return (self.public_dir / relative_path).read_text()

    def test_build_copies_standalone_talk_route_and_assets(self):
        talk_html = self.read_output("talks/hey-jarvis/index.html")
        talk_css = self.read_output("talks/hey-jarvis/talk.css")
        talk_js = self.read_output("talks/hey-jarvis/talk.js")

        self.assertIn('Beyond "It Works": How Hey Jarvis Became a Real Workflow', talk_html)
        self.assertIn("./talk.css", talk_html)
        self.assertIn("./talk.js", talk_html)
        self.assertIn(".hj-talk__scene-shell", talk_css)
        self.assertIn("requestFullscreen", talk_js)
        self.assertTrue(
            (self.public_dir / "talks/hey-jarvis/assets/hey-jarvis-app-ui.png").is_file()
        )


if __name__ == "__main__":
    unittest.main()
