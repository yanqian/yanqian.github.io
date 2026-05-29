from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
PROJECTS = (ROOT / "content/projects.md").read_text()


class ProjectsPageTest(unittest.TestCase):
    def test_home_guard_tg_entry_exists(self):
        self.assertIn("### Home Guard TG", PROJECTS)
        self.assertIn("https://github.com/yanqian/home-guard-tg", PROJECTS)

    def test_home_guard_tg_copy_stays_concise(self):
        self.assertIn("trusted-host Telegram Bot for checking on home from a Mac", PROJECTS)
        self.assertIn("/camera_clip", PROJECTS)
        self.assertIn("capture a short camera clip", PROJECTS)
        self.assertIn("/photo", PROJECTS)
        self.assertIn("capture a still image", PROJECTS)
        self.assertIn("/sound_alarm", PROJECTS)
        self.assertIn("play a local audible alert", PROJECTS)
        self.assertNotIn("/camera_test", PROJECTS)
        self.assertNotIn("/logs", PROJECTS)
        self.assertNotIn("/status", PROJECTS)


if __name__ == "__main__":
    unittest.main()
