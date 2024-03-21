const initCarousel = () => {
  const carousels = document.querySelectorAll(".carousel");
  carousels.forEach((carousel) => {
    const slidesTrack = carousel.querySelector("[data-carousel-slides]");
    const slides = Array.from(slidesTrack.children);
    const buttons = carousel.querySelectorAll("[data-carousel-button]");
    const slideWidth = slides[0].offsetWidth + 30;
    const totalSlidesWidth = slides.reduce((acc, slide) => acc + slide.offsetWidth, 0);

    buttons.forEach((button) => {
      const newButton = button.cloneNode(true); // Cloning the button
      button.replaceWith(newButton); // Replacing the button with the cloned one

      newButton.addEventListener("click", () => {
        const offset = newButton.dataset.carouselButton === "next" ? 1 : -1;
        const activeSlide = slidesTrack.querySelector("[data-active]");
        //hanlde right button click when first slide is on screen
        console.log(`activeSlide: ${slides.indexOf(activeSlide)} offset: ${offset} totalSlidesWidth: ${totalSlidesWidth} window.innerWidth: ${window.innerWidth}`);
        if(slides.indexOf(activeSlide) == 0 && offset == 1 && totalSlidesWidth <= window.innerWidth){
          //active slide is first one and right button is clicked and screen is not full of slides
          return;
        }
        let index = slides.indexOf(activeSlide) + offset;
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        slidesTrack.style.transform = `translateX(-${slideWidth * index}px)`;
        slidesTrack
          .querySelector("[data-active]")
          .removeAttribute("data-active");
        slides[index].setAttribute("data-active", "");
      });
    });
  });
};

initCarousel();
