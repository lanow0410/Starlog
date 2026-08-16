// ========================================
// DOM
// ========================================

const filterBtn = document.querySelector(".filter-btn");
const filterModal = document.getElementById("filterModal");
const overlay = document.querySelector(".filter-overlay");
const applyBtn = document.querySelector(".apply-btn");

const selectedFilters = document.getElementById("selectedFilters");
const selectedList = document.getElementById("selectedList");

const diaryList = document.getElementById("diaryList");
const searchInput = document.querySelector(".search-box input");


// ========================================
// 카테고리 아이콘
// ========================================

const categoryIcons = {
    "행복": "icons/Joy.png",
    "애정": "icons/Love.png",
    "평온": "icons/Peace.png",
    "안정": "icons/Calm.png",
    "스트레스": "icons/Stress.png"
};


// ========================================
// 현재 필터
// ========================================

let currentPeriod = "전체";
let currentCategory = "전체";


// ========================================
// localStorage에서 기록 가져오기
// ========================================

function getRecords() {

    const savedRecords =
        localStorage.getItem("starlogRecords");

    if (!savedRecords) {
        return [];
    }

    try {
        return JSON.parse(savedRecords);
    } catch (error) {

        console.error(
            "기록 데이터를 불러오는 중 오류 발생:",
            error
        );

        return [];
    }
}


// ========================================
// 날짜 포맷
// ========================================

function formatDate(dateString) {

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "";
    }

    const year = String(date.getFullYear()).slice(2);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일`;
}


// ========================================
// 기간 필터 계산
// ========================================

function isWithinPeriod(dateString, period) {

    if (period === "전체") {
        return true;
    }

    const recordDate = new Date(dateString);

    if (isNaN(recordDate.getTime())) {
        return false;
    }

    const now = new Date();

    // 오늘 기준
    const diffTime = now - recordDate;

    const diffDays =
        diffTime / (1000 * 60 * 60 * 24);


    if (period === "최근 1개월") {
        return diffDays <= 30;
    }

    if (period === "최근 6개월") {
        return diffDays <= 180;
    }

    if (period === "1년 이상") {
        return diffDays >= 365;
    }

    return true;
}


// ========================================
// 검색
// ========================================

function matchesSearch(record, keyword) {

    if (!keyword) {
        return true;
    }

    const searchText = keyword.toLowerCase();

    return (
        (record.title || "").toLowerCase().includes(searchText) ||
        (record.content || "").toLowerCase().includes(searchText) ||
        (record.category || "").toLowerCase().includes(searchText) ||
        (record.tags || "").toLowerCase().includes(searchText)
    );
}


// ========================================
// 기록 필터링
// ========================================

function getFilteredRecords() {

    const records = getRecords();

    const keyword =
        searchInput?.value.trim().toLowerCase() || "";


    return records.filter(record => {

        // 기간
        if (
            !isWithinPeriod(
                record.createdAt,
                currentPeriod
            )
        ) {
            return false;
        }


        // 감정 / 카테고리
        if (
            currentCategory !== "전체" &&
            record.category !== currentCategory
        ) {
            return false;
        }


        // 검색
        if (
            !matchesSearch(
                record,
                keyword
            )
        ) {
            return false;
        }


        return true;
    });
}


// ========================================
// 기록 카드 생성
// ========================================

function createRecordCard(record) {

    const article = document.createElement("article");

    article.className = "diary-card";

    // 기록 ID 저장
    article.dataset.recordId = record.id;

    // 클릭하면 상세 페이지로 이동
    article.addEventListener("click", () => {

        location.href =
            `recordDetail.html?id=${record.id}`;

    });


    // 이미지
    const imageHTML = record.image
        ? `
            <img
                src="${record.image}"
                alt="기록 사진"
            >
        `
        : `
            <img
                src="https://placehold.co/164x92"
                alt="기본 이미지"
            >
        `;


    // 태그
    let tagsHTML = "";

    if (record.tags) {

        // 입력된 태그를 공백 기준으로 표시
        const tags = record.tags
            .split(/\s+/)
            .filter(tag => tag.length > 0);

        tagsHTML = tags
            .map(tag => {

                // @, #, * 제거
                const cleanTag =
                    tag.replace(/^[@#*]/, "");

                return `
                    <span class="tag">
                        ${cleanTag}
                    </span>
                `;
            })
            .join("");
    }


    // 카테고리 아이콘
    const categoryIcon =
        categoryIcons[record.category] ||
        categoryIcons["행복"];


    article.innerHTML = `

        <div class="card-header">

            <div class="emotion-icon">

                <div class="emotion-bg"></div>

                <img
                    class="emotion-image"
                    src="${categoryIcon}"
                    alt="${record.category || ""}"
                >

            </div>

            <span class="nickname">
                ${record.category || "기타"}
            </span>

            <span class="dot">
                ·
            </span>

            <span class="date">
                ${formatDate(record.createdAt)}
            </span>

        </div>


        <div class="card-body">

            <div class="card-image">

                ${imageHTML}

            </div>


            <div class="card-info">

                <p class="card-content">
                    ${escapeHTML(record.content || "")}
                </p>


                <div class="tag-list">

                    ${tagsHTML}

                </div>

            </div>

        </div>
    `;


    return article;
}


// ========================================
// HTML 특수문자 방지
// ========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ========================================
// 기록 출력
// ========================================

function renderRecords() {

    if (!diaryList) {
        return;
    }


    diaryList.innerHTML = "";


    let records = getFilteredRecords();


    // 최신 기록부터
    records.sort((a, b) => {

        return new Date(b.createdAt) -
            new Date(a.createdAt);

    });


    // 기록 없음
    if (records.length === 0) {

        diaryList.innerHTML = `
            <div class="empty-record">
                기록이 없습니다.
            </div>
        `;

        return;
    }


    // 카드 생성
    records.forEach(record => {

        const card =
            createRecordCard(record);

        diaryList.appendChild(card);

    });
}


// ========================================
// 필터 모달 열기
// ========================================

filterBtn.addEventListener("click", () => {

    filterModal.classList.add("show");

});


// ========================================
// 필터 모달 닫기
// ========================================

overlay.addEventListener("click", () => {

    filterModal.classList.remove("show");

});


// ========================================
// 필터 적용
// ========================================

applyBtn.addEventListener("click", () => {

    const groups =
        document.querySelectorAll(".filter-group");


    // 기간
    const periodGroup = groups[0];

    const periodActive =
        periodGroup.querySelector(".chip.active");

    if (periodActive) {

        currentPeriod =
            periodActive.textContent.trim();

    }


    // 감정
    const categoryGroup = groups[1];

    const categoryActive =
        categoryGroup.querySelector(".chip.active");

    if (categoryActive) {

        currentCategory =
            categoryActive.textContent.trim();

    }


    // 선택된 필터 표시
    updateSelectedFilters();


    // 기록 다시 출력
    renderRecords();


    // 모달 닫기
    filterModal.classList.remove("show");

});


// ========================================
// 선택된 필터 표시
// ========================================

function updateSelectedFilters() {

    selectedList.innerHTML = "";


    const filters = [];


    if (currentPeriod !== "전체") {

        filters.push({
            type: "period",
            value: currentPeriod
        });

    }


    if (currentCategory !== "전체") {

        filters.push({
            type: "category",
            value: currentCategory
        });

    }


    filters.forEach(filter => {

        const chip =
            document.createElement("div");

        chip.className = "selected-chip";


        chip.innerHTML = `

            <span>
                ${filter.value}
            </span>

            <button type="button">
                &times;
            </button>

        `;


        chip.querySelector("button")
            .addEventListener("click", () => {

                if (filter.type === "period") {

                    currentPeriod = "전체";

                    setChipActive(
                        0,
                        "전체"
                    );

                }


                if (filter.type === "category") {

                    currentCategory = "전체";

                    setChipActive(
                        1,
                        "전체"
                    );

                }


                updateSelectedFilters();

                renderRecords();

            });


        selectedList.appendChild(chip);

    });


    if (filters.length > 0) {

        selectedFilters.classList.add("show");

    } else {

        selectedFilters.classList.remove("show");

    }
}


// ========================================
// 필터 모달의 active 변경
// ========================================

function setChipActive(groupIndex, value) {

    const groups =
        document.querySelectorAll(".filter-group");

    const group = groups[groupIndex];

    if (!group) {
        return;
    }


    const chips =
        group.querySelectorAll(".chip");


    chips.forEach(chip => {

        chip.classList.remove("active");


        if (
            chip.textContent.trim() === value
        ) {

            chip.classList.add("active");

        }

    });
}


// ========================================
// 필터 칩 선택
// ========================================

document.querySelectorAll(".chip")
    .forEach(btn => {

        btn.addEventListener("click", () => {

            const group =
                btn.closest(".filter-group");


            group.querySelectorAll(".chip")
                .forEach(chip => {

                    chip.classList.remove("active");

                });


            btn.classList.add("active");

        });

    });


// ========================================
// 초기화
// ========================================

const resetBtn =
    document.querySelector(".reset-btn");


resetBtn.addEventListener("click", () => {

    currentPeriod = "전체";
    currentCategory = "전체";


    setChipActive(
        0,
        "전체"
    );

    setChipActive(
        1,
        "전체"
    );


    updateSelectedFilters();

    renderRecords();

});


// ========================================
// 검색
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            renderRecords();

        }
    );

}


// ========================================
// 최초 실행
// ========================================

renderRecords();