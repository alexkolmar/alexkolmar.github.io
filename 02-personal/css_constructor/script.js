// ================================================================
// 1.  ОПИСАНИЕ ВСЕХ НАСТРОЕК (ТЫ МОЖЕШЬ ДОБАВЛЯТЬ СВОИ!)
// ================================================================
// ВСЯ МАГИЯ ЗДЕСЬ.  Чтобы добавить новый переключатель —
// просто добавь объект в нужный массив (columns, elements, global).
// Структура объекта:
//   id          — уникальный ключ (строка)
//   label       — текст рядом с чекбоксом
//   selector    — CSS-селектор (строка). Для колонок можно массив.
//   default     — true/false (включен по умолчанию?)
//   width       — только для колонок! число (процент)
// ================================================================

// Конфигурация колонок (с шириной)
const COLUMNS_CONFIG = [
    { id: 'col1', label: 'Колонка 1 ( .tc1 )', selector: '.tc1', default: true, width: 25 },
    { id: 'col2', label: 'Колонка 2 ( .tc2 )', selector: '.tc2', default: true, width: 25 },
    { id: 'col3', label: 'Колонка 3 ( .tc3 )', selector: '.tc3', default: true, width: 25 },
    { id: 'col4', label: 'Колонка 4 ( .tc4 )', selector: '.tc4', default: true, width: 25 },
];

// Конфигурация элементов (просто вкл/выкл, без ширины)
const ELEMENTS_CONFIG = [
    { id: 'avatar', label: 'Аватарка ( .avatar )', selector: '.avatar', default: true },
    { id: 'signature', label: 'Подпись ( .signature )', selector: '.signature', default: true },
    { id: 'postdate', label: 'Дата ( .post-date )', selector: '.post-date', default: true },
    { id: 'postbody', label: 'Тело сообщения ( .post-body )', selector: '.post-body', default: true },
];

// Конфигурация глобальных фич (одиночные правила)
const GLOBAL_CONFIG = [
    { id: 'hide_header', label: 'Скрыть шапку ( .forum-header )', selector: '.forum-header', default: false },
    { id: 'hide_footer', label: 'Скрыть подвал ( .forum-footer )', selector: '.forum-footer', default: false },
    { id: 'hide_borders', label: 'Убрать рамки у таблиц ( table )', selector: 'table', default: false },
];

// ================================================================
// 2.  СОСТОЯНИЕ (ХРАНИЛИЩЕ)
// ================================================================
let state = {};          // { id: true/false } для всех
let widths = {};         // { col1: 25, col2: 25, ... } только для колонок
let baseCSS = '';        // базовый CSS

// ================================================================
// 3.  ИНИЦИАЛИЗАЦИЯ
// ================================================================

function initDefaults() {
    // Колонки
    COLUMNS_CONFIG.forEach(c => {
        state[c.id] = c.default;
        widths[c.id] = c.width;
    });
    // Элементы
    ELEMENTS_CONFIG.forEach(c => {
        state[c.id] = c.default;
    });
    // Глобальные
    GLOBAL_CONFIG.forEach(c => {
        state[c.id] = c.default;
    });
    // Базовый CSS (берём из textarea или дефолтный)
    const textarea = document.getElementById('base-css');
    if (textarea) {
        baseCSS = textarea.value;
    }
}

// ================================================================
// 4.  ПЕРЕСЧЁТ ШИРИНЫ (УМНАЯ ЛОГИКА)
// ================================================================

function recalcWidths(changedId, newValue) {
    const activeIds = COLUMNS_CONFIG.filter(c => state[c.id] === true).map(c => c.id);
    if (activeIds.length === 0) return;

    if (changedId && activeIds.includes(changedId)) {
        let val = parseFloat(newValue);
        if (isNaN(val) || val < 0) val = 0;
        if (val > 100) val = 100;
        widths[changedId] = val;

        const others = activeIds.filter(id => id !== changedId);
        if (others.length > 0) {
            const remainder = 100 - val;
            const share = remainder / others.length;
            others.forEach(id => {
                widths[id] = Math.round(share * 100) / 100;
            });
        }
        normalizeWidths(activeIds);
        return;
    }

    const share = 100 / activeIds.length;
    activeIds.forEach(id => {
        widths[id] = Math.round(share * 100) / 100;
    });
    normalizeWidths(activeIds);
}

function normalizeWidths(ids) {
    let sum = ids.reduce((acc, id) => acc + widths[id], 0);
    if (ids.length === 0) return;
    const diff = 100 - sum;
    if (Math.abs(diff) > 0.001) {
        const last = ids[ids.length - 1];
        widths[last] = Math.round((widths[last] + diff) * 100) / 100;
        if (widths[last] < 0 || widths[last] > 100) {
            const share = 100 / ids.length;
            ids.forEach(id => { widths[id] = Math.round(share * 100) / 100; });
            let s2 = ids.reduce((a, id) => a + widths[id], 0);
            const d2 = 100 - s2;
            const last2 = ids[ids.length - 1];
            widths[last2] = Math.round((widths[last2] + d2) * 100) / 100;
        }
    }
}

// ================================================================
// 5.  ГЕНЕРАЦИЯ CSS
// ================================================================

function generateCSS() {
    const dynamicRules = [];

    // ---- Колонки ----
    const hiddenCols = COLUMNS_CONFIG.filter(c => state[c.id] === false);
    if (hiddenCols.length > 0) {
        const selectors = hiddenCols.map(c => c.selector).join(', ');
        dynamicRules.push(`${selectors} { display: none; }`);
    }

    const activeCols = COLUMNS_CONFIG.filter(c => state[c.id] === true);
    if (activeCols.length > 0) {
        activeCols.forEach(c => {
            const w = widths[c.id] !== undefined ? widths[c.id] : 25;
            dynamicRules.push(`${c.selector} { width: ${w}%; }`);
        });
    }

    // ---- Элементы ----
    const hiddenEls = ELEMENTS_CONFIG.filter(c => state[c.id] === false);
    if (hiddenEls.length > 0) {
        const selectors = hiddenEls.map(c => c.selector).join(', ');
        dynamicRules.push(`${selectors} { display: none; }`);
    }

    // ---- Глобальные ----
    GLOBAL_CONFIG.forEach(c => {
        if (state[c.id] === true) {
            dynamicRules.push(`${c.selector} { display: none; }`);
        }
    });

    // Собираем финальный CSS: сначала базовый, потом динамические правила
    const base = document.getElementById('base-css').value.trim();
    const dynamic = dynamicRules.join('\n');

    let result = '';
    if (base) {
        result += base + '\n\n';
    }
    if (dynamic) {
        result += '/* ===== ДИНАМИЧЕСКИЕ ПРАВИЛА (конструктор) ===== */\n' + dynamic;
    } else if (!base) {
        result = '/* Нет базового CSS и все элементы включены — код пуст */';
    }

    return result;
}

// ================================================================
// 6.  ОТРИСОВКА ИНТЕРФЕЙСА
// ================================================================

function renderAll() {
    renderColumns();
    renderElements();
    renderGlobal();
    updateCSSPreview();
    saveState();
}

// ----- Колонки -----
function renderColumns() {
    const container = document.getElementById('columns-group');
    container.innerHTML = '';
    COLUMNS_CONFIG.forEach(c => {
        const row = document.createElement('div');
        row.className = 'setting-row';

        const label = document.createElement('label');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = state[c.id] !== undefined ? state[c.id] : c.default;
        cb.dataset.id = c.id;
        cb.dataset.type = 'column';
        label.appendChild(cb);
        label.append(c.label);
        row.appendChild(label);

        const wWrap = document.createElement('div');
        wWrap.className = 'width-input' + (state[c.id] ? ' active' : '');
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.min = '0';
        inp.max = '100';
        inp.step = '0.5';
        inp.value = widths[c.id] !== undefined ? widths[c.id] : 25;
        inp.dataset.id = c.id;
        const span = document.createElement('span');
        span.textContent = '%';
        wWrap.appendChild(inp);
        wWrap.appendChild(span);
        row.appendChild(wWrap);

        container.appendChild(row);

        // События
        cb.addEventListener('change', function (e) {
            const id = this.dataset.id;
            const checked = this.checked;
            state[id] = checked;

            const parentRow = this.closest('.setting-row');
            const wInput = parentRow.querySelector('.width-input');
            if (checked) {
                wInput.classList.add('active');
            } else {
                wInput.classList.remove('active');
            }

            recalcWidths(null, null);
            updateWidthInputs();
            renderAll();
        });

        inp.addEventListener('input', function (e) {
            const id = this.dataset.id;
            const val = parseFloat(this.value);
            if (!isNaN(val) && val >= 0 && val <= 100) {
                recalcWidths(id, val);
                updateWidthInputs();
                updateCSSPreview();
                saveState();
            }
        });
    });
}

function updateWidthInputs() {
    document.querySelectorAll('#columns-group .setting-row').forEach(row => {
        const cb = row.querySelector('input[type="checkbox"]');
        const inp = row.querySelector('.width-input input[type="number"]');
        if (cb && inp) {
            const id = cb.dataset.id;
            if (state[id] && widths[id] !== undefined) {
                inp.value = Math.round(widths[id] * 100) / 100;
            }
        }
    });
}

// ----- Элементы -----
function renderElements() {
    const container = document.getElementById('elements-group');
    container.innerHTML = '';
    ELEMENTS_CONFIG.forEach(c => {
        const row = document.createElement('div');
        row.className = 'setting-row';
        const label = document.createElement('label');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = state[c.id] !== undefined ? state[c.id] : c.default;
        cb.dataset.id = c.id;
        cb.dataset.type = 'element';
        label.appendChild(cb);
        label.append(c.label);
        row.appendChild(label);
        container.appendChild(row);

        cb.addEventListener('change', function () {
            state[this.dataset.id] = this.checked;
            renderAll();
        });
    });
}

// ----- Глобальные -----
function renderGlobal() {
    const container = document.getElementById('global-group');
    container.innerHTML = '';
    GLOBAL_CONFIG.forEach(c => {
        const row = document.createElement('div');
        row.className = 'setting-row';
        const label = document.createElement('label');
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = state[c.id] !== undefined ? state[c.id] : c.default;
        cb.dataset.id = c.id;
        cb.dataset.type = 'global';
        label.appendChild(cb);
        label.append(c.label);
        row.appendChild(label);
        container.appendChild(row);

        cb.addEventListener('change', function () {
            state[this.dataset.id] = this.checked;
            renderAll();
        });
    });
}

// ----- Обновление превью CSS -----
function updateCSSPreview() {
    const css = generateCSS();
    document.getElementById('css-preview').textContent = css;
}

// ================================================================
// 7.  СОХРАНЕНИЕ / ЗАГРУЗКА (localStorage + JSON)
// ================================================================

function saveState() {
    const data = {
        state: state,
        widths: widths,
        baseCSS: document.getElementById('base-css').value,
    };
    localStorage.setItem('forum_constructor_data', JSON.stringify(data));
}

function loadState() {
    const raw = localStorage.getItem('forum_constructor_data');
    if (!raw) return false;
    try {
        const data = JSON.parse(raw);
        if (data.state && data.widths) {
            Object.keys(data.state).forEach(key => {
                if (state.hasOwnProperty(key)) {
                    state[key] = data.state[key];
                }
            });
            Object.keys(data.widths).forEach(key => {
                if (widths.hasOwnProperty(key)) {
                    widths[key] = data.widths[key];
                }
            });
            if (data.baseCSS !== undefined) {
                document.getElementById('base-css').value = data.baseCSS;
                baseCSS = data.baseCSS;
            }
            return true;
        }
    } catch (e) { }
    return false;
}

function resetToDefaults() {
    if (!confirm('Сбросить все настройки к значениям по умолчанию?')) return;
    // Сбрасываем базовый CSS на дефолтный (из textarea при загрузке)
    const defaultBase = `/* ===== БАЗОВЫЕ СТИЛИ ФОРУМА ===== */
/* Сюда пиши CSS, который всегда должен быть включён */
/* Например: сброс стилей, шрифты, цвета, общие классы */

body {
    background: #f4f6f9;
    font-family: 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

.forum-container {
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.tc1, .tc2, .tc3, .tc4 {
    float: left;
    padding: 10px;
    box-sizing: border-box;
}

/* Остальной базовый CSS можешь дописывать сюда */`;
    document.getElementById('base-css').value = defaultBase;
    initDefaults();
    recalcWidths(null, null);
    renderAll();
}

// ================================================================
// 8.  ЭКСПОРТ / ИМПОРТ JSON
// ================================================================

function exportJSON() {
    const data = {
        state: state,
        widths: widths,
        baseCSS: document.getElementById('base-css').value,
        meta: { exported: new Date().toISOString() }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forum_styles_config.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.state && data.widths) {
                Object.keys(data.state).forEach(key => {
                    if (state.hasOwnProperty(key)) state[key] = data.state[key];
                });
                Object.keys(data.widths).forEach(key => {
                    if (widths.hasOwnProperty(key)) widths[key] = data.widths[key];
                });
                if (data.baseCSS !== undefined) {
                    document.getElementById('base-css').value = data.baseCSS;
                }
                renderAll();
                alert('✅ Настройки импортированы!');
            } else {
                alert('❌ Неверный формат JSON.');
            }
        } catch (err) {
            alert('❌ Ошибка чтения файла: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// ================================================================
// 9.  КОПИРОВАНИЕ CSS
// ================================================================

function copyCSS() {
    const pre = document.getElementById('css-preview');
    const text = pre.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-copy');
        const orig = btn.textContent;
        btn.textContent = '✅ Скопировано!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
    }).catch(() => {
        const range = document.createRange();
        range.selectNode(pre);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        alert('CSS скопирован в буфер!');
    });
}

// ================================================================
// 10. ЗАПУСК ПРИ ЗАГРУЗКЕ
// ================================================================

// Инициализация
initDefaults();

// Загружаем сохранённое состояние
const loaded = loadState();

if (loaded) {
    COLUMNS_CONFIG.forEach(c => {
        if (widths[c.id] === undefined) widths[c.id] = c.width;
    });
    const activeIds = COLUMNS_CONFIG.filter(c => state[c.id] === true).map(c => c.id);
    if (activeIds.length > 0) {
        let sum = activeIds.reduce((acc, id) => acc + (widths[id] || 0), 0);
        if (Math.abs(sum - 100) > 1) {
            recalcWidths(null, null);
        }
    }
} else {
    recalcWidths(null, null);
}

renderAll();
updateWidthInputs();

// Событие для textarea (сохраняем при изменении)
document.getElementById('base-css').addEventListener('input', function () {
    saveState();
    updateCSSPreview();
});

// ================================================================
// 11. ПРИВЯЗКА КНОПОК
// ================================================================

document.getElementById('btn-export').addEventListener('click', exportJSON);
document.getElementById('btn-import').addEventListener('click', function () {
    document.getElementById('file-input').click();
});
document.getElementById('file-input').addEventListener('change', function (e) {
    if (this.files.length > 0) {
        importJSON(this.files[0]);
        this.value = '';
    }
});
document.getElementById('btn-reset').addEventListener('click', resetToDefaults);
document.getElementById('btn-copy').addEventListener('click', copyCSS);

console.log('✅ Конструктор загружен! Базовый CSS сохраняется и не трогается переключателями.');