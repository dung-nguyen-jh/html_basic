const slidesTrack = document.querySelector('[data-carousel-slides]');
const slides = Array.from(slidesTrack.children);
const buttons = document.querySelectorAll('[data-carousel-button]');
//get the initial slide width to calculate the amount of pixels to move
const slideWidth = slides[0].offsetWidth;

//add event listeners to each button
buttons.forEach(button => {
    button.addEventListener('click', () => {
        //get the offset value from the button, 1 is next, -1 is previous
        const offset = button.dataset.carouselButton === 'next' ? 1 : -1;
        //get the current active slide, calculate the current position and the new position
        const activeSlide = slidesTrack.querySelector('[data-active]');
        let index = slides.indexOf(activeSlide) + offset;
        //if the index is out of bounds, reset it
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        //move the slides track to the new position and update the active slide
        slidesTrack.style.transform = `translateX(-${slideWidth * index}px)`;
        slidesTrack.querySelector('[data-active]').removeAttribute('data-active');
        slides[index].setAttribute('data-active', '');
    });
}
);