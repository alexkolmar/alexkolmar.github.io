// ============================================
// СИСТЕМА ПЕРЕВОДОВ (русский по умолчанию)
// ============================================

let currentLanguage = localStorage.getItem('language') || 'ru';
let translations = {};
let originalTexts = {};

// Сохраняем оригинальные русские тексты
function saveOriginalTexts() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        originalTexts[key] = element.textContent.trim();
    });
}

// Загрузка английского JSON
async function loadLanguage(lang) {
    if (lang === 'ru') {
        applyRussian();
        document.documentElement.lang = 'ru';
        localStorage.setItem('language', 'ru');
        currentLanguage = 'ru';
        updateLanguageDisplay('ru');
        return;
    }
    
    try {
        const response = await fetch(`locales/${lang}.json`);
        translations = await response.json();
        applyTranslations();
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        currentLanguage = lang;
        updateLanguageDisplay(lang);
    } catch (error) {
        console.error('Ошибка загрузки языка:', error);
    }
}

// ===== ЕДИНСТВЕННАЯ applyTranslations (с innerHTML) =====
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            // Разрешаем только безопасные теги
            const text = translations[key];
            // Простая санитизация (удаляем опасные теги)
            const sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            element.innerHTML = sanitized; // ✅ innerHTML — теги работают
        }
    });
}

// Возвращаем русский из HTML
function applyRussian() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (originalTexts[key]) {
            element.textContent = originalTexts[key];
        }
    });
}

// ===== Переключатель языков =====

function toggleDropdown() {
    const menu = document.getElementById('lang-menu');
    const btn = document.querySelector('.lang-btn');
    if (menu) menu.classList.toggle('open');
    if (btn) btn.classList.toggle('active');
}

// Закрыть dropdown при клике вне него
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.language-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        const menu = document.getElementById('lang-menu');
        const btn = document.querySelector('.lang-btn');
        if (menu) menu.classList.remove('open');
        if (btn) btn.classList.remove('active');
    }
});

// Обновление названия текущего языка
function updateLanguageDisplay(lang) {
    const flagMap = {
        'ru': '🇷🇺',
        'en': '🇬🇧'
    };
    const nameMap = {
        'ru': 'Русский',
        'en': 'English'
    };
    
    const flagEl = document.getElementById('current-lang-flag');
    const nameEl = document.getElementById('current-lang-name');
    if (flagEl) flagEl.textContent = flagMap[lang] || '🌐';
    if (nameEl) nameEl.textContent = nameMap[lang] || lang;
}

// ===== Глобальная функция переключения =====
window.setLanguage = function(lang) {
    if (lang !== currentLanguage) {
        loadLanguage(lang);
        
        // Закрываем dropdown после выбора
        const menu = document.getElementById('lang-menu');
        const btn = document.querySelector('.lang-btn');
        if (menu) menu.classList.remove('open');
        if (btn) btn.classList.remove('active');
    }
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    saveOriginalTexts();
    updateLanguageDisplay(currentLanguage);
    
    if (currentLanguage === 'en') {
        loadLanguage('en');
    }
});