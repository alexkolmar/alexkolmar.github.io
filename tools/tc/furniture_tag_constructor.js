class FurnitureTagBuilder {
 constructor() {
  this.tags = {
   // Основные категории
   trigger: '', // Триггер как отдельное поле, не в массиве
   furnitureType: [],
   material: [],
   color: [],
   style: [],
   era: [],
   // Конструкция и детали
   construction: [],
   features: [],
   // Композиция и ракурс
   viewpoint: [],
   composition: [],
   lighting: [],
   // Фон
   background: ''
  };

  // Кастомные значения (без триггера!)
  this.customValues = {
   furnitureType: '',
   material: '',
   color: '',
   style: '',
   era: '',
   construction: '',
   features: '',
   viewpoint: '',
   composition: '',
   lighting: '',
   background: ''
  };

  console.log('Furniture TagBuilder создан');
  this.initEventListeners();
  this.updateOutput();
 }

 initEventListeners() {
  console.log('Инициализация обработчиков событий...');
  
 // Триггерное слово
  const triggerWord = document.getElementById('triggerWord');
  if (triggerWord) {
   triggerWord.addEventListener('input', (e) => {
    console.log('Триггер изменен:', e.target.value);
    this.tags.trigger = e.target.value;
    this.updateOutput();
   });
  }

  // Кнопки тегов
  document.querySelectorAll('.tag-btn').forEach(btn => {
   btn.addEventListener('click', (e) => {
    const category = e.target.dataset.category;
    const value = e.target.textContent;
    console.log('Клик по тегу:', category, value);

    if (Array.isArray(this.tags[category])) {
     const index = this.tags[category].indexOf(value);
     if (index > -1) {
      this.tags[category].splice(index, 1);
      e.target.classList.remove('active');
     } else {
      this.tags[category].push(value);
      e.target.classList.add('active');
     }
    }
    this.updateOutput();
   });
  });

  // КАСТОМНЫЕ ПОЛЯ (без триггера!)
  this.setupCustomField('customFurniture', 'furnitureType');
  this.setupCustomField('customMaterial', 'material');
  this.setupCustomField('customColor', 'color');
  this.setupCustomField('customStyle', 'style');
  this.setupCustomField('customEra', 'era');
  this.setupCustomField('customConstruction', 'construction');
  this.setupCustomField('customFeatures', 'features');
  this.setupCustomField('customViewpoint', 'viewpoint');
  this.setupCustomField('customComposition', 'composition');
  this.setupCustomField('customLighting', 'lighting');
  this.setupCustomField('customBackground', 'background');

  // Кнопки управления
  this.setupControlButtons();
 }

 setupCustomField(fieldId, category) {
  const field = document.getElementById(fieldId);
  if (field) {
   field.addEventListener('input', (e) => {
    const value = e.target.value;
    this.customValues[category] = value;
    this.updateOutput();
   });
  }
 }

 setupControlButtons() {
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
   copyBtn.addEventListener('click', copyToClipboard);
  }

  const clearBtn = document.querySelector('.clear-btn');
  if (clearBtn) {
   clearBtn.addEventListener('click', clearAll);
  }
 }

 // Метод для получения объединенных тегов (выбранные + кастомные)
 getCombinedTags(category) {
  // Для не-массивных полей (background) возвращаем просто кастомное значение
  if (category === 'background') {
   return this.customValues[category] || '';
  }
  
  const selectedTags = [...this.tags[category]];
  const customValue = this.customValues[category];

  if (customValue && customValue.trim() !== '') {
   selectedTags.push(customValue.trim());
  }

  return selectedTags;
 }

 updateOutput() {
  const finalTags = [];

  // 0. ТРИГГЕР (отдельно, первый)
  if (this.tags.trigger && this.tags.trigger.trim() !== '') {
   finalTags.push(this.tags.trigger.trim());
  }

  // 1. ТИП МЕБЕЛИ
  const combinedFurniture = this.getCombinedTags('furnitureType');
  if (combinedFurniture.length > 0) {
   finalTags.push(combinedFurniture.join(', '));
  }

  // 2. МАТЕРИАЛЫ
  const combinedMaterial = this.getCombinedTags('material');
  if (combinedMaterial.length > 0) {
   finalTags.push(combinedMaterial.join(', '));
  }

  // 3. ЦВЕТ
  const combinedColor = this.getCombinedTags('color');
  if (combinedColor.length > 0) {
   finalTags.push(combinedColor.join(' '));
  }

  // 4. СТИЛЬ
  const combinedStyle = this.getCombinedTags('style');
  if (combinedStyle.length > 0) {
   finalTags.push(combinedStyle.join(', '));
  }

  // 5. ЭПОХА
  const combinedEra = this.getCombinedTags('era');
  if (combinedEra.length > 0) {
   finalTags.push(combinedEra.join(', '));
  }

  // 6. КОНСТРУКЦИЯ
  const combinedConstruction = this.getCombinedTags('construction');
  if (combinedConstruction.length > 0) {
   finalTags.push(combinedConstruction.join(', '));
  }

  // 7. ОСОБЕННОСТИ
  const combinedFeatures = this.getCombinedTags('features');
  if (combinedFeatures.length > 0) {
   finalTags.push(combinedFeatures.join(', '));
  }

  // 8. РАКУРС
  const combinedViewpoint = this.getCombinedTags('viewpoint');
  if (combinedViewpoint.length > 0) {
   finalTags.push(combinedViewpoint.join(', '));
  }

  // 9. КОМПОЗИЦИЯ
  const combinedComposition = this.getCombinedTags('composition');
  if (combinedComposition.length > 0) {
   finalTags.push(combinedComposition.join(', '));
  }

  // 10. ОСВЕЩЕНИЕ
  const combinedLighting = this.getCombinedTags('lighting');
  if (combinedLighting.length > 0) {
   finalTags.push(combinedLighting.join(', '));
  }

  // 11. ФОН
  const backgroundValue = this.customValues.background;
  if (backgroundValue && backgroundValue.trim() !== '') {
   finalTags.push(backgroundValue.trim() + ' background');
  }

  const output = finalTags.join(', ');
  console.log('Финальные теги:', output);

  const outputElement = document.getElementById('finalTags');
  if (outputElement) {
   outputElement.textContent = output;
  }
 }

 reset() {
  console.log('Сброс всех полей');
  this.tags = {
   trigger: '',
   furnitureType: [],
   material: [],
   color: [],
   style: [],
   era: [],
   construction: [],
   features: [],
   viewpoint: [],
   composition: [],
   lighting: [],
   background: ''
  };

  this.customValues = {
   furnitureType: '',
   material: '',
   color: '',
   style: '',
   era: '',
   construction: '',
   features: '',
   viewpoint: '',
   composition: '',
   lighting: '',
   background: ''
  };

  // Сброс UI
  document.querySelectorAll('input[type="text"]').forEach(input => {
   input.value = '';
  });

  document.querySelectorAll('.tag-btn').forEach(btn => {
   btn.classList.remove('active');
  });

  this.updateOutput();
 }
}

// Копирование в буфер обмена
function copyToClipboard() {
 const text = document.getElementById('finalTags').textContent;
 navigator.clipboard.writeText(text).then(() => {
  const btn = document.querySelector('.copy-btn');
  const originalText = btn.textContent;
  btn.textContent = '✅ Скопировано!';
  setTimeout(() => {
   btn.textContent = originalText;
  }, 2000);
 });
}

// Очистка всех полей
function clearAll() {
 if (window.furnitureTagBuilder) {
  window.furnitureTagBuilder.reset();
 }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
 console.log('DOM загружен, инициализация Furniture TagBuilder...');
 window.furnitureTagBuilder = new FurnitureTagBuilder();
});