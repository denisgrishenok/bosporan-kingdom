

const buttonMenu = document.querySelector('.header__button-content');
const dropdownMenu = document.querySelector('.header__dropdown');
const sourceList = document.querySelector('.intro__nav-list');
const overlay = document.querySelector('.header__overlay');


dropdownMenu.append(sourceList.cloneNode(true));

// buttonMenu.addEventListener('click', () => {
//     const isOpen = dropdownMenu.classList.toggle('is-open');
//     buttonMenu.setAttribute('aria-expanded', isOpen);
//     overlay.classList.toggle('is-active', isOpen);
//     document.body.classList.toggle('menu-open');
// });

buttonMenu.addEventListener('click', () => {
    dropdownMenu.classList.toggle('is-open');
    overlay.classList.toggle('is-active');
    document.body.classList.toggle('menu-open');

    buttonMenu.setAttribute('aria-expanded', 'true');
});

overlay.addEventListener('click', () => closeMenu());

const closeMenu = function() {
    dropdownMenu.classList.remove('is-open');
    overlay.classList.remove('is-active');
    document.body.classList.remove('menu-open');

    buttonMenu.setAttribute('aria-expanded', 'false');
    buttonMenu.focus();
}

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

