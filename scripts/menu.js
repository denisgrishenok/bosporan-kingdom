export function initHeaderMenu() {

    const buttonMenu = document.querySelector('.header__button-content');
    const dropdownMenu = document.querySelector('.header__dropdown');
    const sourceList = document.querySelector('.intro__nav-list');
    const overlay = document.querySelector('.header__overlay');

    if(!buttonMenu || !dropdownMenu || !sourceList || !overlay) return;

    dropdownMenu.append(sourceList.cloneNode(true));

    const openMenu = () => {

        // console.log('openMenu called');

        dropdownMenu.classList.add('is-open');
        overlay.classList.add('is-active');
        document.body.classList.add('menu-open');

        buttonMenu.setAttribute('aria-expanded', 'true');

        highlightActiveLink();
    }

    buttonMenu.addEventListener('click', () => {
        const isOpen = dropdownMenu.classList.contains('is-open');

        isOpen ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', () => closeMenu());

 

    document.addEventListener('keydown', (e) => {
            if(e.key !== 'Escape') return;
            if(!dropdownMenu.classList.contains('is-open')) return;

            if(e.key === 'Escape' || e.key === 'Esc') {
                closeMenu();
            }
        }
    )

    dropdownMenu.addEventListener('click', (e) => {
        if(e.target.closest('.intro__nav-overlay-link')) {
            closeMenu({returnFocus: false});
        }
        
    })


    const closeMenu = ({returnFocus = true} = {}) => {
        dropdownMenu.classList.remove('is-open');
        overlay.classList.remove('is-active');
        document.body.classList.remove('menu-open');

        buttonMenu.setAttribute('aria-expanded', 'false');

        if(returnFocus) {
            buttonMenu.focus();
        }
    }

    const getCurrentSectionId = () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        let currentId = null;

        sections.forEach(section => {
            if(scrollPosition >= section.offsetTop) {
                currentId = section.id;
            }
        })

        return currentId;
    }

    const highlightActiveLink = () => {
        const currentId = getCurrentSectionId();

        if(!currentId) return;

        const links = dropdownMenu.querySelectorAll('.intro__nav-overlay-link');

        links.forEach(link => {
            
            const parentItem = link.closest('.intro__nav-item');            
            
            if(!parentItem) return;
            
            parentItem.classList.toggle(
                'is-active',
                link.hash === `#${currentId}`
            )
        })
    }

    
}
