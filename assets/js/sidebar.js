// Hide submenus on initial load.
document.querySelectorAll('#body-row .collapse').forEach((element) => {
    bootstrap.Collapse.getOrCreateInstance(element, { toggle: false }).hide();
});

function getSidebarContainer() {
    return document.getElementById('sidebar-container');
}

function isSidebarCollapsed() {
    return getSidebarContainer()?.classList.contains('sidebar-collapsed');
}

function setSidebarToggleLabel() {
    const toggle = document.querySelector('[data-sidebar-toggle="collapse"]');
    if (!toggle) {
        return;
    }

    const label = isSidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar';
    toggle.setAttribute('title', label);
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('data-bs-original-title', label);
}

function syncSidebarTooltips() {
    if (!window.bootstrap || !window.bootstrap.Tooltip) {
        return;
    }

    document.querySelectorAll('[data-sidebar-item], [data-sidebar-toggle="collapse"]').forEach((element) => {
        const tooltip = window.bootstrap.Tooltip.getInstance(element);
        if (!tooltip) {
            return;
        }

        if (isSidebarCollapsed()) {
            tooltip.enable();
        } else {
            tooltip.hide();
            tooltip.disable();
        }
    });
}

function expandSidebarSubmenu(submenuId) {
    if (!submenuId || !window.bootstrap || !window.bootstrap.Collapse) {
        return;
    }

    const submenu = document.getElementById(submenuId);
    if (!submenu) {
        return;
    }

    bootstrap.Collapse.getOrCreateInstance(submenu, { toggle: false }).show();
}

// Collapse click
document.querySelectorAll('[data-sidebar-toggle="collapse"]').forEach((element) => {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        SidebarCollapse();
    });
});

document.querySelectorAll('[data-sidebar-item]').forEach((element) => {
    element.addEventListener('click', (event) => {
        if (!isSidebarCollapsed()) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        SidebarCollapse();
        expandSidebarSubmenu(element.dataset.sidebarSubmenu);
        element.focus();
    });
});

function toggleClassForEach(selector, className) {
    document.querySelectorAll(selector).forEach((element) => {
        element.classList.toggle(className);
    });
}

function SidebarCollapse() {
    toggleClassForEach('.menu-collapsed', 'd-none');
    toggleClassForEach('.sidebar-submenu', 'd-none');
    toggleClassForEach('.submenu-icon', 'd-none');

    const sidebarContainer = getSidebarContainer();
    if (sidebarContainer) {
        sidebarContainer.classList.toggle('sidebar-expanded');
        sidebarContainer.classList.toggle('sidebar-collapsed');
    }

    // Treat d-flex/d-none on separators with title.
    toggleClassForEach('.sidebar-separator-title', 'd-flex');

    // Collapse/Expand icon.
    const collapseIcon = document.getElementById('collapse-icon');
    if (collapseIcon) {
        collapseIcon.classList.toggle('fa-angle-left');
        collapseIcon.classList.toggle('fa-angle-right');
    }

    setSidebarToggleLabel();
    syncSidebarTooltips();
}

window.addEventListener('load', () => {
    setSidebarToggleLabel();
    syncSidebarTooltips();
});
