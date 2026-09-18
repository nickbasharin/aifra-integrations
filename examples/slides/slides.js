const slides = [...document.querySelectorAll('[data-slide]')];
let current = 0;
function move(direction) {
  current = (current + direction + slides.length) % slides.length;
  slides.forEach((slide, index) => {
    slide.hidden = index !== current;
  });
  document.getElementById('position').textContent =
    `Слайд ${current + 1} из ${slides.length}`;
}
document.getElementById('next').addEventListener('click', () => move(1));
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  }
});
