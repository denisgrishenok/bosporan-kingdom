import { menuItems } from "./menu.config.js";
import { renderMenu } from "./menu.render.js";

export function initMenu() {
    const main = document.querySelector('#menu-main');
    const dropdown = document.querySelector('#header-dropdown');
    const mobile = document.querySelector('#mobile-menu');
    const overlay = document.querySelector('.header__overlay');
    const dropdownBtn = document.querySelector('.header__button-content');

    if (!main || !dropdown || !mobile || !overlay || !dropdownBtn) return;

    main.append(renderMenu(menuItems, 'main', 'intro__nav-list'));
    dropdown.append(renderMenu(menuItems, 'dropdown', 'intro__nav-list'));
    mobile.append(renderMenu(menuItems, 'mobile', 'mobile-menu__list'));

    const openDropdown = () => {
        dropdown.classList.add('is-open');
        overlay.classList.add('is-active');
        dropdownBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
    };

    const closeDropdown = () => {
        dropdown.classList.remove('is-open');
        overlay.classList.remove('is-active');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    dropdownBtn.addEventListener('click', () => {
        dropdown.classList.contains('is-open') ? closeDropdown() : openDropdown();
    });

    const openMobile = () => {
        mobile.classList.add('is-open');
        mobile.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
    };

    const closeMobile = () => {
        mobile.classList.remove('is-open');
        mobile.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
    };

    [dropdown, mobile].forEach(menu => {
        menu.addEventListener('click', e => {
            if (e.target.closest('a')) {
                closeDropdown();
                closeMobile();
            }
        });
    });

    overlay.addEventListener('click', () => {
        closeDropdown();
        closeMobile();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeDropdown();
            closeMobile();
        }
    });
}
