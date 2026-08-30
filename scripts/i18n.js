// ============================================
// СИСТЕМА ПЕРЕВОДОВ (русский по умолчанию)
// ============================================

let currentLanguage = localStorage.getItem('language') || 'ru';
let translations = {};
let originalTexts = {}; // ← храним оригинальный русский текст

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
        // Возвращаем русский из HTML
        applyRussian();
        document.documentElement.lang = 'ru';
        localStorage.setItem('language', 'ru');
        currentLanguage = 'ru';
        return;
    }
    
    try {
        const response = await fetch(`locales/${lang}.json`);
        translations = await response.json();
        applyTranslations();
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        currentLanguage = lang;
    } catch (error) {
        console.error('Ошибка загрузки языка:', error);
    }
}

// Применяем английский перевод
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
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

// Переключение языка
function setLanguage(lang) {
    if (lang !== currentLanguage) {
        loadLanguage(lang);
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    // Сохраняем русские тексты
    saveOriginalTexts();
    
    // Если был выбран английский — подгружаем
    if (currentLanguage === 'en') {
        loadLanguage('en');
    }
    // Иначе остаётся русский
});


// ===== Переключатель языков (dropdown) =====

function toggleDropdown() {
    const menu = document.getElementById('lang-menu');
    const btn = document.querySelector('.lang-btn');
    menu.classList.toggle('open');
    btn.classList.toggle('active');
}

// Закрыть dropdown при клике вне него
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.language-dropdown');
    if (!dropdown.contains(event.target)) {
        const menu = document.getElementById('lang-menu');
        const btn = document.querySelector('.lang-btn');
        menu.classList.remove('open');
        btn.classList.remove('active');
    }
});

// Обновление названия текущего языка (вызывать после смены языка)
function updateLanguageDisplay(lang) {
    const flagMap = {
        'ru': '🇷🇺',
        'en': '🇬🇧'
        // 'de': '🇩🇪'
    };
    
    const nameMap = {
        'ru': 'Русский',
        'en': 'English'
        // 'de': 'Deutsch'
    };
    
    document.getElementById('current-lang-flag').textContent = flagMap[lang] || '🌐';
    document.getElementById('current-lang-name').textContent = nameMap[lang] || lang;
}

// ===== ДОПОЛНЯЕМ setLanguage =====
// В твоей существующей функции setLanguage добавь вызов updateLanguageDisplay

// Пример:
window.setLanguage = function(lang) {
    console.log('Переключение на:', lang);
    if (lang !== currentLanguage) {
        loadLanguage(lang);
        updateLanguageDisplay(lang); // ← добавляем эту строку
        
        // Закрываем dropdown после выбора
        const menu = document.getElementById('lang-menu');
        const btn = document.querySelector('.lang-btn');
        menu.classList.remove('open');
        btn.classList.remove('active');
    }
};

// При инициализации обновляем отображение
document.addEventListener('DOMContentLoaded', () => {
    // ... твой существующий код ...
    updateLanguageDisplay(currentLanguage);
});