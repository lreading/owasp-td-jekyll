document.addEventListener('DOMContentLoaded', () => {
    if (!window.bootstrap || !window.bootstrap.Tooltip) {
        return;
    }

    document.querySelectorAll('[data-bs-toggle-tooltip="tooltip"]').forEach((element) => {
        window.bootstrap.Tooltip.getOrCreateInstance(element);
    });
});
