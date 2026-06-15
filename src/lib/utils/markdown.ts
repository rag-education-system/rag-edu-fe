import { browser } from '$app/environment';

let markedConfigured = false;

async function getMarkdownRenderer() {
	const [{ marked }, DOMPurify] = await Promise.all([import('marked'), import('dompurify')]);

	if (!markedConfigured) {
		marked.setOptions({ breaks: true, gfm: true });
		markedConfigured = true;
	}

	return {
		parse: (content: string) => marked.parse(content, { async: false }) as string,
		sanitize: (html: string) =>
			DOMPurify.default.sanitize(html, {
				USE_PROFILES: { html: true }
			})
	};
}

export async function renderMarkdown(content: string): Promise<string> {
	if (!browser || !content.trim()) return '';
	const renderer = await getMarkdownRenderer();
	return renderer.sanitize(renderer.parse(content));
}
