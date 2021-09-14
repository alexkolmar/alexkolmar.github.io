    (($) => {
        let methods = $('.methods');
        let filters = $('.filters');
        let buttons = $('.filter-button', filters);
        let items = $('.items .item');
        let filterItems = {}

        buttons.each((i, button) => { filterItems[button.id] = []; });
        
        items.each((i, item) => {
            const keys = $(item).attr('data-filters').split(' ');

            for (const key of keys) {
                filterItems[key].push(item);
            }
            
            $(item).data('filters', keys);
        });
        
        function setState() {
            let actives = buttons.map((i, item) => { return $(item).hasClass('active') ? item.id : null; }).toArray();
            let method = $('.method-button.active', methods).attr('id');
            
            filters.toggleClass('has-active', actives.length > 0);
            
            if (actives.length > 0) {
                    if (method === 'any') {
                        items.removeClass('active');
                    
                    for (const active of actives) {
                        for (const item of filterItems[active]) {
                            $(item).addClass('active');
                        }
                    }
                }
                else if (method === 'all') {
                        items.removeClass('active');
                    
                        items.each((i, item) => {
                                    const keys = $(item).data('filters');
                        
                        console.log(keys);
            
                            for (const active of actives) {
                                if (keys.indexOf(active) === -1) {
                                    return;
                            }
                            }
                        
                        $(item).addClass('active');
                    });
                }
            }
            else {
                items.addClass('active');
            }
        }
        
        buttons.on('click', function () {
            $(this).toggleClass('active');
            setState();
        });
        
        $('.method-button', methods).on('click', function () {
                $('.method-button', methods).removeClass('active');
                $(this).addClass('active');
            setState();
        }).filter('#all').addClass('active');

        setState();
    })(jQuery);