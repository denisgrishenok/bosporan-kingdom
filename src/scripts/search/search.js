export function initSearch() {

    const mainSource = document.querySelector('main.content');
    const searchResult = document.querySelector('.search__result');
    const searchButton = document.querySelector('.search__submit');
    const overlay = document.querySelector('.header__overlay');
    const searchInput = document.querySelector('.search__input');
    const searchList = document.querySelector('.search__list');
    
    
    if (!mainSource || !searchResult || !searchButton || !overlay || !searchInput || !searchList) return;

    const normalizeText = function(text) {
        if (text == null) {
            return "";}
        else return String(text)
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

    const openSearchResult = () => {
        searchResult.classList.add('is-active');
        overlay.classList.add('is-active');
        document.body.classList.add('menu-open');
    }

    const closeSearchResult = () => {
        searchResult.classList.remove('is-active');
        overlay.classList.remove('is-active');
        document.body.classList.remove('menu-open');
    }


    overlay.addEventListener('click', () => closeSearchResult());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchResult.classList.contains('is-active')) {
            closeSearchResult();
        }
    })

    
    let debounceId = null;

    const searchFilter = (input, { immediate }) => {
        let query = normalizeText(input);

        if (debounceId !== null) clearTimeout(debounceId);
        
        if (query === "") {
            searchList.innerHTML = '';
            closeSearchResult();
            return;
        }

        const searchRender = (query, { showMessages, openPanel }) => {
            
            searchList.innerHTML = '';

            let results = searchSource.filter(item => item.searchText.includes(query));

            if (results.length === 0) {
                
                if (showMessages === true) {
                
                const searchEmpty = document.createElement('li');
                const p = document.createElement('p');
                p.textContent = 'Совпадений не найдено';
                searchEmpty.append(p);
                searchList.append(searchEmpty);

                if (openPanel === true) openSearchResult();
                } else {
                   closeSearchResult(); 
                }

                return;

            } 
            
            if (results.length > 0) {

                const searchResults = document.createElement('li');
                const p = document.createElement('p');
                p.textContent = results[0].title;
                searchResults.append(p);
                searchList.append(searchResults);

                if (openPanel === true) openSearchResult();
            }

            
        }

        if (immediate === true) {
            searchRender(query, { showMessages: true, openPanel: true });
            return;
        } 
        
        if (immediate === false) {
            debounceId = setTimeout(() => 
                searchRender(query, { showMessages: false, openPanel: true }), 1000);
            return;
        }

    }

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchFilter(searchInput.value, { immediate: true });
        }
    })

    searchButton.addEventListener('click', () => {
        searchFilter(searchInput.value, { immediate: true });
    })


    searchInput.addEventListener('input', () => {
        searchFilter(searchInput.value, { immediate: false })
    });

}
