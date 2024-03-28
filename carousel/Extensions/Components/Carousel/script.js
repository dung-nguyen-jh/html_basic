const slidesTrack = document.querySelector('[data-carousel-slides]');
const slides = Array.from(slidesTrack.children);
const buttons = document.querySelectorAll('[data-carousel-button]');
const slideWidth = slides[0].offsetWidth;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const offset = button.dataset.carouselButton === 'next' ? 1 : -1;
        const activeSlide = slidesTrack.querySelector('[data-active]');
        let index = slides.indexOf(activeSlide) + offset;
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        slidesTrack.style.transform = `translateX(-${slideWidth * index}px)`;
        slidesTrack.querySelector('[data-active]').removeAttribute('data-active');
        slides[index].setAttribute('data-active', '');
    });
}
);