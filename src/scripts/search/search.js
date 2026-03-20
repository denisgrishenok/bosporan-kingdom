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
            return "";
        }
        else return String(text)
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const normalizeForIndex = function(text) {
        if (text == null) {
            return "";
        }
        else return String(text)
        .toLowerCase()
        .replace(/ё/g, 'е')
    }

    const sections = [...mainSource.querySelectorAll('section[id]')].filter(section => section.id !== 'section-intro');
    const searchSource = sections.map((section) => { 
        let titleElement = section.querySelector('h1, h2, h3, h4');
        let paragraphs = [...section.querySelectorAll('p')];
        let title = titleElement ? normalizeText(titleElement.textContent) : '';
        let text = paragraphs.map(p => p.textContent).join(' ');
        let indexText = normalizeForIndex(text);
        
        return {
            id: section.id,
            title,
            text,
            searchText: normalizeText(`${title} ${indexText}`),
            indexText,
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
        let queryRaw = input;
        let queryIndex = normalizeForIndex(queryRaw);


        if (debounceId !== null) clearTimeout(debounceId);
        
        if (normalizeText(queryRaw).length < 3) {
            searchList.innerHTML = '';
            closeSearchResult();
            return;
        }

        const searchRender = (queryIndex, { showMessages, openPanel }) => {
            
            searchList.innerHTML = '';

            let results = searchSource.filter(item => item.indexText.includes(queryIndex));

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

                const item = results.slice(0, 5);

                item.forEach((item) => {

                    const matchIndex = item.indexText.indexOf(queryIndex);

                    if (matchIndex === -1) return;

                    const start = Math.max(0, matchIndex - 60);
                    const end = Math.min(item.text.length, matchIndex + queryIndex.length + 90);
                    let snippet = item.text.slice(start, end);

                    if (start > 0) snippet = '...' + snippet;
                    if (end < item.text.length) snippet = snippet + '...';

                    const searchResults = document.createElement('li');
                    searchResults.classList.add('search__item');
                    
                    const p = document.createElement('p');
                    p.classList.add('search__title');
                    p.textContent = item.title;
                    
                    const pSnippet = document.createElement('p');
                    pSnippet.classList.add('search__snippet');
                    pSnippet.textContent = snippet;
                    
                    searchResults.append(p, pSnippet);
                    searchList.append(searchResults);

                    searchResults.addEventListener('click', () => closeSearchResult());

                })               
                
                if (openPanel === true) openSearchResult();                
                
            }
            
        }

        if (immediate === true) {
            searchRender(queryIndex, { showMessages: true, openPanel: true });
            return;
        } 
        
        if (immediate === false) {
            debounceId = setTimeout(() => 
                searchRender(queryIndex, { showMessages: false, openPanel: true }), 250);
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
