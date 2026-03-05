export function initSearch() {

    const mainSource = document.querySelector('main.content');

    if (!mainSource) return;

    const sections = [...mainSource.querySelectorAll('section[id]')];
    const searchSource = sections.map((section) => { 
        let titleElement = section.querySelector('h1, h2, h3, h4');
        let paragraphs = [...section.querySelectorAll('p')];
        return {
            id: section.id,
            title: titleElement ? titleElement.textContent : '',
            text: paragraphs.map(p => p.textContent).join(' '),
        };
    })

    console.log(searchSource.slice(0, 3));
}