document.addEventListener('DOMContentLoaded', () => {
    const mobileMediaQuery = window.matchMedia('(max-width: 767.98px)');
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.getElementById('navbarNavDropdown');

    if (!navbar || !navbarCollapse || !window.bootstrap || !window.bootstrap.Collapse) {
        return;
    }

    const collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false });

    function hideMobileNav() {
        if (mobileMediaQuery.matches && navbarCollapse.classList.contains('show')) {
            collapseInstance.hide();
        }
    }

    document.addEventListener('click', (event) => {
        if (!mobileMediaQuery.matches || !navbarCollapse.classList.contains('show')) {
            return;
        }

        if (!navbar.contains(event.target)) {
            hideMobileNav();
        }
    });

    navbarCollapse.querySelectorAll('.td-mobile-menu-link').forEach((element) => {
        element.addEventListener('click', () => {
            if (element.classList.contains('td-mobile-menu-toggle')) {
                return;
            }

            hideMobileNav();
        });
    });

    function handleViewportChange(event) {
        if (!event.matches) {
            collapseInstance.hide();
        }
    }

    if (typeof mobileMediaQuery.addEventListener === 'function') {
        mobileMediaQuery.addEventListener('change', handleViewportChange);
    } else if (typeof mobileMediaQuery.addListener === 'function') {
        mobileMediaQuery.addListener(handleViewportChange);
    }
});
