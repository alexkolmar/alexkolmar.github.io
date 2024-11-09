(function() {
	
	var mobileCSS = $('head link[rel="stylesheet"][href*="/mobile."]');

	// Сменить отображение кнопки и отображение экрана 
	// в соответствии с прошлым выбором пользователя
	$(document).ready(function() {
		switch_button_display();
    });  
    switch_mobile_display();
	
	// Установить cookies
	function set_cookie(cookies_name, cookies_value, days) {
		// Если cookies не бессрочные
		if(days){
			var date_to = new Date();
			date_to.setDate(date_to.getDate() + days);
		}
		// Если передали основные параметры cookies 
		if (cookies_name && cookies_value) {
			document.cookie = cookies_name + '=' + cookies_value + ';path=/' + (days ? '; expires=' + date_to.toUTCString() : '');
		} else { return false;}
	};
	
	// Считать значение cookies
   function get_cookie(cookies_name) {
	   // Выбрать строку, которая начинается со значения cookies_name и до первой ';' 
	   var reg_expr = new RegExp( cookies_name +'=([^;]){1,}' );
	   var cookies_line = reg_expr.exec(document.cookie);
	   if(cookies_line) {
	   cookies_line = cookies_line[0].split('=');
	   } else { return false; }
	   
	   return cookies_line[1] ? cookies_line[1] : false;
   }
   
   // Функция для кнопки (глобальный указатель)
   FORUM.mobile_switch = function() {
        var mobile_display = get_cookie("mobile_display");
	mobile_display = ( mobile_display == 'on' ) ? 'off': 'on';
	set_cookie("mobile_display", mobile_display, 365);
	set_screen_view(mobile_display);
       set_button_view(mobile_display);
  };
  
  // Смена вида экрана
  function set_screen_view(display_mode){
	if ( display_mode == 'on' ) {
	 // Переключиться на мобильный режим
		$('meta[name="viewport"]').attr("content", "width=device-width, initial-scale=1.0");
		mobileCSS.attr('disabled',false);
	} else {
		$('meta[name="viewport"]').attr("content", "width="+"570");//screen.width);
		mobileCSS.attr('disabled',true);
                //window.resizeTo(screen.width, screen.height);
	}
  };

  // Смена вида кнопки
  function set_button_view(display_mode){
	if ( display_mode == 'on' ) {
	 // Переключиться на мобильный режим
		$('#display_switch').removeClass("style_mobile-off").addClass("style_mobile-on");
	} else {
		$('#display_switch').removeClass("style_mobile-on").addClass("style_mobile-off");
	}
  };

  // Переключить режим экрана
  function switch_mobile_display() {
	  // Получить значение параметра cookies
	  var mobile_display = get_cookie("mobile_display");
          if (mobile_display == false ) mobile_display = 'on';
          set_screen_view(mobile_display);
  };

 // Переключить режим экрана
  function  switch_button_display()  {
	  // Получить значение параметра cookies
	  var mobile_display = get_cookie("mobile_display");
          if (mobile_display == false ) mobile_display = 'on';
          set_button_view(mobile_display);
  };
  
}());