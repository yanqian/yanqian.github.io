from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
EN_NOW = (ROOT / "content/now.md").read_text()
ZH_NOW = (ROOT / "content/now.zh.md").read_text()
SHORTCODE = (ROOT / "layouts/shortcodes/song-reveal.html").read_text()
HEAD_EXTENSIONS = (ROOT / "layouts/_partials/head/extensions.html").read_text()
SCRIPT = (ROOT / "assets/js/song-reveal.js").read_text()
CSS = (ROOT / "assets/css/custom.css").read_text()
FEATURE_LIST = (ROOT / "feature_list.json").read_text()


class NowSongRevealTest(unittest.TestCase):
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

    def test_bilingual_now_pages_preserve_both_songs_in_reveal(self):
        for source in (EN_NOW, ZH_NOW):
            self.assertIn("song_reveal = true", source)
            self.assertIn("{{< song-reveal", source)
            self.assertIn("浜崎あゆみ - MY ALL", source)
            self.assertIn("中島美嘉 - 僕が死のうと思ったのは", source)
            self.assertIn("ntpxLWnf7h4", source)
            self.assertIn("lnLDHIDOT00", source)

        english = self.read_output("now/index.html")
        chinese = self.read_output("zh/now/index.html")
        for rendered in (english, chinese):
            self.assertIn('data-song-reveal', rendered)
            self.assertIn("浜崎あゆみ - MY ALL", rendered)
            self.assertIn("中島美嘉 - 僕が死のうと思ったのは", rendered)
            self.assertIn("song-reveal", rendered)

    def test_shortcode_is_progressively_enhanced_and_accessible(self):
        for marker in (
            'class="song-reveal__content"',
            'class="song-reveal__sticker"',
            'aria-controls="{{ $id }}"',
            'aria-expanded="false"',
            'aria-live="polite"',
        ):
            self.assertIn(marker, SHORTCODE)
        self.assertNotIn("inert", SHORTCODE)
        self.assertIn('root.classList.add("is-enhanced")', SCRIPT)
        self.assertIn('content.setAttribute("inert", "")', SCRIPT)
        self.assertIn('content.removeAttribute("inert")', SCRIPT)

    def test_script_is_scoped_to_flagged_now_pages(self):
        self.assertIn("{{ if .Params.song_reveal }}", HEAD_EXTENSIONS)
        self.assertIn('resources.Get "js/song-reveal.js"', HEAD_EXTENSIONS)
        self.assertIn('integrity="{{ $songRevealScript.Data.Integrity }}"', HEAD_EXTENSIONS)
        self.assertIn("song-reveal", self.read_output("now/index.html"))
        self.assertIn("song-reveal", self.read_output("zh/now/index.html"))
        self.assertNotIn("song-reveal", self.read_output("index.html"))
        self.assertNotIn(
            "song-reveal",
            self.read_output("posts/publish/remote-mac-terminal-for-codex/index.html"),
        )

    def test_pointer_peel_and_partial_return_are_supported(self):
        for marker in (
            'sticker.addEventListener("pointerdown"',
            'sticker.addEventListener("pointermove"',
            'sticker.addEventListener("pointerup"',
            'window.addEventListener("pointerup"',
            "lockGestureDirection(deltaX, deltaY)",
            "springBack()",
            "DETACH_THRESHOLD = 0.82",
        ):
            self.assertIn(marker, SCRIPT)
        self.assertIn("clipPath(state.value)", SCRIPT)
        self.assertIn('state.departure = deltaX >= 0 ? "right" : "left"', SCRIPT)
        self.assertIn('state.departure = deltaY >= 0 ? "bottom" : "top"', SCRIPT)
        self.assertIn('sticker.dataset.departure = state.departure', SCRIPT)
        self.assertIn('[data-departure="right"].is-leaving', CSS)
        self.assertIn('[data-departure="left"].is-leaving', CSS)
        self.assertIn('[data-departure="top"].is-leaving', CSS)
        self.assertIn('[data-departure="bottom"].is-leaving', CSS)
        self.assertIn("touch-action: none;", CSS)

    def test_full_reveal_stays_open_until_refresh(self):
        self.assertIn('sticker.classList.add("is-leaving")', SCRIPT)
        self.assertIn('root.classList.add("is-revealed")', SCRIPT)
        self.assertIn("sticker.hidden = true", SCRIPT)
        self.assertIn("firstLink.focus", SCRIPT)
        self.assertNotIn("localStorage", SCRIPT)
        self.assertNotIn("sessionStorage", SCRIPT)
        self.assertNotIn("document.cookie", SCRIPT)
        self.assertNotIn("is-returning", SCRIPT)
        self.assertIn("never persisted or automatically reset", FEATURE_LIST)

    def test_keyboard_reduced_motion_and_theme_tokens(self):
        self.assertIn('event.key === "Enter"', SCRIPT)
        self.assertIn('event.key === " "', SCRIPT)
        self.assertIn('event.key === "Escape"', SCRIPT)
        self.assertIn('window.matchMedia("(prefers-reduced-motion: reduce)")', SCRIPT)
        self.assertIn("@media (prefers-reduced-motion: reduce)", CSS)
        self.assertIn("--song-sticker-bg: #dfece8", CSS)
        self.assertIn("--song-sticker-bg: #29413d", CSS)
        self.assertIn("var(--song-sticker-sheen)", CSS)
        self.assertIn("var(--song-sticker-peel-light)", CSS)
        self.assertIn("color: var(--song-sticker-muted)", CSS)
        self.assertIn(".song-reveal__sticker.is-leaving", CSS)


if __name__ == "__main__":
    unittest.main()
