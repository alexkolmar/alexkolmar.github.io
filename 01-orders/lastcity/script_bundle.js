const previewCookie = '_PreviewToggle';
const disableCharCountersKey = 'disableCharCounters';
const allowedForumIds = [5, 10, 14, 15, 21, 23, 25];

function setCookiePPrev(name, value, ms) {
 if (ms) {
  const d = new Date();
  d.setTime(d.getTime() + ms);
  document.cookie =
   name + '=' + value + '; expires=' + d.toUTCString() + '; path=/';
 } else if (name && value) {
  document.cookie = name + '=' + value + '; path=/';
 }
}

function getCookiePPrev(name) {
 const re = new RegExp(name + '=([^;]+)');
 const m = re.exec(document.cookie);
 return m ? m[1] : null;
}

let originalParseContent = window.ParseContent || function () { };

function togglePreviewState(disable) {
 if (disable) {
  setCookiePPrev(previewCookie, 'OFF', 30 * 24 * 3600 * 1000);
  $('#post-preview').hide();
  window.ParseContent = function () { };
 } else {
  setCookiePPrev(previewCookie, '0', -1);
  window.ParseContent = originalParseContent;
  originalParseContent();
  $('#post-preview').show();
 }
}

function isPreviewDisabled() {
 return getCookiePPrev(previewCookie) === 'OFF';
}

function isCountersDisabled() {
 return localStorage.getItem(disableCharCountersKey) === '1';
}

function setCountersDisabled(val) {
 localStorage.setItem(disableCharCountersKey, val ? '1' : '0');
}

function removeAllCounters() {
 document
  .querySelectorAll(
   '.posts-char-count-wrapper, .posts-char-count-reply-wrapper',
  )
  .forEach((el) => el.remove());
}

function applyCharCounter() {
 if (isCountersDisabled()) return;
 document.querySelectorAll('.post:not(.topicpost)').forEach((post) => {
  const content = post.querySelector('.post-content');
  if (!content) return;
  const paragraphs = Array.from(content.querySelectorAll('p')).filter(
   (p) => !p.closest('.post-sig'),
  );
  let allText = '';
  paragraphs.forEach((p) => {
   allText += p.textContent;
  });
  const charCount = allText.length;
  let insertAfter =
   post.querySelector('.post-vote') ||
   post.querySelector('.post-rating') ||
   content;
  if (
   insertAfter.nextElementSibling &&
   insertAfter.nextElementSibling.classList.contains(
    'posts-char-count-wrapper',
   )
  ) {
   return;
  }
  const wrapper = document.createElement('div');
  wrapper.className = 'posts-char-count-wrapper';
  const inner = document.createElement('div');
  inner.className = 'posts-char-count';
  inner.textContent = `${charCount}`;
  wrapper.appendChild(inner);
  insertAfter.after(wrapper);
 });
}

function addReplyCharCounter() {
 if (isCountersDisabled()) return;
 const textarea = document.getElementById('main-reply');
 if (!textarea) return;
 const formSubmit = document.querySelector('.formsubmit');
 if (!formSubmit) return;

 formSubmit
  .querySelectorAll(
   '.posts-char-count-reply-wrapper, .posts-char-count-reply',
  )
  .forEach((el) => el.remove());

 const wrapper = document.createElement('div');
 wrapper.className = 'posts-char-count-reply-wrapper';
 const inner = document.createElement('div');
 inner.className = 'posts-char-count-reply';
 inner.innerHTML = 'Символов напечатано: <span>0</span>';
 wrapper.appendChild(inner);
 formSubmit.insertBefore(wrapper, formSubmit.firstChild);
 function updateCount() {
  inner.innerHTML =
   'Символов напечатано: <span>' + textarea.value.length + '</span>';
 }
 textarea.addEventListener('input', updateCount);
 updateCount();
}

function insertBBCode(start, end) {
 const el = document.getElementById('main-reply');
 if (!el) return;
 const val = el.value;
 const startPos = el.selectionStart;
 const endPos = el.selectionEnd;
 const before = val.substring(0, startPos);
 const sel = val.substring(startPos, endPos);
 const after = val.substring(endPos);
 el.value = before + start + sel + end + after;
 el.setSelectionRange(
  startPos + start.length,
  startPos + start.length + sel.length,
 );
 el.focus();
}

$(function () {
 $('#togglePreview, .hotkeys_help').remove();

 const $optionsBtn = $(
  '<button type="button" class="button options-menu-trigger"><i class="fa-solid fa-gear"></i></button>',
 );

 const $optionsPopup = $(
  '<div class="options-menu-popup">' +
  '<button class="button common-menu-item hotkeys-btn"><i class="fa-solid fa-question"></i>&nbsp;Горячие клавиши</button>' +
  '<label class="common-menu-item preview-label"><input type="checkbox" class="preview-checkbox"> <span class="preview-label-text"></span></label>' +
  '<label class="common-menu-item counters-label"><input type="checkbox" class="counters-checkbox"> <span class="counters-label-text"></span></label>' +
  '</div>',
 );

 setTimeout(() => {
  $('#form-buttons table tbody tr').append(
   $('<td id="button-options" title="Опции">').append($optionsBtn),
  );
 }, 100);

 $('body').append($optionsPopup);
 $optionsPopup.hide();

 function repositionPopup() {
  const offset = $optionsBtn.offset();
  $optionsPopup.css({
   position: 'absolute',
   left: offset.left + 'px',
   top: offset.top + $optionsBtn.outerHeight() + 4 + 'px',
  });
 }

 function updatePreviewControls() {
  const disabled = isPreviewDisabled();
  const checkbox = $optionsPopup.find('.preview-checkbox');
  const labelText = $optionsPopup.find('.preview-label-text');
  checkbox.prop('checked', disabled);
  if (disabled) {
   labelText.text('Включить быстрый предпросмотр');
   $('#post-preview').hide();
   window.ParseContent = function () { };
  } else {
   labelText.text('Отключить быстрый предпросмотр');
   $('#post-preview').show();
   window.ParseContent = originalParseContent;
   originalParseContent();
  }
  repositionPopup();
 }

 function updateCountersControls() {
  const disabled = isCountersDisabled();
  const checkbox = $optionsPopup.find('.counters-checkbox');
  const labelText = $optionsPopup.find('.counters-label-text');
  checkbox.prop('checked', disabled);
  if (disabled) {
   labelText.text('Включить счетчики');
  } else {
   labelText.text('Отключить счетчики');
  }
 }

 updatePreviewControls();
 updateCountersControls();

 $optionsPopup.on('click', '.hotkeys-btn', function (e) {
  showHotkeys();
  $optionsPopup.hide();
  e.stopPropagation();
 });

 $optionsPopup.on('change', '.preview-checkbox', function () {
  togglePreviewState(this.checked);
  updatePreviewControls();
 });

 $optionsPopup.on('change', '.counters-checkbox', function () {
  const disabled = $(this).is(':checked');
  setCountersDisabled(disabled);
  removeAllCounters();
  if (!disabled && forumId && allowedForumIds.includes(forumId)) {
   applyCharCounter();
   addReplyCharCounter();
  }
  updateCountersControls();
 });

 $optionsBtn.on('click', function (e) {
  repositionPopup();
  $optionsPopup.toggle();
  e.stopPropagation();
 });

 $(document).on('mousedown', function (e) {
  if (
   !$(e.target).closest(
    '.options-menu-popup, .options-menu-trigger, #hotkeys_wrap',
   ).length
  ) {
   $optionsPopup.hide();
   hideHotkeys();
  }
 });

 $(document).on('keydown', function (e) {
  if (e.key === 'Escape') {
   $optionsPopup.hide();
   hideHotkeys();
  }
 });

 $('#main-reply').on('keydown', function (event) {
  const combos = [
   [66, true, false, false, () => insertBBCode('[b]', '[/b]')],
   [73, true, false, false, () => insertBBCode('[i]', '[/i]')],
   [83, true, false, false, () => insertBBCode('[s]', '[/s]')],
   [85, true, false, false, () => insertBBCode('[u]', '[/u]')],
   [76, true, false, false, () => insertBBCode('[align=left]', '[/align]')],
   [82, true, false, false, () => insertBBCode('[align=right]', '[/align]')],
   [
    69,
    true,
    false,
    false,
    () => insertBBCode('[align=center]', '[/align]'),
   ],
   [75, true, false, false, () => insertBBCode('[url=https://]', '[/url]')],
   [
    71,
    true,
    false,
    false,
    () => insertBBCode('[spoiler="Свернутый текст"]', '[/spoiler]'),
   ],
   [72, true, false, false, () => insertBBCode('[hide=999999]', '[/hide]')],
   [86, false, true, false, () => insertBBCode('[video]', '[/video]')],
   [81, true, false, false, () => insertBBCode('[quote]', '[/quote]')],
   [219, true, false, false, () => insertBBCode('[code]', '[/code]')],
   [
    67,
    false,
    true,
    false,
    () => insertBBCode('[color=maroon]', '[/color]'),
   ],
   [
    84,
    false,
    true,
    false,
    () => insertBBCode('[table][tr][td]', '[/td][/tr][/table]'),
   ],
   [68, true, false, true, () => insertBBCode('[add]', '')],
   [
    65,
    true,
    false,
    true,
    () => insertBBCode('[abbr="Пояснение"]', '[/abbr]'),
   ],
   [77, true, false, true, () => insertBBCode('[mark]', '[/mark]')],
   [72, false, true, false, () => insertBBCode('[hr]', '')],
   [
    13,
    true,
    false,
    false,
    () => {
     $('#post .submit').click();
    },
   ],
  ];
  for (const [code, ctrl, alt, shift, fn] of combos) {
   if (
    event.keyCode === code &&
    (!!event.ctrlKey || !!event.metaKey) === ctrl &&
    !!event.altKey === alt &&
    !!event.shiftKey === shift
   ) {
    fn();
    event.preventDefault();
    return false;
   }
  }
 });

 $(document).on('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 191) {
   showHotkeys();
   $optionsPopup.hide();
   e.preventDefault();
  }
 });

 $(window).on('resize scroll', function () {
  $optionsPopup.hide();
 });

 if (!$('#hotkeys_wrap').length) {
  const $hotkeysWrap = $(
   '<div id="hotkeys_wrap" class="hotkeys-wrap"><div id="hotkeys" class="hotkeys-content"></div></div>',
  );
  $('body').append($hotkeysWrap);
 }

 function showHotkeys() {
  $('#hotkeys_wrap').slideDown('fast');
 }

 function hideHotkeys() {
  $('#hotkeys_wrap').slideUp('fast');
 }

 function buildHotkeysHelp() {
  $('#hotkeys').html(
   '<span id="hotkeys_close">×</span>' +
   '<h3>Горячие клавиши</h3>' +
   '<ul>' +
   '<li><b>Ctrl+B</b> — жирный</li>' +
   '<li><b>Ctrl+I</b> — курсив</li>' +
   '<li><b>Ctrl+U</b> — подчёркнутый</li>' +
   '<li><b>Ctrl+S</b> — зачёркнутый</li>' +
   '<li><b>Ctrl+L</b> — выравнить влево</li>' +
   '<li><b>Ctrl+R</b> — выравнить вправо</li>' +
   '<li><b>Ctrl+E</b> — выравнить по центру</li>' +
   '<li><b>Ctrl+K</b> — ссылка</li>' +
   '<li><b>Ctrl+G</b> — спойлер</li>' +
   '<li><b>Ctrl+H</b> — скрытый текст</li>' +
   '<li><b>Alt+V</b> — видео</li>' +
   '<li><b>Ctrl+Q</b> — цитата</li>' +
   '<li><b>Ctrl+[</b> — код</li>' +
   '<li><b>Alt+C</b> — цвет</li>' +
   '<li><b>Alt+T</b> — таблица</li>' +
   '<li><b>Ctrl+Shift+D</b> — добавлено спустя</li>' +
   '<li><b>Ctrl+Shift+A</b> — поясняющий текст</li>' +
   '<li><b>Ctrl+Shift+M</b> — маркированный текст</li>' +
   '<li><b>Alt+H</b> — горизонтальная линия</li>' +
   '<li><b>Ctrl+Enter</b> — отправка</li>' +
   '</ul>',
  );

  // Добавляем обработчик клика на крестик
  $('#hotkeys_close').on('click', function () {
   $('#hotkeys_wrap').slideUp('fast');
  });
 }

 buildHotkeysHelp();

 let forumId = null;
 if (typeof FORUM !== 'undefined' && typeof FORUM.get === 'function') {
  forumId = parseInt(FORUM.get('topic.forum_id'), 10);
 }

 if (isPreviewDisabled()) {
  $('#post-preview').hide();
  window.ParseContent = function () { };
 } else {
  originalParseContent = window.ParseContent || function () { };
 }

 if (forumId && allowedForumIds.includes(forumId) && !isCountersDisabled()) {
  applyCharCounter();
  addReplyCharCounter();
 }
});

