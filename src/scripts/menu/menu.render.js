export const renderMenu = (items, context, listClass) => {
    const ul = document.createElement('ul');
    ul.className = listClass;

    items
        .filter(item => item.contexts.includes(context))
        .forEach(item => {
            const li = document.createElement('li');
            li.className = `menu-item menu-item--${context}`;

            if (item.type === 'card') {
                li.innerHTML = `
                    <a href="${item.href}" class="intro__nav-overlay-link"></a>
                    <div class="intro__nav-link-container">
                        ${item.icon}
                        <p>
                            ${item.title}<br>
                            ${item.subtitle}
                        </p>
                    </div>
                    <div class="intro__nav-description">
                        <p>
                            ${item.description}
                        </p>
                    </div>
                `;
            }

            if (item.type === 'link') {
                li.innerHTML = `
                    <a href="${item.href}" 
                    class="intro__nav-link"
                    ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                        ${item.label}
                    </a>
                `;
            }

            ul.append(li);
        });
    return ul;
};