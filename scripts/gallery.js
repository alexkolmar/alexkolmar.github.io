const galleryImages = document.querySelectorAll('.gallery-image');
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');

// Открытие модального окна
galleryImages.forEach((image) => {
    image.addEventListener('click', () => {
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modal.classList.add('show');
        
        // 🔒 Блокируем прокрутку body
        document.body.classList.add('lock');
    });
});

// Закрытие модального окна
modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target === modalImage) {
        modal.classList.remove('show');
        
        // 🔓 Разблокируем прокрутку body
        document.body.classList.remove('lock');
    }
});

// ❗ Дополнительно: закрытие по кнопке ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        document.body.classList.remove('lock');
    }
});