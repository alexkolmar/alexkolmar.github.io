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
                "name": "Андрей",
                "description": "",
                "images": {
                    "before": "img/before/01_Andrei.jpg",
                    "after": "img/after/01_Andrei.png"
                }
            },
            {
                "name": "Эш Риверс",
                "description": "",
                "images": {
                    "before": "img/before/02_Ash.jpg",
                    "after": "img/after/02_Ash.png"
                }
            },
            {
                "name": "Беккет",
                "description": "",
                "images": {
                    "before": "img/before/03_Beckett.jpg",
                    "after": "img/after/03_Beckett.png"
                }
            },
            {
                "name": "Таксист",
                "description": "",
                "images": {
                    "before": "img/before/04_Cab_Driver.jpg",
                    "after": "img/after/04_Cab_Driver.png"
                }
            },
            {
                "name": "Дамзел",
                "description": "",
                "images": {
                    "before": "img/before/05_Damsel.jpg",
                    "after": "img/after/05_Damsel.png"
                }
            },
            {
                "name": "Гэри Голден",
                "description": "",
                "images": {
                    "before": "img/before/06_Gary.jpg",
                    "after": "img/after/"
                }
            },
            {
                "name": "Грюнфилд Бах",
                "description": "",
                "images": {
                    "before": "img/before/07_Bach.jpg",
                    "after": "img/after/07_Bach.png"
                }
            },
            {
                "name": "Хезер По",
                "description": "",
                "images": {
                    "before": "img/before/08_Heather.jpg",
                    "after": "img/after/08_Heather.png"
                }
            },
            {
                "name": "Ималия",
                "description": "",
                "images": {
                    "before": "img/before/09_Imalia.jpg",
                    "after": "img/after/09_Imalia.png"
                }
            },
            {
                "name": "Айзек Абрамс",
                "description": "",
                "images": {
                    "before": "img/before/10_Isaac_Abrams.jpg",
                    "after": "img/after/10_Isaac_Abrams.png"
                }
            },
            {
                "name": "Джезебел Лок",
                "description": "",
                "images": {
                    "before": "img/before/11_Jezebel_Locke.jpg",
                    "after": "img/after/11_Jezebel_Locke.png"
                }
            },
            {
                "name": "Жанетт Воэрман",
                "description": "",
                "images": {
                    "before": "img/before/12_Jeanette.jpg",
                    "after": "img/after/12_Jeanette.png"
                }
            },
            {
                "name": "Себастьян Лакруа",
                "description": "",
                "images": {
                    "before": "img/before/13_Lacroix.jpg",
                    "after": "img/after/13_Lacroix.png"
                }
            },
            {
                "name": "Максимилиан Штраус",
                "description": "",
                "images": {
                    "before": "img/before/14_Strauss.jpg",
                    "after": "img/after/14_Strauss.png"
                }
            },
            {
                "name": "Меркурио",
                "description": "",
                "images": {
                    "before": "img/before/15_Mercurio.jpg",
                    "after": "img/after/15_Mercurio.png"
                }
            },
            {
                "name": "Минг Жао",
                "description": "",
                "images": {
                    "before": "img/before/16_Ming_Xiao.jpg",
                    "after": "img/after/16_Ming_Xiao.png"
                }
            },
            {
                "name": "Митник",
                "description": "",
                "images": {
                    "before": "img/before/17_Mitnick.jpg",
                    "after": "img/after/17_Mitnick.png"
                }
            },
            {
                "name": "Найнс Родригез",
                "description": "",
                "images": {
                    "before": "img/before/18_Nines.jpg",
                    "after": "img/after/18_Nines.png"
                }
            },
            {
                "name": "Скелтер",
                "description": "",
                "images": {
                    "before": "img/before/19_Skelter.jpg",
                    "after": "img/after/19_Skelter.png"
                }
            },
            {
                "name": "Смеющийся Джек",
                "description": "",
                "images": {
                    "before": "img/before/20_Smiling_Jack.jpg",
                    "after": "img/after/20_Smiling_Jack.png"
                }
            },
            {
                "name": "Виви",
                "description": "",
                "images": {
                    "before": "img/before/21_VV.jpg",
                    "after": "img/after/21_VV.png"
                }
            },
            {
                "name": "Бертрам Танг",
                "description": "",
                "images": {
                    "before": "img/before/22_Bertram_Tung.jpg",
                    "after": "img/after/22_Bertram_Tung.png"
                }
            },
            {
                "name": "Е",
                "description": "",
                "images": {
                    "before": "img/before/23_E.jpg",
                    "after": "img/after/23_E.png"
                }
            },
            {
                "name": "Лили",
                "description": "",
                "images": {
                    "before": "img/before/24_Lily.jpg",
                    "after": "img/after/24_Lily.png"
                }
            },
            {
                "name": "Офицер Чанк",
                "description": "",
                "images": {
                    "before": "img/before/25_Chunk.jpg",
                    "after": "img/after/25_Chunk.png"
                }
            },
            {
                "name": "Саманта",
                "description": "",
                "images": {
                    "before": "img/before/26_Samantha.jpg",
                    "after": "img/after/26_Samantha.png"
                }
            },
            {
                "name": "Шериф",
                "description": "",
                "images": {
                    "before": "img/before/27_Sheriff.jpg",
                    "after": "img/after/27_Sheriff.png"
                }
            },
            {
                "name": "Венера",
                "description": "",
                "images": {
                    "before": "img/before/28_Venus.jpg",
                    "after": "img/after/28_Venus.png"
                }
            },
            {
                "name": "Зигена",
                "description": "",
                "images": {
                    "before": "img/before/29_Zygaena.jpg",
                    "after": "img/after/29_Zygaena.png"
                }
            },
            {
                "name": "Барабус",
                "description": "",
                "images": {
                    "before": "img/before/30_Barabus.jpg",
                    "after": "img/after/30_Barabus.png"
                }
            },
            {
                "name": "Толстый Ларри",
                "description": "",
                "images": {
                    "before": "img/before/31_Fat_Larry.jpg",
                    "after": "img/after/31_Fat_Larry.png"
                }
            },
            {
                "name": "Брат Канкер",
                "description": "",
                "images": {
                    "before": "img/before/32_Kanker.jpg",
                    "after": "img/after/32_Kanker.png"
                }
            },
            {
                "name": "Мандарин",
                "description": "",
                "images": {
                    "before": "img/before/33_Mandarin.jpg",
                    "after": "img/after/33_Mandarin.png"
                }
            },
            {
                "name": "Надя Миллинер",
                "description": "",
                "images": {
                    "before": "img/before/34_Nadia_Milliner.jpg",
                    "after": "img/after/34_Nadia_Milliner.png"
                }
            },
            {
                "name": "Пиша",
                "description": "",
                "images": {
                    "before": "img/before/35_Pisha.jpg",
                    "after": "img/after/35_Pisha.png"
                }
            },
            {
                "name": "Роза",
                "description": "",
                "images": {
                    "before": "img/before/36_Rosa.jpg",
                    "after": "img/after/36_Rosa.png"
                }
            },
            {
                "name": "Епископ Вик",
                "description": "",
                "images": {
                    "before": "img/before/37_Vick.jpg",
                    "after": "img/after/37_Vick.png"
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
                    <div class="label">✨ Новый стиль</div>
                        <div class="label">🎮 Оригинал</div>
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