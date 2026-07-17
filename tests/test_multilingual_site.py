from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
CONFIG = (ROOT / "hugo.toml").read_text()
HEADER = (ROOT / "layouts/_partials/header.html").read_text()
HOME_TEMPLATE = (ROOT / "layouts/index.html").read_text()
HEAD_EXTENSIONS = (ROOT / "layouts/_partials/head/extensions.html").read_text()
EN_I18N = (ROOT / "i18n/en.toml").read_text()
ZH_I18N = (ROOT / "i18n/zh-cn.toml").read_text()


class MultilingualSiteTest(unittest.TestCase):
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
        cls.build_output = result.stdout + result.stderr

    @classmethod
    def tearDownClass(cls):
        cls.temp_dir.cleanup()

    def read_output(self, relative_path):
        return (self.public_dir / relative_path).read_text()

    def test_hugo_config_preserves_english_urls_and_adds_chinese_prefix(self):
        required = [
            'defaultContentLanguage = "en"',
            "defaultContentLanguageInSubdir = false",
            "[languages.en]",
            'locale = "en-US"',
            'label = "English"',
            "[languages.zh]",
            'locale = "zh-CN"',
            'label = "中文"',
            "[[languages.en.menu.main]]",
            "[[languages.zh.menu.main]]",
        ]
        for entry in required:
            self.assertIn(entry, CONFIG)

    def test_project_i18n_files_cover_local_template_copy(self):
        keys = [
            "home",
            "latest",
            "all_posts",
            "no_public_posts",
            "selected",
            "all_series",
            "post_count",
            "topics",
            "all_topics",
            "entry_toc",
            "comments",
            "series_navigation",
            "previous",
            "next",
            "built_with",
            "switch_to_language",
        ]
        for key in keys:
            marker = f"[{key}]"
            self.assertIn(marker, EN_I18N)
            self.assertIn(marker, ZH_I18N)

    def test_templates_use_translation_aware_switches_and_links(self):
        self.assertIn(".Translations", HEADER)
        self.assertIn(".Site.Home.AllTranslations", HEADER)
        self.assertIn('class="language-switch"', HEADER)
        self.assertIn('i18n "switch_to_language"', HEADER)
        self.assertIn('"posts/" | relLangURL', HOME_TEMPLATE)
        self.assertIn('printf "series/%s/"', HOME_TEMPLATE)
        self.assertIn('printf "topics/%s/"', HOME_TEMPLATE)
        self.assertNotIn('href="/posts/"', HOME_TEMPLATE)
        self.assertNotIn('href="/series/', HOME_TEMPLATE)
        self.assertNotIn('href="/topics/', HOME_TEMPLATE)

    def test_build_generates_english_root_and_chinese_home(self):
        english = self.read_output("index.html")
        chinese = self.read_output("zh/index.html")

        self.assertIn('<html lang="en">', english)
        self.assertIn('<html lang="zh">', chinese)
        self.assertIn('href="/projects/"', english)
        self.assertNotIn('href="/en/projects/"', english)
        self.assertIn('<h2 id="latest-title">Latest</h2>', english)
        self.assertIn('<h2 id="latest-title">最新文章</h2>', chinese)
        self.assertIn('href="/zh/posts/"', chinese)
        self.assertIn("我在新加坡的三棵树中学到的东西", chinese)
        self.assertNotIn("暂无中文文章。", chinese)
        self.assertNotIn("deprecated", self.build_output.lower())

    def test_language_switch_uses_home_fallback_for_untranslated_posts(self):
        english_home = self.read_output("index.html")
        chinese_home = self.read_output("zh/index.html")
        english_post = self.read_output(
            "posts/publish/remote-mac-terminal-for-codex/index.html"
        )

        self.assertIn('class="language-switch" href="/zh/"', english_home)
        self.assertIn('class="language-switch" href="/"', chinese_home)
        self.assertIn('class="language-switch" href="/zh/"', english_post)

    def test_language_homepages_emit_alternate_metadata(self):
        for relative_path in ("index.html", "zh/index.html"):
            output = self.read_output(relative_path)
            self.assertIn(
                'hreflang="en-US" href="https://yanqian.github.io/"', output
            )
            self.assertIn(
                'hreflang="zh-CN" href="https://yanqian.github.io/zh/"', output
            )
            self.assertIn(
                'hreflang="x-default" href="https://yanqian.github.io/"', output
            )

        self.assertIn("range .AllTranslations", HEAD_EXTENSIONS)

    def test_chinese_taxonomy_indexes_localize_titles_and_metadata(self):
        expected_titles = {
            "categories/index.html": "分类",
            "tags/index.html": "标签",
            "series/index.html": "系列",
            "topics/index.html": "主题",
        }
        for relative_path, title in expected_titles.items():
            output = self.read_output(f"zh/{relative_path}")
            self.assertIn(f"{title} · Armstrong Yan", output)
            self.assertIn(f'>{title}</a>', output)
            self.assertIn(f'<meta name="twitter:title" content="{title}">', output)
            self.assertIn(f'<meta property="og:title" content="{title}">', output)

    def test_paired_content_prefers_the_matching_page_translation(self):
        with tempfile.TemporaryDirectory() as content_dir, tempfile.TemporaryDirectory() as output_dir:
            content_path = Path(content_dir)
            (content_path / "paired.en.md").write_text(
                "---\ntitle: Paired page\n---\nEnglish body.\n"
            )
            (content_path / "paired.zh.md").write_text(
                "---\ntitle: 配对页面\n---\n中文正文。\n"
            )

            result = subprocess.run(
                [
                    "hugo",
                    "--contentDir",
                    str(content_path),
                    "--destination",
                    output_dir,
                    "--baseURL",
                    "https://yanqian.github.io/",
                ],
                cwd=ROOT,
                text=True,
                capture_output=True,
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

            english = (Path(output_dir) / "paired/index.html").read_text()
            chinese = (Path(output_dir) / "zh/paired/index.html").read_text()
            self.assertIn(
                'class="language-switch" href="/zh/paired/"', english
            )
            self.assertIn('class="language-switch" href="/paired/"', chinese)
            for output in (english, chinese):
                self.assertIn(
                    'hreflang="en-US" href="https://yanqian.github.io/paired/"',
                    output,
                )
                self.assertIn(
                    'hreflang="zh-CN" href="https://yanqian.github.io/zh/paired/"',
                    output,
                )


if __name__ == "__main__":
    unittest.main()
