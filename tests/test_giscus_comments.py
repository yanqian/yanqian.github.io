from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
CONFIG = (ROOT / "hugo.toml").read_text()
POST_TEMPLATE = (ROOT / "layouts/posts/single.html").read_text()
GISCUS_PARTIAL = (ROOT / "layouts/_partials/posts/giscus.html").read_text()
CSS = (ROOT / "assets/css/custom.css").read_text()
GISCUS_LIGHT_CSS = (ROOT / "static/css/giscus-light.css").read_text()
GISCUS_DARK_CSS = (ROOT / "static/css/giscus-dark.css").read_text()


class GiscusCommentsTest(unittest.TestCase):
    def test_giscus_is_configured_for_github_discussions(self):
        required_config = [
            "[params.giscus]",
            'repo = "yanqian/yanqian.github.io"',
            'repoID = "R_kgDOIJVODA"',
            'category = "General"',
            'categoryID = "DIC_kwDOIJVODM4C-VOf"',
            'mapping = "pathname"',
            'strict = "1"',
            'reactionsEnabled = "1"',
            'inputPosition = "bottom"',
            'theme = "/css/giscus-light.css"',
            'darkTheme = "/css/giscus-dark.css"',
            'loading = "lazy"',
        ]

        for entry in required_config:
            self.assertIn(entry, CONFIG)

    def test_post_template_renders_giscus_after_article_content(self):
        content_index = POST_TEMPLATE.index('<div class="post-content">')
        giscus_index = POST_TEMPLATE.index('{{ partial "posts/giscus.html" . }}')

        self.assertGreater(giscus_index, content_index)

    def test_giscus_partial_is_scoped_and_respects_page_disable_flag(self):
        self.assertIn(".Params.disableComments", GISCUS_PARTIAL)
        self.assertIn('class="post-comments giscus-comments"', GISCUS_PARTIAL)
        self.assertIn("document.currentScript.closest('.giscus-comments')", GISCUS_PARTIAL)
        self.assertIn("https://giscus.app/client.js", GISCUS_PARTIAL)
        self.assertIn("data-reactions-enabled", GISCUS_PARTIAL)
        self.assertIn('absURL (default "/css/giscus-light.css"', GISCUS_PARTIAL)
        self.assertIn('absURL (default "/css/giscus-dark.css"', GISCUS_PARTIAL)
        self.assertIn("themeChanged", GISCUS_PARTIAL)

    def test_comment_section_has_article_page_spacing(self):
        self.assertIn(".post-comments {", CSS)
        self.assertIn("border-top: 1px solid var(--site-border);", CSS)
        self.assertIn(".post-comments h2 {", CSS)

    def test_custom_giscus_themes_match_site_backgrounds(self):
        self.assertIn("--color-canvas-default: #f5f7f6;", GISCUS_LIGHT_CSS)
        self.assertIn("--color-canvas-subtle: #eef3f1;", GISCUS_LIGHT_CSS)
        self.assertIn("--color-accent-fg: #0f766e;", GISCUS_LIGHT_CSS)
        self.assertIn(".gsc-comment,", GISCUS_LIGHT_CSS)
        self.assertIn("background: #f5f7f6;", GISCUS_LIGHT_CSS)

        self.assertIn("--color-canvas-default: #202827;", GISCUS_DARK_CSS)
        self.assertIn("--color-canvas-subtle: #263331;", GISCUS_DARK_CSS)
        self.assertIn("--color-accent-fg: #5eead4;", GISCUS_DARK_CSS)
        self.assertIn(".gsc-comment,", GISCUS_DARK_CSS)
        self.assertIn("background: #202827;", GISCUS_DARK_CSS)


if __name__ == "__main__":
    unittest.main()
