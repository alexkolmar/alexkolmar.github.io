const galleryImages = document.querySelectorAll('.gallery-image');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
let currentIndex = 0;

// Открытие модального окна
galleryImages.forEach((image, index) => {
    image.addEventListener('click', () => {
        currentIndex = index; // запоминаем индекс
        updateModalImage(currentIndex);
        modal.classList.add('show');
        document.body.classList.add('lock');
    });
});

// Закрытие модального окна (клик на фон)
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.remove('show');
        document.body.classList.remove('lock');
    }
});

// Закрытие по ESC и навигация стрелками
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        document.body.classList.remove('lock');
    }
    
    if (modal.classList.contains('show')) {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextImage();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            prevImage();
        }
    }
});

// Кнопка "Назад"
document.getElementById('modalPrev').addEventListener('click', (e) => {
    e.stopPropagation(); // чтобы не закрывать модалку
    prevImage();
});

// Кнопка "Вперед"
document.getElementById('modalNext').addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
});

// Кнопка закрытия
document.getElementById('modalClose').addEventListener('click', (e) => {
    e.stopPropagation();
    modal.classList.remove('show');
    document.body.classList.remove('lock');
});

// Функция обновления картинки в модалке
function updateModalImage(index) {
    const image = galleryImages[index];
    if (image) {
        modalImage.src = image.src;
        modalImage.alt = image.alt;
    }
}

// Следующая картинка
function nextImage() {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateModalImage(currentIndex);
}

// Предыдущая картинка
function prevImage() {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModalImage(currentIndex);
}