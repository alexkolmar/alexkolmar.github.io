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
                    "before": "https://images2.imgbox.com/b4/08/XuJR05VP_o.jpg",
                    "after": "https://images2.imgbox.com/be/7d/XrzJVDhb_o.png"
                }
            },
            {
                "name": "Эш Риверс",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/d0/b0/JHuq6RcH_o.jpg",
                    "after": "https://images2.imgbox.com/50/fd/WiAsN84e_o.png"
                }
            },
            {
                "name": "Беккет",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/1b/de/3TAah891_o.jpg",
                    "after": "https://images2.imgbox.com/10/fe/Y6sOPPFe_o.png"
                }
            },
            {
                "name": "Таксист",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/85/44/2KUM5NM9_o.jpg",
                    "after": "https://images2.imgbox.com/a1/85/YfB6tVbh_o.png"
                }
            },
            {
                "name": "Дамзел",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/e1/e5/Sf3LbYRD_o.jpg",
                    "after": "https://images2.imgbox.com/fd/70/l9iEITdX_o.png"
                }
            },
            {
                "name": "Гэри Голден",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/17/05/8FGAbYgS_o.jpg",
                    "after": "https://images2.imgbox.com/fe/04/EogqsWy9_o.png"
                }
            },
            {
                "name": "Грюнфилд Бах",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/ef/c8/EdHvajdB_o.jpg",
                    "after": "https://images2.imgbox.com/ae/1a/LhcHa8cs_o.png"
                }
            },
            {
                "name": "Хезер По",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/82/d2/nSvOyQp8_o.jpg",
                    "after": "https://images2.imgbox.com/1f/4f/E87l2mDq_o.png"
                }
            },
            {
                "name": "Ималия",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/48/9d/5EB4QECl_o.jpg",
                    "after": "https://images2.imgbox.com/b7/31/DvfNP85O_o.png"
                }
            },
            {
                "name": "Айзек Абрамс",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/28/ee/u6bWbqXI_o.jpg",
                    "after": "https://images2.imgbox.com/a8/c6/pFv7Khe7_o.png"
                }
            },
            {
                "name": "Джезебел Лок",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/e9/0e/g8rTWf9R_o.jpg",
                    "after": "https://images2.imgbox.com/05/58/zsdyoVZN_o.png"
                }
            },
            {
                "name": "Жанетт Воэрман",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/df/cf/4zaxA7cY_o.jpg",
                    "after": "https://images2.imgbox.com/de/0a/15HbHb61_o.png"
                }
            },
            {
                "name": "Себастьян Лакруа",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/2f/9d/qGQZVNXA_o.jpg",
                    "after": "https://images2.imgbox.com/d5/c9/ZE3xsPsU_o.png"
                }
            },
            {
                "name": "Максимилиан Штраус",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/dc/f3/WMwGs4Uc_o.jpg",
                    "after": "https://images2.imgbox.com/28/1f/GuSQe0EL_o.png"
                }
            },
            {
                "name": "Меркурио",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/74/3e/NuSyj5jz_o.jpg",
                    "after": "https://images2.imgbox.com/a0/97/iPOb2DTo_o.png"
                }
            },
            {
                "name": "Минг Жао",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/8c/b5/nwrzlOWy_o.jpg",
                    "after": "https://images2.imgbox.com/36/5a/URfld2br_o.png"
                }
            },
            {
                "name": "Митник",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/8c/2a/uti4wX3z_o.jpg",
                    "after": "https://images2.imgbox.com/c9/fe/5dsDJy2N_o.png"
                }
            },
            {
                "name": "Найнс Родригез",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/30/ef/jPeOyNYd_o.jpg",
                    "after": "https://images2.imgbox.com/d9/b8/FfclHNzF_o.png"
                }
            },
            {
                "name": "Скелтер",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/5e/f8/esIqPSSQ_o.jpg",
                    "after": "https://images2.imgbox.com/03/5c/wAEJKXvB_o.png"
                }
            },
            {
                "name": "Смеющийся Джек",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/1e/a5/e6b8Vsdv_o.jpg",
                    "after": "https://images2.imgbox.com/41/8f/U5lwMBS3_o.png"
                }
            },
            {
                "name": "Виви",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/89/af/LYwjRDyA_o.jpg",
                    "after": "https://images2.imgbox.com/45/22/ccTUItOw_o.png"
                }
            },
            {
                "name": "Бертрам Танг",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/37/0d/5nHxtouw_o.jpg",
                    "after": "https://images2.imgbox.com/7a/7a/6BozZKYA_o.png"
                }
            },
            {
                "name": "Е",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/a5/86/J8rfj36p_o.jpg",
                    "after": "https://images2.imgbox.com/03/1a/HzBDux9b_o.png"
                }
            },
            {
                "name": "Лили",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/04/f8/bYvx7QNl_o.jpg",
                    "after": "https://images2.imgbox.com/69/13/HdHq4smJ_o.png"
                }
            },
            {
                "name": "Офицер Чанк",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/c4/8d/J0pnz3a1_o.jpg",
                    "after": "https://images2.imgbox.com/3f/4c/rLmdLBmz_o.png"
                }
            },
            {
                "name": "Саманта",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/b4/45/uk2uPM81_o.jpg",
                    "after": "https://images2.imgbox.com/e3/be/ENfmFvzj_o.png"
                }
            },
            {
                "name": "Шериф",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/30/65/eiXHE1I7_o.jpg",
                    "after": "https://images2.imgbox.com/41/a6/jSLL7aiD_o.png"
                }
            },
            {
                "name": "Венера",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/fe/45/bx8uYXEg_o.jpg",
                    "after": "https://images2.imgbox.com/c6/ff/WmYsphrz_o.png"
                }
            },
            {
                "name": "Зигена",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/b8/58/FHJ6Sg9n_o.jpg",
                    "after": "https://images2.imgbox.com/e9/4f/hP2Neroi_o.png"
                }
            },
            {
                "name": "Барабус",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/64/7c/53E0HzK1_o.jpg",
                    "after": "https://images2.imgbox.com/48/a4/u71yvhwZ_o.png"
                }
            },
            {
                "name": "Толстый Ларри",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/e4/eb/kymI7Zsj_o.jpg",
                    "after": "https://images2.imgbox.com/a0/75/VZxuHFVx_o.png"
                }
            },
            {
                "name": "Брат Канкер",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/aa/af/02UrT5iP_o.jpg",
                    "after": "https://images2.imgbox.com/62/a0/B4GBvFMd_o.png"
                }
            },
            {
                "name": "Мандарин",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/f2/e6/wIUnumqt_o.jpg",
                    "after": "https://images2.imgbox.com/80/93/Psm9cc4r_o.png"
                }
            },
            {
                "name": "Надя Миллинер",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/aa/07/52oLpd2E_o.jpg",
                    "after": "https://images2.imgbox.com/dd/75/lE4LYuMA_o.png"
                }
            },
            {
                "name": "Пиша",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/a7/9a/2krkoAHx_o.jpg",
                    "after": "https://images2.imgbox.com/4e/d6/Ql4R6dDD_o.png"
                }
            },
            {
                "name": "Роза",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/d8/38/AVXJXDjW_o.jpg",
                    "after": "https://images2.imgbox.com/a2/a8/Z0jcLoci_o.png"
                }
            },
            {
                "name": "Епископ Вик",
                "description": "",
                "images": {
                    "before": "https://images2.imgbox.com/fc/20/dLsexUpu_o.jpg",
                    "after": "https://images2.imgbox.com/eb/4e/KDM9YMeK_o.png"
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