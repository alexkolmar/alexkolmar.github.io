class ComparisonSlider {
    constructor(container) {
        this.container = container;
        this.afterImage = container.querySelector('.image-after');
        this.sliderLine = container.querySelector('.slider-line');
        this.sliderVisual = container.querySelector('.slider-visual');
        this.isDragging = false;

        this.init();
    }

    init() {
        const handleMove = (clientX) => {
            const rect = this.container.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = Math.round((x / rect.width) * 100) + '%';
            
            this.afterImage.style.clipPath = `polygon(0 0, ${percent} 0, ${percent} 100%, 0 100%)`;
            this.sliderLine.style.left = percent;
            this.sliderVisual.style.left = percent;
        };

        // Mouse events
        this.sliderVisual.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            handleMove(e.clientX);
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Touch events
        this.sliderVisual.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            handleMove(e.touches[0].clientX);
        });

        document.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }
}

class CharacterSlider {
    constructor() {
        this.slider = document.getElementById('slider');
        this.indicators = document.getElementById('indicators');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentSlide = 0;
        this.characters = [];

        this.init();
    }

    async init() {
        await this.loadData();
        this.createSlides();
        this.setupNavigation();
    }

    async loadData() {
        // Данные прямо в коде, чтобы избежать CORS
        this.characters = [
            {
                "name": "Элиан Ветродуй",
                "description": "",
                "images": {
                    "before": "img/01 Andrei",
                    "after": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=450&fit=crop"
                }
            },
            {
                "name": "Серафина Огненная",
                "description": "Пиромант, прошедший путь от ученицы до повелительницы пламени",
                "images": {
                    "before": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=450&fit=crop",
                    "after": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=450&fit=crop"
                }
            },
            {
                "name": "Морган Теневой",
                "description": "Убийца, чьи навыки скрытности достигли совершенства за годы тренировок",
                "images": {
                    "before": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
                    "after": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=450&fit=crop"
                }
            },
            {
                "name": "Люциан Скалолом",
                "description": "Воин, чья броня и оружие прошли множество улучшений",
                "images": {
                    "before": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=450&fit=crop",
                    "after": "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=800&h=450&fit=crop"
                }
            }
        ];
    }

    createSlides() {
        this.slider.innerHTML = '';
        this.indicators.innerHTML = '';

        this.characters.forEach((character, index) => {
            // Создаем слайд
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
                <div class="character-info">
                    <div class="character-name">${character.name}</div>
                    <div class="character-description">${character.description}</div>
                </div>
                <div class="comparison-container" id="container-${index}">
                    <img src="${character.images.before}" class="image-before" alt="Оригинал">
                    <img src="${character.images.after}" class="image-after" alt="Новый стиль">
                    <div class="slider-line"></div>
                    <div class="slider-visual">
                        <div class="slider-circle">
                            <div class="slider-arrows">
                                <span>◀</span>
                                <span>▶</span>
                            </div>
                        </div>
                    </div>
                    <div class="labels">
                        <div class="label">🎮 Оригинал</div>
                        <div class="label">✨ Новый стиль</div>
                    </div>
                    <div class="hint">Перетащите кружок для сравнения</div>
                </div>
            `;
            this.slider.appendChild(slide);

            // Создаем индикатор
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('data-slide', index);
            this.indicators.appendChild(indicator);
        });

        // Инициализируем слайдеры сравнения
        setTimeout(() => {
            this.characters.forEach((_, index) => {
                new ComparisonSlider(document.getElementById(`container-${index}`));
            });
        }, 100);
    }

    setupNavigation() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.indicators.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator')) {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        this.updateIndicators();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.characters.length;
        this.goToSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.characters.length) % this.characters.length;
        this.goToSlide(this.currentSlide);
    }

    updateIndicators() {
        const indicators = this.indicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new CharacterSlider();
});