export function initSearch() {

    const mainSource = document.querySelector('main.content');

    if (!mainSource) return;

    const normalizeText = function(text) {
        return text
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const sections = [...mainSource.querySelectorAll('section[id]')].filter(section => section.id !== 'section-intro');
    const searchSource = sections.map((section) => { 
        let titleElement = section.querySelector('h1, h2, h3, h4');
        let paragraphs = [...section.querySelectorAll('p')];
        let title = titleElement ? normalizeText(titleElement.textContent) : '';
        let text = normalizeText(paragraphs.map(p => p.textContent).join(' '));
        return {
            id: section.id,
            title,
            text,
            searchText: normalizeText(`${title} ${text}`),
        };
    }).filter(item => item.id.trim().length > 0 && item.searchText.trim().length > 0)
}
