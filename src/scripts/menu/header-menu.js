export function initHeaderMenu() {
    
    const buttonMenu = document.querySelector('.header__button');
    const dropdownMenu = document.querySelector('.header__dropdown');
    const sourceList = document.querySelector('.intro__list');
    const overlay = document.querySelector('.header__overlay');

    if (!buttonMenu || !dropdownMenu || !sourceList || !overlay) return;
    if (!dropdownMenu.children.length) {
        dropdownMenu.append(sourceList.cloneNode(true));
    }

    const openMenu = () => {
        dropdownMenu.classList.add('is-open');
        overlay.classList.add('is-active');
        document.body.classList.add('menu-open');
        buttonMenu.setAttribute('aria-expanded', 'true');

        highlightActiveLink();

    }

    const closeMenu = ({returnFocus = true} = {}) => {
        dropdownMenu.classList.remove('is-open');
        overlay.classList.remove('is-active');
        document.body.classList.remove('menu-open');
        buttonMenu.setAttribute('aria-expanded', 'false');

        if (returnFocus) {
            buttonMenu.focus();
        }
    }

    buttonMenu.addEventListener('click', () => {
        dropdownMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    })

    overlay.addEventListener('click', () => closeMenu());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdownMenu.classList.contains('is-open')) {
            closeMenu();
        }
    })

    dropdownMenu.addEventListener('click', (e) => {
        if (e.target.closest('.intro__link')) {
            closeMenu({returnFocus: false})
        }
    })

    const getCurrentSectionId = () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        let currentId = null;

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                currentId = section.id;
            }
        })

        return currentId;
    }

    const highlightActiveLink = () => {
        const currentId = getCurrentSectionId();
        if (!currentId) return;

        const links = dropdownMenu.querySelectorAll('.intro__link');

        links.forEach(link => {
            const isActive = link.getAttribute('href') === `#${currentId}`;
            link.classList.toggle('is-active', isActive);
            
        })
    }

    window.addEventListener('scroll', highlightActiveLink);

}
