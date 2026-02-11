import { menuItems } from "./menu.config.js";
import { renderMenu } from "./menu.render.js";

export function initMenu() {
    const main = document.querySelector('#menu-main');
    const dropdown = document.querySelector('#header-dropdown');
    const overlay = document.querySelector('.header__overlay');
    const dropdownBtn = document.querySelector('.header__button');

    if (!main || !dropdown || !overlay || !dropdownBtn) return;

    main.append(renderMenu(menuItems, 'main', 'intro__nav-list'));
    dropdown.append(renderMenu(menuItems, 'dropdown', 'intro__nav-list'));
    

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

    
    [dropdown].forEach(menu => {
        menu.addEventListener('click', e => {
            if (e.target.closest('a')) {
                closeDropdown();
                
            }
        });
    });

    overlay.addEventListener('click', () => {
        closeDropdown();
        
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeDropdown();
            
        }
    });
}
