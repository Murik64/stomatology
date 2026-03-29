document.addEventListener('DOMContentLoaded', function () {
  const dots = document.querySelectorAll('.stomatology-pagination-dots .dot');
  const slides = document.querySelectorAll('.hero-section .hero-slide');

  if (!dots.length || !slides.length) return;

  dots.forEach(dot => {
    dot.addEventListener('click', function () {

      const slideIndex = this.getAttribute('data-slide-to');


      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      slides[slideIndex].classList.add('active');
      this.classList.add('active');
    });
  });
});

function initBenefitsCarousel() {

  const sections = document.querySelectorAll('.stomatology-benefits');

  if (!sections.length) return;

  sections.forEach(section => {

    const grid = section.querySelector('.stomatology-benefits__grid');
    const leftBtn = section.querySelector('.stomatology-benefits__arrow--left');
    const rightBtn = section.querySelector('.stomatology-benefits__arrow--right');

    if (!grid || !leftBtn || !rightBtn) return;

    function getStep() {
      const card = grid.querySelector('[class*="benefits__card"]');
      if (!card) return 230;
      return card.offsetWidth + 10;
    }

    leftBtn.addEventListener('click', () => {
      grid.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
      grid.scrollBy({ left: getStep(), behavior: 'smooth' });
    });
  });
}
initBenefitsCarousel()