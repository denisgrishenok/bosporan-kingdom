let resetSearchImpl = null;
export const resetSearch = () => {
    if (typeof resetSearchImpl === 'function') resetSearchImpl();
}

export function initSearch() {

    const mainSource = document.querySelector('main.content');
    const searchResult = document.querySelector('.search__result');
    const overlay = document.querySelector('.header__overlay');
    const searchInput = document.querySelector('.search__input');
    const searchList = document.querySelector('.search__list'); 
    const searchClear = document.querySelector('.search__clear');
    const searchSubmit = document.querySelector('.search__submit');
    
    if (!mainSource || !searchResult || !overlay || !searchInput || !searchList) return;

    const clearHighlights = () => {
        document.querySelectorAll('.search__highlight').forEach((el) => {
            const parent = el.parentNode;
            if (!parent) return;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
    }

    clearHighlights();
    
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

    let debounceId = null;
    let lastQueryMeaningful = '';

    const resetSearchInternal = () => {
        if (searchInput?.value === '' && !searchResult?.classList.contains('is-active') && !document.querySelector('.search__highlight')) return;
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.classList.remove('is-active');
        if (searchSubmit) searchSubmit.classList.remove('is-hidden');
        if (searchList) searchList.innerHTML = '';
        if (searchResult) searchResult.classList.remove('is-active');
        if (overlay) overlay.classList.remove('is-active');
        lastQueryMeaningful = '';
        if (debounceId !== null) {
            clearTimeout(debounceId);
            debounceId = null;
        }

        clearHighlights();
    }

    resetSearchImpl = resetSearchInternal;

    overlay.addEventListener('click', () => {
        closeSearchResult();
        resetSearchInternal();
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchResult.classList.contains('is-active')) {
            closeSearchResult();
            resetSearchInternal();
        }
    })

    document.addEventListener('click', (e) => {
        if (e.target.closest('.header__search') || e.target.closest('.search__result')) return;
        if (e.target.closest('.header__link, .intro__link, picture')) resetSearchInternal();
    }, true )

    if (searchClear) {searchClear.addEventListener('click', () => {
        resetSearchInternal();
        closeSearchResult();
        searchInput.focus();
        })
    }

    const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const collectRanges = (text, tokens) => {
        const ranges = [];

        for (const token of tokens) {
            const t = token.trim();
            if (!t) continue;

            const re = new RegExp(escapeRegExp(t), 'giu');
            let m;
            while ((m = re.exec(text)) !== null) {
                const start = m.index;
                const end = start + m[0].length;
                if (end > start) ranges.push({ start, end });
                if (m[0].length === 0) re.lastIndex++;
            }
        }

        ranges.sort((a, b) => a.start - b.start || a.end - b.end);
        const merged = [];
        for (const r of ranges) {
            const last = merged[merged.length - 1];
            if (!last || r.start > last.end) merged.push({ ...r });
            else last.end = Math.max(last.end, r.end);
        }

        return merged;
    }

    const renderHighlighted = (el, text, tokens) => {
            el.textContent = '';
            const ranges = collectRanges(text, tokens);
            if (ranges.length === 0) {
                el.textContent = text;
                return;
            }

            const frag = document.createDocumentFragment();
            let cursor = 0;

            for (const { start, end } of ranges) {
                if (start > cursor) frag.append(document.createTextNode(text.slice(cursor, start)));

                const mark = document.createElement('mark');
                mark.textContent = text.slice(start, end);
                frag.append(mark);

                cursor = end;
            }

            if (cursor < text.length) frag.append(document.createTextNode(text.slice(cursor)));
            el.append(frag);
        }

    const searchFilter = (input, { immediate }) => {
        const queryRaw = input;
        const meaningful = normalizeText(queryRaw);
        const cleanedMeaningful = meaningful.replace(/[^\p{L}\p{N}\s]+/gu, ' ').replace(/\s+/g, ' ').trim();
        const tokens = [...new Set(cleanedMeaningful.split(' ').filter((token) => token.length >= 3))];
        const queryIndex = normalizeForIndex(meaningful);

        if (immediate === false || meaningful !== lastQueryMeaningful) clearHighlights();
        
        if (meaningful === lastQueryMeaningful && immediate === false) {
            return;
        } else {
            lastQueryMeaningful = meaningful;
        }

        if (debounceId !== null) clearTimeout(debounceId);
        
        if (queryIndex.length < 3) {
            searchList.innerHTML = '';
            closeSearchResult();
            return;
        }

        const scrollToMatch = (sectionId, token) => {
            
            clearHighlights();
            
            const section = document.getElementById(sectionId);
            if (!section) {
                location.hash = sectionId;
                return;
            }
            
            const needle = String(token || '').trim().toLowerCase();
            if (!needle) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }

            const walker = document.createTreeWalker(
                section, 
                NodeFilter.SHOW_TEXT, 
                {
                    acceptNode(node) {
                        return node.nodeValue && node.nodeValue.trim()
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            });

            let textNode;
            while ((textNode = walker.nextNode())) {
                const hay = textNode.nodeValue.toLowerCase();
                const idx = hay.indexOf(needle);
                if (idx === -1) continue;

                let matchNode = textNode.splitText(idx);
                let afterNode = matchNode.splitText(needle.length);

                const parent = afterNode.parentNode;
                const highlight = document.createElement('span');

                highlight.className = 'search__highlight';
                highlight.appendChild(matchNode);
                parent.insertBefore(highlight, afterNode);

                const rect = highlight.getBoundingClientRect();
                const header = document.querySelector('.header');
                const headerOffset = header ? header.getBoundingClientRect().height : 0;

                window.scrollTo({
                    top: window.scrollY + rect.top - headerOffset - 26,
                    behavior: 'smooth',
                });

                return;
            }

            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const searchRender = (queryIndex, { showMessages, openPanel }) => {
            
            searchList.innerHTML = '';

            if (tokens.length === 0) {
                searchList.innerHTML = '';
                closeSearchResult();
                return;
            }

            let results = searchSource.filter(item => tokens.every(token => item.indexText.includes(token)));

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
                const anchor = tokens.reduce((max, t) => (t.length > max.length ? t : max), tokens[0]);

                item.forEach((item) => {
                    const matchIndex = item.indexText.indexOf(anchor);

                    if (matchIndex === -1) return;

                    const start = Math.max(0, matchIndex - 40);
                    const end = Math.min(item.text.length, matchIndex + anchor.length + 60);
                    let snippet = item.text.slice(start, end);
                    
                    if (start > 0) {
                        snippet = snippet.replace(/^\S+\s/, '');
                        snippet = '...' + snippet;
                    }
                    if (end < item.text.length) {
                        snippet = snippet.replace(/\s\S+$/, '');
                        snippet = snippet + '...';
                    }

                    const searchResults = document.createElement('li');
                    searchResults.classList.add('search__item');

                    const a = document.createElement('a');
                    a.href = '#' + item.id;
                    
                    const p = document.createElement('p');
                    p.classList.add('search__title');
                    p.textContent = item.title;
                    
                    const pSnippet = document.createElement('p');
                    pSnippet.classList.add('search__snippet');
                   
                    renderHighlighted(pSnippet, snippet, tokens);
                    
                    a.append(pSnippet);
                    searchResults.append(p, a);
                    searchList.append(searchResults);

                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        closeSearchResult();
                        scrollToMatch(item.id, anchor);
                    })

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

    searchInput.addEventListener('input', () => {
        const hasText = () => {
            if (searchInput.value.trim().length > 0 && searchClear) {
                searchClear.classList.add('is-active');
                searchSubmit.classList.add('is-hidden');
            } else {
                searchClear.classList.remove('is-active');
                searchSubmit.classList.remove('is-hidden');
            }
        }
        hasText();
        searchFilter(searchInput.value, { immediate: false })
    });

}
