const buttons = document.querySelectorAll('[data-carousel-button]');
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const offset = button.dataset.carouselButton === 'next' ? 1 : -1;
    const slides = button.parentElement.querySelector('[data-carousel-slides]');
    const activeSlide = slides.querySelector('[data-active]');
    let index = Array.from(slides.children).indexOf(activeSlide) + offset;
    if (index >= slides.children.length) index = 0;
    if (index < 0) index = slides.children.length - 1;
    slides.querySelector('[data-active]').removeAttribute('data-active');
    slides.children[index].setAttribute('data-active', '');
  });
});
  