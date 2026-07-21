from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
PROJECTS = (ROOT / "content/projects.md").read_text()
ZH_PROJECTS = (ROOT / "content/projects.zh.md").read_text()


class ProjectsPageTest(unittest.TestCase):
    def test_gentle_memories_review_link_exists(self):
        self.assertIn("### Gentle Memories", PROJECTS)
        self.assertIn("Obsidian Plugin", PROJECTS)
        self.assertIn("https://community.obsidian.md/plugins/gentle-memories", PROJECTS)

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

    def test_chinese_projects_preserve_status_and_safety_boundaries(self):
        self.assertIn("Obsidian 插件", ZH_PROJECTS)
        self.assertIn("https://community.obsidian.md/plugins/gentle-memories", ZH_PROJECTS)
        self.assertIn("AI 默认关闭", ZH_PROJECTS)
        self.assertIn("不会自动提交官方表单", ZH_PROJECTS)
        self.assertIn("写入 Git 之前会预览变更并要求批准", ZH_PROJECTS)
        self.assertIn("只接受已授权聊天发来的命令", ZH_PROJECTS)


if __name__ == "__main__":
    unittest.main()
