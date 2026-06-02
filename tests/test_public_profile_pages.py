from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]


def body_text(path):
    text = path.read_text()
    if text.startswith("+++\n"):
        return text.split("\n+++\n", 1)[1]
    return text


ABOUT = body_text(ROOT / "content/about.md")
RESUME = body_text(ROOT / "content/resume.md")
PAGE_PARTIAL = (ROOT / "layouts/_partials/page.html").read_text()
CSS = (ROOT / "assets/css/custom.css").read_text()


PUBLIC_PAGES = {
    "about": ABOUT,
    "resume": RESUME,
}


class PublicProfilePagesTest(unittest.TestCase):
    def test_about_copy_matches_public_profile(self):
        self.assertIn("I am Armstrong Yan", ABOUT)
        self.assertIn("backend and platform engineer based in Singapore", ABOUT)
        self.assertIn("event-driven systems", ABOUT)
        self.assertIn("AI-assisted software engineering", ABOUT)
        self.assertIn("personal knowledge systems", ABOUT)

    def test_resume_copy_uses_public_experience_themes(self):
        self.assertIn("10+ years of experience", RESUME)
        self.assertIn("Production reliability and troubleshooting", RESUME)
        self.assertIn("Event-driven systems", RESUME)
        self.assertIn("GCP and AWS", RESUME)
        self.assertIn("idempotency", RESUME)
        self.assertIn("armstrong.yan.sg@gmail.com", RESUME)
        self.assertIn("https://www.linkedin.com/in/armstrong-yan-b29465196/", RESUME)

    def test_about_has_public_professional_contact(self):
        self.assertIn("armstrong.yan.sg@gmail.com", ABOUT)

    def test_terminal_identity_and_focus_are_updated(self):
        self.assertIn("Armstrong Yan", PAGE_PARTIAL)
        self.assertIn("Kernel: Backend / Platform Engineer", PAGE_PARTIAL)
        self.assertIn(
            "Focus: Reliable systems, platform engineering, AI-assisted workflows, knowledge systems",
            PAGE_PARTIAL,
        )
        self.assertNotIn("OS: Human", PAGE_PARTIAL)

    def test_terminal_background_matches_code_panel(self):
        self.assertIn("--site-terminal-bg: var(--site-code-panel-bg);", CSS)
        self.assertIn("--site-terminal-fg: var(--site-fg);", CSS)
        self.assertIn("--site-terminal-muted: var(--site-accent);", CSS)

    def test_public_pages_do_not_expose_obvious_private_contact_details(self):
        private_patterns = [
            re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
            re.compile(r"(?:\+\d{1,3}[\s().-]*)?(?:\d[\s().-]*){8,}"),
            re.compile(r"Resume-Armstrong-Yan-CSE\.pdf"),
            re.compile(r"/Users/armstrong/"),
        ]

        for page_name, text in PUBLIC_PAGES.items():
            with self.subTest(page=page_name):
                text_without_urls = re.sub(r"https?://\S+", "", text)
                text_without_urls = text_without_urls.replace(
                    "armstrong.yan.sg@gmail.com",
                    "",
                )
                for pattern in private_patterns:
                    self.assertIsNone(pattern.search(text_without_urls))


if __name__ == "__main__":
    unittest.main()
