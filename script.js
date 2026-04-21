const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-content');

function activateTab(tabId) {
    tabs.forEach((tab) => {
        const isActive = tab.dataset.tab === tabId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
        const isActive = panel.id === tabId;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
    });
}

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        activateTab(tab.dataset.tab);
    });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
        const tabId = link.getAttribute('href').slice(1);

        if (document.getElementById(tabId)?.classList.contains('tab-content')) {
            activateTab(tabId);
        }
    });
});

const initialTab = window.location.hash.slice(1);
activateTab(document.getElementById(initialTab)?.classList.contains('tab-content') ? initialTab : 'blog');
