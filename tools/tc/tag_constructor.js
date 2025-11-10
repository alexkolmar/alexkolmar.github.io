class TagBuilder {
    constructor() {
        this.tags = {
            trigger: '',
            gender: '',
            shotType: '',
            angle: [],
            hairLength: [],
            hairStyle: [],
            hairColor: [],
            hairCut: '', // Отдельное поле для прически
            eyes: [],
            eyesState: [],
            emotion: [],
            gaze: [],
            headTurn: [],
            pose: [],
            clothing: '',
            background: '',
            lighting: []
        };

        // Отдельно храним кастомные значения
        this.customValues = {
            angle: '',
            hairColor: '',
            hairCut: '', // Добавляем прическу
            eyes: '',
            eyesState: '',
            emotion: '',
            gaze: '',
            headTurn: '',
            pose: '',
            lighting: ''
        };

        console.log('TagBuilder создан');
        this.initEventListeners();
        this.updateOutput();
    }

    initEventListeners() {
        console.log('Инициализация обработчиков...');
        
        // Проверим существование элементов
        this.checkElements();
        
        // Триггерное слово
        const triggerWord = document.getElementById('triggerWord');
        if (triggerWord) {
            triggerWord.addEventListener('input', (e) => {
                console.log('Триггер изменен:', e.target.value);
                this.tags.trigger = e.target.value;
                this.updateOutput();
            });
        }

        // Пол
        const gender = document.getElementById('gender');
        if (gender) {
            gender.addEventListener('change', (e) => {
                console.log('Пол изменен:', e.target.value);
                if (e.target.value === 'custom') {
                    document.getElementById('customGender').style.display = 'block';
                } else {
                    document.getElementById('customGender').style.display = 'none';
                    this.tags.gender = e.target.value;
                    this.updateOutput();
                }
            });
        }

        const customGender = document.getElementById('customGender');
        if (customGender) {
            customGender.addEventListener('input', (e) => {
                console.log('Кастомный пол:', e.target.value);
                this.tags.gender = e.target.value;
                this.updateOutput();
            });
        }

        // План
        const shotType = document.getElementById('shotType');
        if (shotType) {
            shotType.addEventListener('change', (e) => {
                console.log('План изменен:', e.target.value);
                if (e.target.value === 'custom') {
                    document.getElementById('customShot').style.display = 'block';
                } else {
                    document.getElementById('customShot').style.display = 'none';
                    this.tags.shotType = e.target.value;
                    this.updateOutput();
                }
            });
        }

        const customShot = document.getElementById('customShot');
        if (customShot) {
            customShot.addEventListener('input', (e) => {
                console.log('Кастомный план:', e.target.value);
                this.tags.shotType = e.target.value;
                this.updateOutput();
            });
        }

        // Кнопки тегов
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                const value = e.target.textContent;
                console.log('Кнопка тега:', category, value);

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

        // Причёска
        const haircut = document.getElementById('hairCut');
        if (haircut) {
            haircut.addEventListener('input', (e) => {
                console.log('Причёска:', e.target.value);
                this.customValues.hairCut = e.target.value; // Правильно сохраняем
                this.updateOutput();
            });
        }

        // Одежда и фон
        const clothing = document.getElementById('clothing');
        if (clothing) {
            clothing.addEventListener('input', (e) => {
                console.log('Одежда:', e.target.value);
                this.tags.clothing = e.target.value;
                this.updateOutput();
            });
        }

        const background = document.getElementById('background');
        if (background) {
            background.addEventListener('input', (e) => {
                console.log('Фон:', e.target.value);
                this.tags.background = e.target.value;
                this.updateOutput();
            });
        }

        // КАСТОМНЫЕ ПОЛЯ
        this.setupCustomField('customAngle', 'angle');
        this.setupCustomField('customHairColor', 'hairColor');
        this.setupCustomField('customEyes', 'eyes');
        this.setupCustomField('customEyesState', 'eyesState');
        this.setupCustomField('customEmotion', 'emotion');
        this.setupCustomField('customGaze', 'gaze');
        this.setupCustomField('customHeadTurn', 'headTurn');
        this.setupCustomField('customPose', 'pose');
        this.setupCustomField('customLighting', 'lighting');

        console.log('Все обработчики установлены');
    }

    setupCustomField(fieldId, category) {
        const field = document.getElementById(fieldId);
        if (field) {
            console.log('Настройка поля:', fieldId, 'категория:', category);
            field.addEventListener('input', (e) => {
                const value = e.target.value;
                console.log('Кастомное поле', fieldId, ':', value);
                
                // Сохраняем кастомное значение отдельно
                this.customValues[category] = value;
                this.updateOutput();
            });
        } else {
            console.log('Поле не найдено:', fieldId);
        }
    }

    // Метод для получения объединенных тегов (выбранные + кастомные)
    getCombinedTags(category) {
        const selectedTags = [...this.tags[category]]; // Копируем выбранные теги
        const customValue = this.customValues[category];
        
        if (customValue && customValue.trim() !== '') {
            selectedTags.push(customValue); // Добавляем кастомное значение
        }
        
        return selectedTags;
    }

    checkElements() {
        const elements = [
            'triggerWord', 'gender', 'customGender', 'shotType', 'customShot',
            'clothing', 'background', 'customAngle', 'customHairColor', 'hairCut', 
            'customEyes', 'customEyesState', 'customEmotion', 'customGaze',
            'customHeadTurn', 'customPose', 'customLighting', 'finalTags'
        ];

        elements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`Элемент ${id}:`, element ? 'найден' : 'НЕ НАЙДЕН');
        });
    }

    updateOutput() {
        console.log('Обновление вывода, текущие теги:', this.tags);
        console.log('Кастомные значения:', this.customValues);
        
        const finalTags = [];

        // Базовые теги
        if (this.tags.trigger) finalTags.push(this.tags.trigger);
        if (this.tags.gender) finalTags.push(this.tags.gender);
        if (this.tags.shotType) finalTags.push(this.tags.shotType);

        // угол съёмки - используем объединенные теги
        const combinedAngle = this.getCombinedTags('angle');
        if (combinedAngle.length > 0) {
            finalTags.push(combinedAngle.join(', '));
        }

        // ВОЛОСЫ: длина + тип + цвет + "hair"
        const hairParts = [];
        
        // Длина волос
        if (this.tags.hairLength.length > 0) {
            hairParts.push(...this.tags.hairLength);
        }
        
        // Тип волос
        if (this.tags.hairStyle.length > 0) {
            hairParts.push(...this.tags.hairStyle);
        }
        
        // Цвет волос
        const combinedHairColor = this.getCombinedTags('hairColor');
        if (combinedHairColor.length > 0) {
            hairParts.push(...combinedHairColor);
        }
        
        // Собираем тег волос
        if (hairParts.length > 0) {
            finalTags.push(hairParts.join(' ') + ' hair');
        }

        // ПРИЧЁСКА: отдельный тег
        if (this.customValues.hairCut && this.customValues.hairCut.trim() !== '') {
            finalTags.push(this.customValues.hairCut);
        }

        // Глаза - используем объединенные теги
        const combinedEyes = this.getCombinedTags('eyes');
        if (combinedEyes.length > 0) {
            finalTags.push(combinedEyes.join(' ') + ' eyes');
        }

        // Состояние глаз - используем объединенные теги
        const combinedEyesState = this.getCombinedTags('eyesState');
        if (combinedEyesState.length > 0) {
            finalTags.push(combinedEyesState.join(', '));
        }

        // Эмоции - используем объединенные теги
        const combinedEmotion = this.getCombinedTags('emotion');
        if (combinedEmotion.length > 0) {
            finalTags.push(combinedEmotion.join(', '));
        }

        // Направление взгляда - используем объединенные теги
        const combinedGaze = this.getCombinedTags('gaze');
        if (combinedGaze.length > 0) {
            finalTags.push(combinedGaze.join(', '));
        }

        // Поворот головы - используем объединенные теги
        const combinedHeadTurn = this.getCombinedTags('headTurn');
        if (combinedHeadTurn.length > 0) {
            finalTags.push(combinedHeadTurn.join(', '));
        }

        // Позы - используем объединенные теги
        const combinedPose = this.getCombinedTags('pose');
        if (combinedPose.length > 0) {
            finalTags.push(combinedPose.join(', '));
        }

        // Одежда
        if (this.tags.clothing) finalTags.push(this.tags.clothing);

        // Фон
        if (this.tags.background) finalTags.push(this.tags.background + ' background');

        // Освещение - используем объединенные теги
        const combinedLighting = this.getCombinedTags('lighting');
        if (combinedLighting.length > 0) {
            finalTags.push(combinedLighting.join(', '));
        }

        const output = finalTags.join(', ');
        console.log('Финальные теги:', output);
        
        const outputElement = document.getElementById('finalTags');
        if (outputElement) {
            outputElement.textContent = output;
        } else {
            console.log('Элемент finalTags не найден!');
        }
    }

    reset() {
        console.log('Сброс всех полей');
        this.tags = {
            trigger: 'ellenross',
            gender: 'woman',
            shotType: 'close-up portrait',
            angle: [],
            hairLength: [],
            hairStyle: [],
            hairColor: [],
            hairCut: '',
            eyes: [],
            eyesState: [],
            emotion: [],
            gaze: [],
            headTurn: [],
            pose: [],
            clothing: '',
            background: '',
            lighting: []
        };

        this.customValues = {
            angle: '',
            hairColor: '',
            hairCut: '', // Добавляем сброс прически
            eyes: '',
            eyesState: '',
            emotion: '',
            gaze: '',
            headTurn: '',
            pose: '',
            lighting: ''
        };

        // Сброс UI
        document.querySelectorAll('input[type="text"]').forEach(input => {
            input.value = '';
        });

        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });

        document.getElementById('customGender').style.display = 'none';
        document.getElementById('customShot').style.display = 'none';
        
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
    if (window.tagBuilder) {
        window.tagBuilder.reset();
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация TagBuilder...');
    window.tagBuilder = new TagBuilder();
});