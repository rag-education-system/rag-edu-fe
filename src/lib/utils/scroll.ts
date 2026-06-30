const LANDING_NAV_OFFSET = 88;

export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
	const el = document.getElementById(id);
	if (!el) return;

	const top = el.getBoundingClientRect().top + window.scrollY - LANDING_NAV_OFFSET;
	window.scrollTo({ top, behavior });
}
