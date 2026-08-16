// ======================================================
// MAIN.JS
// ======================================================


// ======================================================
// DOM 로드
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

  initMenu();

  loadRecentRecords();

  loadMainStats();

});


// ======================================================
// SIDE MENU
// ======================================================

function initMenu() {

  const menuBtn =
    document.getElementById("menuBtn");

  const closeBtn =
    document.getElementById("closeBtn");

  const sideMenu =
    document.getElementById("sideMenu");

  const overlay =
    document.getElementById("menuOverlay");


  // 메뉴 요소가 없는 페이지에서도 오류가 발생하지 않도록 처리
  if (!menuBtn || !sideMenu || !overlay) {
    return;
  }


  menuBtn.addEventListener("click", () => {

    sideMenu.classList.add("active");

    overlay.classList.add("active");

  });


  if (closeBtn) {

    closeBtn.addEventListener(
      "click",
      closeMenu
    );

  }


  overlay.addEventListener(
    "click",
    closeMenu
  );


  function closeMenu() {

    sideMenu.classList.remove("active");

    overlay.classList.remove("active");

  }

}


// ======================================================
// LOCAL STORAGE
// ======================================================

function getRecords() {

  try {

    const data =
      localStorage.getItem("starlogRecords");


    if (!data) {
      return [];
    }


    const records =
      JSON.parse(data);


    return Array.isArray(records)
      ? records
      : [];

  } catch (error) {

    console.error(
      "Starlog 기록 데이터를 불러오지 못했습니다.",
      error
    );

    return [];

  }

}


// ======================================================
// 최근 기록
// ======================================================

function loadRecentRecords() {

  const archiveList =
    document.getElementById("recentArchiveList");


  if (!archiveList) {
    return;
  }


  const records =
    getRecords();


  // 최신 기록 순으로 정렬
  const sortedRecords =
    [...records].sort((a, b) => {

      const dateA =
        new Date(
          a.createdAt ||
          a.date ||
          0
        );

      const dateB =
        new Date(
          b.createdAt ||
          b.date ||
          0
        );

      return dateB - dateA;

    });


  // 최근 2개만 표시
  const recentRecords =
    sortedRecords.slice(0, 2);


  archiveList.innerHTML = "";


  // 기록이 없는 경우
  if (recentRecords.length === 0) {

    archiveList.innerHTML = `

            <div class="empty-record">

                아직 기록이 없습니다.

            </div>

        `;

    return;

  }


  recentRecords.forEach(record => {

    const card =
      document.createElement("button");


    card.type = "button";

    card.className =
      "card archive-card";


    card.innerHTML = `

            <div class="archive-top">

                <div class="avatar">

                    <img
                        src="${getEmotionIcon(record.category)}"
                        alt="${escapeHTML(
      record.category || "기록"
    )}"
                    >

                </div>


                <div class="meta">

                    <span class="title">

                        ${escapeHTML(
      record.category ||
      "미분류"
    )}

                    </span>


                    <span class="dot">
                        ·
                    </span>


                    <span class="date">

                        ${formatDate(
      record.createdAt ||
      record.date
    )}

                    </span>

                </div>

            </div>


            <p>

                ${escapeHTML(
      record.content ||
      record.title ||
      "내용 없음"
    )}

            </p>


            <div class="tags">

                ${renderTags(record.tags)}

            </div>

        `;


    // 기록 클릭 → 상세 페이지
    card.addEventListener("click", () => {

      if (!record.id) {

        console.warn(
          "해당 기록에 id가 없습니다.",
          record
        );

        return;

      }


      location.href =
        `./recordDetail.html?id=${encodeURIComponent(
          record.id
        )}`;

    });


    archiveList.appendChild(card);

  });

}


// ======================================================
// 메인 통계
// ======================================================

function loadMainStats() {

  const records =
    getRecords();


  // 총 기록수
  const totalElement =
    document.querySelector(
      ".stat-card:first-child strong"
    );


  // 오늘 추가된 기록
  const todayElement =
    document.querySelector(
      ".stat-card:nth-child(2) strong"
    );


  if (totalElement) {

    totalElement.textContent =
      records.length;

  }


  if (todayElement) {

    const todayCount =
      records.filter(record => {

        const date =
          new Date(
            record.createdAt ||
            record.date
          );


        return isSameDay(
          date,
          new Date()
        );

      }).length;


    todayElement.textContent =
      todayCount;

  }

}


// ======================================================
// 같은 날짜인지 확인
// ======================================================

function isSameDay(date1, date2) {

  if (
    !(date1 instanceof Date) ||
    !(date2 instanceof Date)
  ) {
    return false;
  }


  if (
    isNaN(date1.getTime()) ||
    isNaN(date2.getTime())
  ) {
    return false;
  }


  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );

}


// ======================================================
// 감정 아이콘
// ======================================================

function getEmotionIcon(category) {

  const icons = {

    "행복":
      "./icons/Joy.png",

    "애정":
      "./icons/Love.png",

    "평온":
      "./icons/Peace.png",

    "안정":
      "./icons/Calm.png",

    "스트레스":
      "./icons/Stress.png"

  };


  return (
    icons[category] ||
    "./icons/Joy.png"
  );

}


// ======================================================
// 날짜 포맷
// ======================================================

function formatDate(dateValue) {

  if (!dateValue) {
    return "";
  }


  const date =
    new Date(dateValue);


  if (isNaN(date.getTime())) {

    return String(dateValue);

  }


  const year =
    String(
      date.getFullYear()
    ).slice(-2);


  const month =
    date.getMonth() + 1;


  const day =
    date.getDate();


  return `${year}년 ${month}월 ${day}일`;

}


// ======================================================
// 태그
// ======================================================

function renderTags(tags) {

  if (!tags) {
    return "";
  }


  let tagArray = [];


  // 배열
  if (Array.isArray(tags)) {

    tagArray = tags;

  }


  // 문자열
  else if (typeof tags === "string") {

    tagArray =
      tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);

  }


  return tagArray
    .slice(0, 2)
    .map(tag => {

      return `

                <span>
                    ${escapeHTML(tag)}
                </span>

            `;

    })
    .join("");

}


// ======================================================
// HTML 문자 처리
// ======================================================

function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }


  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}