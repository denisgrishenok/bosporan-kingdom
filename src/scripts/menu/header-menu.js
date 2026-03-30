import { resetSearch } from "../search/search.js";

export function initHeaderMenu() {
    
    const buttonMenu = document.querySelector('.header__button');
    const dropdownMenu = document.querySelector('.header__dropdown');
    const sourceList = document.querySelector('.intro__list');
    const overlay = document.querySelector('.header__overlay');
    const headerLogo = document.querySelector('.header__link');
    const searchInput = document.querySelector('.search__input');

    if (!buttonMenu || !dropdownMenu || !sourceList || !overlay || !headerLogo || !searchInput) return;
    if (!dropdownMenu.children.length) {
        dropdownMenu.append(sourceList.cloneNode(true));
    

        const dropdownList = dropdownMenu.querySelector('.intro__list')

        const linkVK = {
            href: 'https://vk.com/club186611101',
            class: 'intro__link',
            title: 'Перейти в группу ВК',
            description: 'Перейти в группу ВК',
            svg: `<svg class="icon" aria-hidden="true" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.6814 18.0835C10.7152 18.0862 10.7651 18.0903 10.8181 18.0903H15.7478C15.8299 18.0903 15.8907 18.0923 15.9373 18.0933C15.9489 18.1365 15.9656 18.1921 15.9842 18.2681V18.269C16.036 18.4817 16.0741 18.6672 16.0828 18.8413V18.8433C16.129 19.7234 16.2448 20.5979 16.4578 21.4644C16.535 21.7784 16.5953 22.0997 16.658 22.437C16.7198 22.7695 16.7847 23.1181 16.8699 23.4634V23.4644C17.216 24.8599 17.6859 26.2136 18.3123 27.521V27.522C18.8938 28.7333 19.5521 29.9191 20.4178 30.9946L20.4187 30.9956C21.4737 32.3006 22.7499 33.382 24.4217 33.9507V33.9517C24.5406 33.9924 24.6673 34.026 24.7957 34.0503C24.8713 34.0652 24.9387 34.0686 24.9832 34.0698C25.0393 34.0713 25.0629 34.0703 25.1101 34.0728L25.6013 34.0981L25.6346 33.6069C25.6438 33.4678 25.6638 33.2741 25.6638 33.1011C25.6652 30.636 25.6664 28.171 25.6678 25.7065C25.6692 23.2423 25.6703 20.778 25.6717 18.313V18.2065L25.6736 18.0894C25.7019 18.0885 25.7339 18.0876 25.7703 18.0874H30.8504L30.9842 18.0913L30.9881 18.2427V27.4585L31.6072 27.3062C31.9599 27.2198 32.4021 27.1456 32.7713 27.0103H32.7722C34.8713 26.2363 36.5757 24.9257 37.9558 23.2026L37.9568 23.2017C38.9366 21.9747 39.6733 20.6154 40.2371 19.1743C40.3391 18.918 40.3935 18.6509 40.4373 18.4321L40.4383 18.4331C40.4894 18.1836 40.542 18.1361 40.5476 18.1313C40.5514 18.1281 40.6016 18.0874 40.8357 18.0874H45.8728C45.9362 18.0874 45.9852 18.0902 46.0222 18.0942C46.0179 18.1258 46.012 18.1665 45.9998 18.2173C45.6397 19.7089 45.0568 21.1141 44.2762 22.4497C43.3135 24.0942 42.1304 25.5539 40.7303 26.8394H40.7293C39.9277 27.5778 39.0972 28.2368 38.159 28.7231L38.157 28.7241C38.0783 28.7653 38.0181 28.8144 37.9803 28.8462C37.9618 28.8617 37.9406 28.8801 37.9256 28.8931C37.9086 28.9077 37.8921 28.922 37.8738 28.937L37.2508 29.4468L37.9832 29.7788C38.1453 29.8523 38.2858 29.9133 38.4158 29.9712L38.7888 30.147C40.7625 31.1527 42.3814 32.5882 43.7742 34.3306V34.3315C44.5699 35.3262 45.2696 36.3716 45.8387 37.4927L46.074 37.978C46.4273 38.7394 46.7127 39.5186 47.0418 40.3345V40.3354C47.0375 40.3243 47.0398 40.3246 47.0428 40.3462C47.0458 40.3691 47.0475 40.3956 47.0506 40.4429V40.4438C47.0523 40.4703 47.0526 40.4943 47.0535 40.5161C47.0398 40.5163 47.0252 40.5181 47.0096 40.5181H47.0076C45.1957 40.5236 43.3653 40.5129 41.5457 40.5269C41.4971 40.5272 41.4721 40.5209 41.4627 40.5181C41.4553 40.5159 41.4556 40.5154 41.4578 40.5171C41.4554 40.515 41.4294 40.4906 41.3914 40.3931H41.3924C40.9885 39.344 40.4676 38.3621 39.8513 37.4341L39.5818 37.0405C38.3178 35.2384 36.6704 33.9183 34.6238 33.106C33.4297 32.6306 32.4171 32.3681 31.5076 32.3374L31.2908 32.3306L30.9851 32.6362V40.1392C30.9851 40.3224 30.9898 40.4466 30.9803 40.5796V40.5874C30.9781 40.6258 30.971 40.6541 30.9676 40.6753C30.9463 40.6781 30.9177 40.6853 30.8787 40.686H30.8767C30.249 40.7007 29.6923 40.7374 29.1404 40.6802H29.1394C28.1582 40.5798 27.1922 40.4611 26.2547 40.2573H26.2537C25.2922 40.0473 24.3425 39.7964 23.4549 39.4468C21.612 38.7194 19.9525 37.6745 18.4783 36.3364H18.4773C16.8573 34.8666 15.5156 33.1801 14.4236 31.2808V31.2798L14.117 30.7358C13.4168 29.4617 12.8203 28.152 12.3865 26.7769V26.7759L12.1004 25.8647C11.8186 24.9539 11.5532 24.0448 11.3318 23.1284V23.1274L11.2605 22.8071C11.1077 22.0608 11.0438 21.3158 10.908 20.4829L10.8406 20.1382C10.8162 20.0262 10.7911 19.9175 10.7683 19.8169C10.7446 19.712 10.7229 19.6129 10.7049 19.5171L10.6629 19.2378L10.6394 18.9233C10.6263 18.6487 10.6315 18.367 10.6463 18.0806C10.656 18.0814 10.6676 18.0824 10.6814 18.0835Z"/>
                    <path d="M28.8369 0.5C44.4866 0.50018 57.1729 13.1872 57.1729 28.8369C57.1727 44.4865 44.4865 57.1727 28.8369 57.1729C13.1872 57.1729 0.50018 44.4866 0.5 28.8369C0.5 13.1871 13.1871 0.5 28.8369 0.5Z" />
                    </svg>`, 
            target: '_blank',
            rel: 'noopener noreferrer',
        }

        const linkCloudTips = {
            href: 'https://pay.cloudtips.ru/p/18073a77',
            class: 'intro__link',
            title: 'Поддержать автора',
            description: 'Поддержать автора',
            svg: `<svg class="icon" aria-hidden="true" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M29.3366 58.1732C45.2626 58.1732 58.1732 45.2626 58.1732 29.3366C58.1732 13.4106 45.2626 0.5 29.3366 0.5C13.4106 0.5 0.5 13.4106 0.5 29.3366C0.5 45.2626 13.4106 58.1732 29.3366 58.1732Z" />
                    <path d="M23.1941 37.3186L41.8287 18.684C42.2906 18.222 42.8366 17.8581 43.4385 17.6061C44.0404 17.3569 44.6872 17.2281 45.3367 17.2281C45.9862 17.2281 46.6329 17.3569 47.2349 17.6061C47.8368 17.8553 48.3827 18.222 48.8447 18.684C49.3066 19.1459 49.6706 19.6919 49.9225 20.2938C50.1717 20.8957 50.3005 21.5424 50.3005 22.192C50.3005 22.8415 50.1717 23.4882 49.9225 24.0901C49.6734 24.6921 49.3066 25.238 48.8447 25.6999L37.2456 37.3158C35.3811 39.1775 32.853 40.2218 30.2185 40.2218C27.584 40.2218 25.0559 39.1775 23.1913 37.3158L23.1941 37.3186Z" />
                    <path d="M35.5546 21.2316L16.9201 39.8662C16.4581 40.3282 15.9122 40.6921 15.3102 40.9441C14.7083 41.1933 14.0616 41.322 13.4121 41.322C12.7625 41.322 12.1158 41.1933 11.5139 40.9441C10.912 40.6949 10.366 40.3282 9.90409 39.8662C8.9746 38.9339 8.45386 37.6713 8.45386 36.3582C8.45386 35.0452 8.9746 33.7825 9.90409 32.8502L21.5031 21.2344C23.3677 19.3726 25.8958 18.3284 28.5303 18.3284C31.1648 18.3284 33.6929 19.3726 35.5574 21.2344L35.5546 21.2316Z" />
                </svg>`,
            target: '_blank',
            rel: 'noopener noreferrer',       
        } 
    
        const linkHistoryMap = {
            href: 'https://hisma.ru/',
            class: 'intro__link',
            title: 'Перейти на сайт "История и Карта"',
            description: 'Перейти на сайт "История и Карта"',
            svg: `<svg class="icon" aria-hidden="true" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/   svg">
                <circle cx="37" cy="37" r="35" fill="#A7BDC6"/>
                <path d="M51.4211 33.2387C53.1462 34.272 53.9869 36.3211 53.5841 38.2914L53.4177 39.1321L49.0568 60.7176H39.7483L44.0917 39.2109L44.2756 38.2914L44.4245 37.5383C44.4245 37.5383 44.4245 37.4683 44.4245 37.4333C44.4245 37.048 44.3807 36.6714 44.2931 36.3124C43.7852 34.2108 42.4717 32.7308 40.2124 32.7308L49.8449 32.652C50.4054 32.7571 50.9308 32.9585 51.4124 33.2387H51.4211Z" fill="white"/>
                <path d="M38.8989 18.7024C38.8989 18.8863 38.8814 19.0614 38.8464 19.2366L38.645 20.2524L35.7289 34.6836L34.9671 38.4578L30.4749 60.7176H21L29.1 20.6114L29.3715 19.2716L29.3978 19.1402C29.4853 18.7024 29.5029 18.2558 29.424 17.8267C29.065 15.8915 27.5413 14.3678 25.6061 14H35.0196C37.2439 14.4116 38.9252 16.3643 38.9252 18.7024H38.8989Z" fill="white"/>
            </svg>`,
            target: '_blank',
            rel: 'noopener noreferrer',       
        }

        if (!dropdownList) return;

        const extraLinks = [linkVK, linkCloudTips, linkHistoryMap];

        extraLinks.forEach((link) => {
            const li = document.createElement('li');
            li.className = 'intro__item';

            const a = document.createElement('a');
            a.href = link.href;
            a.className = link.class;
            a.title = link.title;
            a.target = link.target;
            a.rel = link.rel;

            const container = document.createElement('div');
            container.className = 'intro__item-container';

            if (link.svg) {
                container.insertAdjacentHTML('beforeend', link.svg);
            }

            const textWrap = document.createElement('div');
            
            const p = document.createElement('p');
            p.textContent = link.description;
            
            textWrap.append(p);
            container.append(textWrap);
            a.append(container);
            li.append(a);
            dropdownList.append(li);

        })
    }

    const openMenu = () => {
        resetSearch();
        
        dropdownMenu.classList.add('is-open');
        overlay.classList.add('is-active');
        document.body.classList.add('menu-open');
        buttonMenu.setAttribute('aria-expanded', 'true');
        buttonMenu.classList.add('is-open');

        highlightActiveLink();

    }

    const closeMenu = ({returnFocus = true} = {}) => {
        dropdownMenu.classList.remove('is-open');
        overlay.classList.remove('is-active');
        document.body.classList.remove('menu-open');
        buttonMenu.setAttribute('aria-expanded', 'false');
        buttonMenu.classList.remove('is-open');

        if (returnFocus) {
            buttonMenu.focus();
        }
    }

    buttonMenu.addEventListener('click', () => {
        dropdownMenu.classList.contains('is-open') ? closeMenu() : openMenu();
    })

    overlay.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('is-open'))
        closeMenu();
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdownMenu.classList.contains('is-open')) {
            closeMenu();
        }
    })

    headerLogo.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('is-open')) 
        closeMenu();
    })

    dropdownMenu.addEventListener('click', (e) => {
        if (e.target.closest('.intro__link')) {
            closeMenu({returnFocus: false})
        }
    })

    searchInput.addEventListener('focusin', () => {
        if (dropdownMenu.classList.contains('is-open'))
            closeMenu({returnFocus: false})
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
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            const isActive = href === `#${currentId}`;
            link.classList.toggle('is-active', isActive);
        })
    }

    window.addEventListener('scroll', highlightActiveLink);

}
