// customScripts.js

// ------------------------------
// Смена стиля и переключение темы
// ------------------------------
$(function () {
  var array = [
    { class: 'classic', title: 'класика' },
    { class: 'second', title: 'второй' },
  ];
  var switchers = '';
  $.each(array, function (index, value) {
    switchers +=
      '<li title="' +
      value.title +
      '"><span class="radio"><input type="radio" name="switcher" id="' +
      value.class +
      '" value="' +
      value.class +
      '"><label for="' +
      value.class +
      '">' +
      value.title +
      '</label></span></li>';
  });
  $('#theme_switcher').append(switchers);
  $('#theme_switcher input').on('click', function () {
    var selectedTheme = $(this).val();
    $('html').removeClass().addClass(selectedTheme);
    restructureStats();
    localStorage.setItem('selectedTheme', selectedTheme);
  });
  if (localStorage.getItem('selectedTheme') !== null) {
    var currentTheme = localStorage.getItem('selectedTheme');
    $('html').addClass(currentTheme);
    $('#theme_switcher input[value="' + currentTheme + '"]').prop(
      'checked',
      true,
    );
  } else {
    $('html').addClass('butterfly');
    $('#theme_switcher input[value="butterfly"]').prop('checked', true);
  }
  restructureStats();
});

// Функция для группировки статистики с новым порядком элементов
function groupStatsForButterfly() {
  $('.butterfly .statscon ul.container').each(function () {
    const container = $(this);

    // Сначала группируем элементы .item5 (rightstats) и вставляем их первыми (меняем местами)
    container
      .find('li.item5.onlinelist, li.item5.users_24h')
      .wrapAll('<div class="rightstats"></div>');

    container.prepend(container.find('.rightstats'));

    // Группируем элементы leftstats
    container
      .find('li.item1, li.item2, li.item3, li.item4')
      .wrapAll('<div class="leftstats"></div>');

    // Перемещаем .item4 наверх внутри .leftstats
    container.find('.leftstats').prepend(container.find('.leftstats .item4'));
  });
}

// Очистка оберток
function ungroupStats() {
  $('.leftstats, .rightstats').children().unwrap();
}

// Перестройка структуры
function restructureStats() {
  ungroupStats();
  if ($('html').hasClass('butterfly')) {
    groupStatsForButterfly();
  }
}

// Обработчик события pun_stats
$(document).on('pun_stats', function () {
  restructureStats();
});

// ------------------------------
// Аватар по умолчанию
// ------------------------------
$(function () {
  var DefAvtr = 'https://forumstatic.ru/files/001c/73/bf/79523.png'; // Ссылка на аватар по умолчанию
  var GuestAvtr = 'https://forumstatic.ru/files/001c/73/bf/79523.png'; // Ссылка для гостя

  $('#pun-viewtopic,#pun-messages')
    .find('.pa-title')
    .each(function () {
      var avatar = DefAvtr;
      if ($(this).text() === 'Гость') {
        avatar = GuestAvtr;
      }
      var s =
        '<li class="pa-avatar item2"><img class="defavtr" src="' +
        avatar +
        '" alt="Аватар"/></li>';
      if ($(this).parent().find('.pa-avatar').length === 0) $(this).after(s);
    });
  $('#profile-left strong:contains("Нет аватара")')
    .parent()
    .html('<div><img src="' + DefAvtr + '"/></div>');
});

// ------------------------------
// Переадресация после пиар-входа
// ------------------------------
(function () {
  if (GroupID == 3) {
    var url = '';
    $.get('/export.php?type=rss&fid=13', '', processXML);
    function processXML(data) {
      $(data)
        .find('item:first:contains("Реклама")')
        .each(function () {
          url = $(this).find('link').text();
        });
    }
    // Переадресация после логина
    $('#PRlogin').on('submit', function () {
      $(this).find('input[name="redirect_url"]').val(url);
    });
  }
})();

// ------------------------------
// Исключение из "Цитировать"
// ------------------------------
(function () {
  var p = [];
  $('.post')
    .find('.pl-quote')
    .click(function () {
      p[0] = $(this).parents('.post').find('.lastedit');
      p[1] = $(this).parents('.post').find('.post-sig');
      p[2] = p[0].html();
      p[3] = p[1].html();
      p[0].html('');
      p[1].html('');
      setTimeout(function () {
        p[0].html(p[2]);
        p[1].html(p[3]);
      }, 600);
    });
})();

// ------------------------------
// Кликабельность ника в постах гостя
// ------------------------------
$(function () {
  $('.post[data-group-id=3]')
    .find('.pa-author')
    .html(function () {
      return this.innerHTML.replace(
        /(<.+>)(.+)$/,
        '$1<a href="javascript:to(\'$2\')">$2</a>',
      );
    });
});

// ------------------------------
// Разделение тем на "Важные темы" и "Темы форума"
// ------------------------------
$(function () {
  if ($('#pun-viewforum').length) {
    $('tr[class$="isticky"]:first').before(
      '<tr class="tr-divider imp"><td class="td-divider" colspan="4">Важные темы</td></tr>',
    );
    $('tr[class$="isticky"]:last')
      .next('tr')
      .before(
        '<tr class="tr-divider st"><td class="td-divider" colspan="4">Темы форума</td></tr>',
      );
    $('.stickytext').remove();
  }
});

// ------------------------------
// Рестор ссылки "НОВЫЕ СООБЩЕНИЯ"
// ------------------------------
$(function () {
  if (GroupID != 3) {
    $('#pun-ulinks .container').prepend(
      '<li class="item1"><a href="/search.php?action=show_new">Новые сообщения</a></li>',
    );
  }
});

// ------------------------------
// Ссылка на авторский пост в цитате
// ------------------------------
$(function () {
  $('.quote-box>cite:contains("#")').each(function () {
    var cntq = $(this).text(),
      pid = cntq.split(',')[0],
      lnkq = '<a class="qc-post-link" href="';
    if ($('.post' + pid).length) {
      $(this).html(lnkq + pid + '">' + cntq.match(/([^,]*),(.*)/)[2] + '</a>');
    } else {
      $(this).html(
        lnkq +
          '/viewtopic.php?pid=' +
          pid.split('#p')[1] +
          pid +
          '">' +
          cntq.match(/([^,]*),(.*)/)[2] +
          '</a>',
      );
    }
  });
  $('#pun-viewtopic .pl-quote>a').each(function () {
    $(this).attr(
      'href',
      $(this)
        .attr('href')
        .replace("('", "('#" + $(this).parents('.post').attr('id') + ','),
    );
  });
});

// -----------------------------
// Перенос верхнего меню навигации и <br> в статистику
// -----------------------------
$(function () {
  $('#pun-navlinks').insertBefore('#pun-title');
  $('<br>').insertAfter('#pun-stats ul li:not(#onlinelist) span');
  $('<br>').insertBefore('#pun-stats li#onlinelist.item5 span');
});

// -----------------------------
// Универсальная замена текста © Alex_63
// -----------------------------
$(function () {
  function Change(selector, find, replaceWith) {
    $(selector)
      .parent()
      .each(function () {
        $(this).html($(this).html().replace(find, replaceWith));
      });
  }

  Change('#navadmin', 'Администрирование', 'Амс');
  Change('li.item1 span', 'Всего тем: ', 'Тем: ');
  Change('li.item2 span', 'Всего сообщений: ', 'Сообщений: ');
  Change('li.item3 span', 'Зарегистрированных пользователей: ', 'Жителей: ');
  Change('li.item4 span', 'Последним зарегистрировался: ', 'Приветствуем: ');
});

// -----------------------------
// Кнопки прокрутки © Feathertail
// -----------------------------
(() => {
  const topRail = document.querySelector('.rail-up');
  const bottomRail = document.querySelector('.rail-down');
  const html = document.documentElement;

  const scrollToPos = (pos) =>
    window.scrollTo({ top: pos, behavior: 'smooth' });

  topRail.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToPos(0);
  });
  bottomRail.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToPos(html.scrollHeight);
  });

  const toggleVisibility = () => {
    const y = window.scrollY;
    const max = html.scrollHeight - innerHeight;

    topRail.classList.toggle('hidden', y <= 80);
    bottomRail.classList.toggle('hidden', y >= max - 80);
  };

  toggleVisibility();
  addEventListener('scroll', toggleVisibility, { passive: true });
  addEventListener('resize', toggleVisibility);
})();

// ------------------------------
// Запятая, после обращения
// ------------------------------
function to(username) {
  insert('[b]' + username + '[/b]' + ', ');
}
