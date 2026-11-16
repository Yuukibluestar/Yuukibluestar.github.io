// Pixel Futures Co. - auto image slider (Gallery section)
// Uses: let + for statements, functions for slide control/indexing, DOM manipulation

let slideIndex = 0;
let slideTimer = null;
let sliderPlaying = true;
const SLIDE_DELAY = 5000; // milliseconds between automatic slides

const slideEls = document.querySelectorAll('#pxSlider .px-slide');
const thumbEls = document.querySelectorAll('#pxThumbs .px-thumb');
const progressBar = document.getElementById('pxProgress');
const playBtn = document.getElementById('pxPlay');
const sliderBox = document.getElementById('pxSlider');

// Show one slide by index (wraps around at both ends)
function showSlide(n) {
  if (n >= slideEls.length) { n = 0; }
  if (n < 0) { n = slideEls.length - 1; }
  slideIndex = n;

  for (let i = 0; i < slideEls.length; i++) {
    let isActive = (i === slideIndex);
    slideEls[i].classList.toggle('active', isActive);
    thumbEls[i].classList.toggle('active', isActive);
    slideEls[i].setAttribute('aria-hidden', isActive ? 'false' : 'true');
  }
  restartProgress();
}

// Move forward (1) or backward (-1)
function changeSlide(step) {
  showSlide(slideIndex + step);
  if (sliderPlaying) { startAutoplay(); }
}

// Restart the countdown bar
function restartProgress() {
  progressBar.style.transition = 'none';
  progressBar.style.width = '0';
  if (sliderPlaying && slideTimer) {
    void progressBar.offsetWidth; // force reflow so the animation restarts
    progressBar.style.transition = 'width ' + SLIDE_DELAY + 'ms linear';
    progressBar.style.width = '100%';
  }
}

function startAutoplay() {
  stopTimer();
  slideTimer = setInterval(function () { showSlide(slideIndex + 1); }, SLIDE_DELAY);
  restartProgress();
}

function stopTimer() {
  if (slideTimer) { clearInterval(slideTimer); slideTimer = null; }
}

function setPlaying(playing) {
  sliderPlaying = playing;
  playBtn.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;';
  playBtn.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
  if (playing) { startAutoplay(); } else { stopTimer(); restartProgress(); }
}

// Buttons
document.getElementById('pxPrev').addEventListener('click', function () { changeSlide(-1); });
document.getElementById('pxNext').addEventListener('click', function () { changeSlide(1); });
playBtn.addEventListener('click', function () { setPlaying(!sliderPlaying); });

// Thumbnails jump straight to a slide
for (let i = 0; i < thumbEls.length; i++) {
  thumbEls[i].addEventListener('click', function () {
    showSlide(i);
    if (sliderPlaying) { startAutoplay(); }
  });
}

// Pause while the mouse is over the slider, resume when it leaves
sliderBox.addEventListener('mouseenter', function () { stopTimer(); restartProgress(); });
sliderBox.addEventListener('mouseleave', function () { if (sliderPlaying) { startAutoplay(); } });

// Swipe left/right on phones
let swipeStartX = 0;
sliderBox.addEventListener('touchstart', function (e) { swipeStartX = e.changedTouches[0].screenX; }, { passive: true });
sliderBox.addEventListener('touchend', function (e) {
  let diff = e.changedTouches[0].screenX - swipeStartX;
  if (Math.abs(diff) > 50) { changeSlide(diff < 0 ? 1 : -1); }
}, { passive: true });

// Left/right arrow keys while the slider has focus
sliderBox.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') { changeSlide(-1); }
  if (e.key === 'ArrowRight') { changeSlide(1); }
});

// Start: autoplay unless the visitor prefers reduced motion
showSlide(0);
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setPlaying(false);
} else {
  startAutoplay();
}
