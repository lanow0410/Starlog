const slider = document.querySelector('.slider');
const dots = document.querySelectorAll('.dot');

const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');

let currentIndex = 0;
let isProgrammatic = false;

/**
 * 초기값 세팅
 */
totalEl.textContent = dots.length;

/**
 * 슬라이드 이동 (dot 클릭)
 */
function goSlide(index) {
  isProgrammatic = true;

  currentIndex = index;
  updateUI(index);

  slider.scrollTo({
    left: slider.clientWidth * index,
    behavior: 'smooth'
  });

  setTimeout(() => {
    isProgrammatic = false;
  }, 500);
}

/**
 * UI 업데이트 (dot + 숫자)
 */
function updateUI(index) {
  // dot
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  // current 값 업데이트 ⭐
  currentEl.textContent = index + 1;
}

/**
 * dot 클릭
 */
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    goSlide(index);
  });
});

/**
 * swipe 감지 + 4 → 1 루프 처리
 */
slider.addEventListener('scroll', () => {
  if (isProgrammatic) return;

  const rawIndex = slider.scrollLeft / slider.clientWidth;
  const index = Math.round(rawIndex);

  // 🔥 루프 처리 (0 ~ 마지막)
  let fixedIndex = index;

  if (index >= dots.length) fixedIndex = 0;
  if (index < 0) fixedIndex = dots.length - 1;

  if (fixedIndex !== currentIndex) {
    currentIndex = fixedIndex;
    updateUI(fixedIndex);
  }
});