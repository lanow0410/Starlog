// common.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('common-header-menu');
  if (!container) return;

  // 1. 바뀐 파일 이름(commonHeaderMenu.html)으로 매칭해줍니다.
  fetch('./commonHeaderMenu.html')
    .then(response => response.text())
    .then(data => {
      container.innerHTML = data;

      const menuBtn = document.getElementById('menuBtn');
      const closeBtn = document.getElementById('closeBtn');
      const sideMenu = document.getElementById('sideMenu');
      const menuOverlay = document.getElementById('menuOverlay');

      if (menuBtn && closeBtn && sideMenu && menuOverlay) {
        // 메뉴 열기
        menuBtn.addEventListener('click', () => {
          sideMenu.classList.add('active');
          menuOverlay.classList.add('active');
        });

        // 메뉴 닫기 (X 버튼)
        closeBtn.addEventListener('click', () => {
          sideMenu.classList.remove('active');
          menuOverlay.classList.remove('active');
        });

        // 메뉴 닫기 (어두운 배경 클릭)
        menuOverlay.addEventListener('click', () => {
          sideMenu.classList.remove('active');
          menuOverlay.classList.remove('active');
        });
      }
    })
    .catch(error => console.error('네비게이션을 불러오는 중 오류 발생:', error));
});