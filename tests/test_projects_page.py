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

    def test_hey_jarvis_replaces_home_guard_tg_in_both_languages(self):
        for page in (PROJECTS, ZH_PROJECTS):
            self.assertIn("### Hey Jarvis", page)
            self.assertLess(page.index("### Hey Jarvis"), page.index("### VisaPilot"))
            self.assertNotIn("Home Guard TG", page)
            self.assertNotIn("https://github.com/yanqian/home-guard-tg", page)

    def test_hey_jarvis_links_are_scoped_to_each_page_language(self):
        shared_links = (
            "https://github.com/yanqian/hey-jarvis",
            "https://github.com/yanqian/hey-jarvis/releases/tag/v0.1.0-internal",
        )
        for page in (PROJECTS, ZH_PROJECTS):
            for link in shared_links:
                self.assertIn(link, page)
            self.assertNotIn("https://yanqian.github.io/posts/publish/building-hey-jarvis/", page)

        self.assertIn("https://www.youtube.com/watch?v=Cpv3dhFmS3M", PROJECTS)
        self.assertNotIn("https://www.youtube.com/watch?v=PDHQiYzFAXQ&t=9s", PROJECTS)
        self.assertIn("https://www.youtube.com/watch?v=PDHQiYzFAXQ&t=9s", ZH_PROJECTS)
        self.assertNotIn("https://www.youtube.com/watch?v=Cpv3dhFmS3M", ZH_PROJECTS)

    def test_hey_jarvis_copy_preserves_product_and_release_boundaries(self):
        self.assertIn("local-first, bring-your-own-key voice assistant for macOS", PROJECTS)
        self.assertIn("pre-wake microphone audio local", PROJECTS)
        self.assertIn("continuous follow-up questions", PROJECTS)
        self.assertIn("unsigned and not notarized", PROJECTS)
        self.assertIn("not a general consumer release", PROJECTS)
        self.assertIn("本地优先、自带 API Key 的 macOS 语音助手", ZH_PROJECTS)
        self.assertIn("唤醒前的麦克风音频留在本地", ZH_PROJECTS)
        self.assertIn("未经签名和公证", ZH_PROJECTS)
        self.assertIn("并非面向普通消费者的正式版本", ZH_PROJECTS)

    def test_chinese_projects_preserve_status_and_safety_boundaries(self):
        self.assertIn("Obsidian 插件", ZH_PROJECTS)
        self.assertIn("https://community.obsidian.md/plugins/gentle-memories", ZH_PROJECTS)
        self.assertIn("AI 默认关闭", ZH_PROJECTS)
        self.assertIn("不会自动提交官方表单", ZH_PROJECTS)
        self.assertIn("写入 Git 之前会预览变更并要求批准", ZH_PROJECTS)


if __name__ == "__main__":
    unittest.main()
