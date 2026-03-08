const THEME_STORAGE_KEY = 'td-theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function getStoredTheme() {
    try {
        const theme = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (theme === LIGHT_THEME || theme === DARK_THEME) {
            return theme;
        }
    } catch (error) {
        // Ignore storage access issues and fall back to the system preference.
    }

    return null;
}

function getPreferredTheme() {
    return getStoredTheme() || (themeMediaQuery.matches ? DARK_THEME : LIGHT_THEME);
}

function applyTheme(theme) {
    const rootElement = document.documentElement;
    rootElement.setAttribute('data-theme', theme);
    rootElement.setAttribute('data-bs-theme', theme);
    rootElement.style.colorScheme = theme;
}

function updateThemeToggle(theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach((toggleButton) => {
        const nextTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        const nextThemeLabel = nextTheme === DARK_THEME ? 'dark' : 'light';
        const nextThemeText = nextTheme === DARK_THEME ? 'Dark mode' : 'Light mode';
        const iconElement = toggleButton.querySelector('.theme-toggle-icon');
        const labelElement = toggleButton.querySelector('[data-theme-toggle-label]');
        const textElement = toggleButton.querySelector('[data-theme-toggle-text]');

        toggleButton.setAttribute('aria-pressed', String(theme === DARK_THEME));
        toggleButton.setAttribute('aria-label', `Switch to ${nextThemeLabel} mode`);
        toggleButton.setAttribute('title', `Switch to ${nextThemeLabel} mode`);

        if (labelElement) {
            labelElement.textContent = `Switch to ${nextThemeLabel} mode`;
        }

        if (textElement) {
            textElement.textContent = nextThemeText;
        }

        if (iconElement) {
            iconElement.classList.toggle('fa-moon', theme !== DARK_THEME);
            iconElement.classList.toggle('fa-sun', theme === DARK_THEME);
        }
    });
}

function setTheme(theme, persistThemePreference) {
    applyTheme(theme);
    updateThemeToggle(theme);

    if (persistThemePreference) {
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
            // Ignore storage access issues and continue with the applied theme.
        }
    }
}

applyTheme(getPreferredTheme());

document.addEventListener('DOMContentLoaded', () => {
    updateThemeToggle(getPreferredTheme());

    document.querySelectorAll('[data-theme-toggle]').forEach((toggleButton) => {
        toggleButton.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') === DARK_THEME ? DARK_THEME : LIGHT_THEME;
            const nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
            setTheme(nextTheme, true);
        });
    });
});

function handleSystemThemeChange(event) {
    if (getStoredTheme()) {
        return;
    }

    const nextTheme = event.matches ? DARK_THEME : LIGHT_THEME;
    applyTheme(nextTheme);
    updateThemeToggle(nextTheme);
}

if (typeof themeMediaQuery.addEventListener === 'function') {
    themeMediaQuery.addEventListener('change', handleSystemThemeChange);
} else if (typeof themeMediaQuery.addListener === 'function') {
    themeMediaQuery.addListener(handleSystemThemeChange);
}
