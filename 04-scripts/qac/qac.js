// ============================================
// Быстрая смена аккаунтов — Clean Version
// Основано на логике Deff, переписано с нуля
// Сохраняет лицензионный data-атрибут
// ============================================

(function($, window, document, undefined) {
    'use strict';

    // ----- Получение лицензионного ключа (без хардкода) -----
    function getLicenseKey() {
        // Способ 1: document.currentScript (работает во всех современных браузерах)
        if (document.currentScript) {
            const key = document.currentScript.getAttribute('data');
            if (key) return key;
        }
        
        // Способ 2: ищем скрипт с нашим именем файла и атрибутом data
        const scripts = document.querySelectorAll('script[data]');
        for (let script of scripts) {
            // Проверяем по src (если скрипт называется quick-acc-clean.js или похоже)
            if (script.src && (script.src.includes('quick-acc') || script.src.includes('93129'))) {
                const key = script.getAttribute('data');
                if (key) return key;
            }
        }
        
        // Способ 3: берём ПЕРВЫЙ скрипт с data-атрибутом (на форуме он скорее всего один)
        const anyScript = document.querySelector('script[data]');
        if (anyScript) {
            return anyScript.getAttribute('data');
        }
        
        return null;
    }

    const CONFIG = {
        licenseKey: getLicenseKey(),
        storageKey: 'UserLogin',
        exitIcon: window.New_EXiT || 'http://forumstatic.ru/files/001c/1f/15/59496.png',
        formId: 'qa-quick-switch',
        listId: 'qa-user-list'
    };

    // Если нет ключа — выходим
    if (!CONFIG.licenseKey) {
        console.error('QuickAcc: Лицензионный ключ не найден. Скрипт отключён.');
        return;
    }

    // ----- Работа с localStorage (оригинальный формат) -----
    const storage = {
        save: function(data) {
            localStorage.setItem(CONFIG.storageKey, btoa(encodeURIComponent(JSON.stringify(data))));
        },
        load: function() {
            try {
                let raw = localStorage.getItem(CONFIG.storageKey);
                if (!raw) return [];
                return JSON.parse(decodeURIComponent(atob(raw)));
            } catch(e) {
                return [];
            }
        },
        add: function(login, password) {
            let accounts = this.load();
            let existing = accounts.find(a => a[0] === login);
            if (existing) {
                existing[1] = password;
            } else {
                accounts.push([login, password, Date.now()]);
            }
            accounts.sort((a,b) => a[0].localeCompare(b[0]));
            this.save(accounts);
            return accounts;
        },
        remove: function(index) {
            let accounts = this.load();
            accounts.splice(index, 1);
            this.save(accounts);
            return accounts;
        }
    };

    // ----- Создание красивой DOM-структуры -----
    function createForm() {
        const template = `
            <div id="${CONFIG.formId}" class="qa-form">
                <div class="qa-header">
                    <div class="qa-actions">
                        <button type="button" class="qa-copy-btn" title="Копировать аккаунты (для переноса)">📋 Копировать</button>
                        <button type="button" class="qa-paste-btn" title="Вставить скопированные аккаунты">📥 Вставить</button>
                    </div>
                    <div class="qa-import-area" style="display:none;">
                        <input type="text" class="qa-import-input" placeholder="Вставьте скопированные данные сюда...">
                        <button type="button" class="qa-import-confirm">✓ Импорт</button>
                    </div>
                </div>
                
                <div class="qa-body">
                    <div class="qa-user-list-section">
                        <div class="qa-user-list-title">📁 Мои аккаунты</div>
                        <ul id="${CONFIG.listId}" class="qa-user-list"></ul>
                        <div class="qa-hint">Клик по нику — авторизация</div>
                    </div>
                    
                    <div class="qa-login-section">
                        <div class="qa-login-title">🔐 Вход в аккаунт</div>
                        <div class="qa-field">
                            <label>Имя пользователя</label>
                            <input type="text" id="qa-login" class="qa-input" placeholder="Ваш ник">
                        </div>
                        <div class="qa-field">
                            <label>Пароль</label>
                            <input type="password" id="qa-password" class="qa-input" placeholder="Пароль">
                        </div>
                        <button type="submit" id="qa-submit" class="qa-submit-btn">Войти</button>
                        
                        <div class="qa-links">
                            <a href="/register.php">📝 Регистрация</a>
                            <a href="/login.php?action=forget">❓ Забыли пароль?</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return $(template);
    }

    // ----- Рендер списка аккаунтов -----
    function renderUserList() {
        const accounts = storage.load();
        const $list = $(`#${CONFIG.listId}`);
        $list.empty();
        
        if (accounts.length === 0) {
            $list.html('<li class="qa-empty">Нет сохранённых аккаунтов</li>');
            return;
        }
        
        accounts.forEach((account, idx) => {
            const $li = $(`<li class="qa-user-item" data-index="${idx}">
                <span class="qa-user-name">${escapeHtml(account[0])}</span>
                <button class="qa-user-delete" title="Удалить">✕</button>
            </li>`);
            $list.append($li);
        });
        
        // Обработчики
        $list.find('.qa-user-name').on('click', function() {
            const idx = $(this).closest('li').data('index');
            const account = accounts[idx];
            if (account) {
                $('#qa-login').val(account[0]);
                $('#qa-password').val(account[1]);
                $('#qa-submit').focus();
            }
        });
        
        $list.find('.qa-user-delete').on('click', function(e) {
            e.stopPropagation();
            if (confirm('Удалить аккаунт?')) {
                const idx = $(this).closest('li').data('index');
                storage.remove(idx);
                renderUserList();
            }
        });
    }
    
    // ----- Копирование/вставка (Base64, совместимо с оригиналом) -----
    function copyAccounts() {
        const accounts = storage.load();
        if (accounts.length === 0) {
            alert('Нет аккаунтов для копирования');
            return;
        }
        const data = btoa(encodeURIComponent(JSON.stringify(accounts)));
        const textarea = $('<textarea>').val(data).css({position:'fixed',top:'-9999px'}).appendTo('body');
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        alert('✅ Аккаунты скопированы! Вставьте на другом устройстве через "Вставить"');
    }
    
    function showPasteField() {
        $('.qa-import-area').toggle();
        $('.qa-import-input').val('').focus();
    }
    
    function pasteAccounts() {
        const raw = $('.qa-import-input').val().trim();
        if (!raw) {
            alert('Вставьте данные в поле');
            return;
        }
        try {
            const decoded = JSON.parse(decodeURIComponent(atob(raw)));
            if (Array.isArray(decoded)) {
                decoded.forEach(acc => {
                    if (acc[0] && acc[1]) storage.add(acc[0], acc[1]);
                });
                renderUserList();
                alert('✅ Аккаунты импортированы!');
                $('.qa-import-area').hide();
            } else {
                alert('Неверный формат данных');
            }
        } catch(e) {
            alert('Ошибка: неверные данные');
        }
    }
    
    // ----- Отправка формы входа (оригинальная логика) -----
    function submitLogin() {
        const username = $('#qa-login').val().trim();
        const password = $('#qa-password').val().trim();
        
        if (!username) {
            $('#qa-login').addClass('qa-error').focus();
            return;
        }
        if (!password) {
            $('#qa-password').addClass('qa-error').focus();
            return;
        }
        
        $('#qa-login, #qa-password').removeClass('qa-error');
        
        // Сохраняем в localStorage после успешного входа (как в оригинале)
        storage.add(username, password);
        renderUserList();
        
        // Отправляем форму форума
        const $form = $('#punlogin form, #loginform, form[action*="login.php"]');
        if ($form.length) {
            $form.find('input[name="req_username"]').val(username);
            $form.find('input[name="req_password"]').val(password);
            $form.find('input[name="cookie_check"]').prop('checked', true);
            
            // Вызываем оригинальный обработчик, если есть
            if (typeof window._process_form === 'function') {
                window._process_form($form[0]);
            } else {
                $form.submit();
            }
        } else {
            // Fallback
            window.location.href = `/login.php?action=in&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
        }
    }
    
    // ----- Интеграция в шапку форума -----
    function injectIntoHeader() {
        const $loginLink = $('#navlogin a:first, #pun-navlinks a:contains("Вход"), .menu a:contains("Вход")');
        if (!$loginLink.length) return false;
        
        // Создаём и вставляем форму
        const $form = createForm();
        $loginLink.after($form);
        
        // Добавляем иконку выхода, если уже залогинены
        if ($('#navlogout').length) {
            const $exitIcon = $(`<a id="New-exit" href="/login.php?action=out&logout_key=${Math.random()}" style="position:relative;display:inline-block;">
                <img src="${CONFIG.exitIcon}" width="20" height="20" alt="Выход">
            </a>`);
            $loginLink.after($exitIcon);
        }
        
        // Обработчики событий
        $('#qa-submit').on('click', submitLogin);
        $('.qa-copy-btn').on('click', copyAccounts);
        $('.qa-paste-btn').on('click', showPasteField);
        $('.qa-import-confirm').on('click', pasteAccounts);
        
        // Нажатие Enter в полях
        $('#qa-login, #qa-password').on('keypress', function(e) {
            if (e.which === 13) submitLogin();
        });
        
        // Скрывать форму при клике вне
        $(document).on('click', function(e) {
            if (!$(e.target).closest(`#${CONFIG.formId}, #navlogin a, #New-exit`).length) {
                $form.hide();
            }
        });
        
        // Тоггл формы по клику на "Вход"
        $loginLink.on('click', function(e) {
            e.preventDefault();
            $form.toggle();
            if ($form.is(':visible')) {
                $('#qa-login').focus();
            }
        });
        
        renderUserList();
        return true;
    }
    
    // ----- Вспомогательные функции -----
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // ----- Запуск после загрузки DOM -----
    $(function() {
        // Небольшая задержка на случай, если шапка форума подгружается динамически
        let attempts = 0;
        const tryInject = setInterval(() => {
            if (injectIntoHeader()) {
                clearInterval(tryInject);
            } else if (++attempts > 20) {
                clearInterval(tryInject);
                console.warn('QuickAcc: не найден элемент входа');
            }
        }, 200);
    });
    
})(window.jQuery, window, document);