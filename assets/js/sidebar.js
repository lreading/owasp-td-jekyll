// Hide submenus on initial load.
document.querySelectorAll('#body-row .collapse').forEach((element) => {
    bootstrap.Collapse.getOrCreateInstance(element, { toggle: false }).hide();
});

// Collapse click
document.querySelectorAll('[data-sidebar-toggle="collapse"]').forEach((element) => {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        SidebarCollapse();
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

    const sidebarContainer = document.getElementById('sidebar-container');
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
}
