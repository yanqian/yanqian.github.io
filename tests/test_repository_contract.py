from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class RepositoryContractTest(unittest.TestCase):
    def test_development_workflow_files_exist(self):
        required = [
            "AGENTS.md",
            "SPEC.md",
            "test_plan.md",
            "init.sh",
            "Makefile",
            "feature_list.json",
            "progress.md",
            "orchestrator.py",
            "docs/development-workflow.md",
            "docs/requirements/README.md",
            "docs/requirements/F007-giscus-comments.md",
        ]

        for path in required:
            self.assertTrue((ROOT / path).exists(), f"{path} should exist")

    def test_generated_article_markdown_only_lives_under_publish(self):
        posts_dir = ROOT / "content/posts"
        if not posts_dir.exists():
            return

        offenders = []
        for path in posts_dir.rglob("*.md"):
            relative = path.relative_to(posts_dir)
            if not relative.parts or relative.parts[0] != "Publish":
                offenders.append(str(path.relative_to(ROOT)))

        self.assertEqual(
            offenders,
            [],
            "Generated article Markdown should live only under content/posts/Publish/.",
        )

    def test_public_content_metadata_uses_selected_not_featured(self):
        publish_dir = ROOT / "content/posts/Publish"
        if not publish_dir.exists():
            return

        offenders = []
        for path in publish_dir.rglob("*.md"):
            text = path.read_text()
            if "\nfeatured:" in text or text.startswith("featured:"):
                offenders.append(str(path.relative_to(ROOT)))

        self.assertEqual(
            offenders,
            [],
            "Homepage curation should use selected, not featured.",
        )

    def test_workflow_docs_preserve_obsidian_source_boundary(self):
        spec = (ROOT / "SPEC.md").read_text()
        agents = (ROOT / "AGENTS.md").read_text()

        for text in (spec, agents):
            self.assertIn("Obsidian", text)
            self.assertIn("content/posts/Publish", text)

    def test_feature_list_has_required_shape(self):
        import json

        data = json.loads((ROOT / "feature_list.json").read_text())
        self.assertIsInstance(data.get("features"), list)
        for feature in data["features"]:
            self.assertIn("id", feature)
            self.assertIn("description", feature)
            self.assertIn("passes", feature)

    def test_progress_mentions_current_status_sections(self):
        progress = (ROOT / "progress.md").read_text()
        self.assertIn("## Current System Status", progress)
        self.assertIn("## Last Completed Feature", progress)
        self.assertIn("## Next Feature", progress)


if __name__ == "__main__":
    unittest.main()
