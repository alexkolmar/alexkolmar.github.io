$(document).ready(function () {
    
    // ===== Функция сохранения состояния =====
    function saveActiveTab(containerId, tabId) {
        localStorage.setItem('activeTab_' + containerId, tabId);
    }
    
    // ===== Функция загрузки состояния =====
    function loadActiveTab(containerId) {
        return localStorage.getItem('activeTab_' + containerId);
    }
    
    // ===== Обработка клика по вкладкам =====
    $('.tab-label').on('click', function () {
        var parentContainer = $(this).closest('.tabs-container');
        var nav = $(this).closest('.tabs-nav');
        var content = parentContainer.find('.tabs-content');
        var targetTab = $(this).data('tab');
        
        // Получаем уникальный ID контейнера (или используем индекс)
        var containerId = parentContainer.attr('id') || 'tabs-' + parentContainer.index();
        
        // Переключаем вкладки
        nav.find('.tab-label').removeClass('active');
        $(this).addClass('active');
        
        content.find('.tab-pane').removeClass('active');
        content.find('#' + targetTab).addClass('active');
        
        // 🔥 СОХРАНЯЕМ в localStorage
        saveActiveTab(containerId, targetTab);
    });
    
    // ===== ВОССТАНАВЛИВАЕМ состояние при загрузке =====
    $('.tabs-container').each(function() {
        var container = $(this);
        var containerId = container.attr('id') || 'tabs-' + container.index();
        var savedTab = loadActiveTab(containerId);
        
        if (savedTab) {
            // Ищем лейбл с таким data-tab
            var targetLabel = container.find('.tab-label[data-tab="' + savedTab + '"]');
            var targetPane = container.find('#' + savedTab);
            
            if (targetLabel.length && targetPane.length) {
                // Активируем сохранённую вкладку
                container.find('.tab-label').removeClass('active');
                targetLabel.addClass('active');
                
                container.find('.tab-pane').removeClass('active');
                targetPane.addClass('active');
            }
        }
    });
    
});