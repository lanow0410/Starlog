// ========================================
// localStorage 기록 상세
// ========================================


// ========================================
// DOM
// ========================================

const detailTitle =
    document.getElementById("detailTitle");

const detailImage =
    document.getElementById("detailImage");

const detailContent =
    document.getElementById("detailContent");

const detailTags =
    document.getElementById("detailTags");

const relatedList =
    document.getElementById("relatedList");

const relatedCount =
    document.getElementById("relatedCount");


// ========================================
// 카테고리 아이콘
// ========================================

const categoryIcons = {

    "행복": "icons/Joy.png",

    "애정": "icons/Love.png",

    "평온": "icons/Peace.png",

    "안정": "icons/Stable.png",

    "스트레스": "icons/Stress.png"

};


// ========================================
// URL에서 record ID 가져오기
// ========================================

const params =
    new URLSearchParams(window.location.search);

const recordId =
    params.get("id");


// ========================================
// localStorage 기록 가져오기
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
            "기록 데이터를 불러올 수 없습니다.",
            error
        );

        return [];

    }
}


// ========================================
// 현재 기록 찾기
// ========================================

function getCurrentRecord() {

    const records =
        getRecords();

    return records.find(
        record =>
            String(record.id) === String(recordId)
    );
}


// ========================================
// 날짜 표시
// ========================================

function formatDate(dateString) {

    const date =
        new Date(dateString);

    if (isNaN(date.getTime())) {
        return "";
    }

    const year =
        String(date.getFullYear()).slice(2);

    const month =
        date.getMonth() + 1;

    const day =
        date.getDate();

    return `${year}년 ${month}월 ${day}일`;
}


// ========================================
// 기록 내용 출력
// ========================================

function renderRecord(record) {

    if (!record) {

        alert("기록을 찾을 수 없습니다.");

        history.back();

        return;

    }


    // ====================================
    // 제목
    // ====================================

    detailTitle.textContent =
        record.title || "제목 없음";


    // ====================================
    // 이미지
    // ====================================

    if (record.image) {

        detailImage.src =
            record.image;

    } else {

        detailImage.src =
            "https://placehold.co/452x254";

    }


    // ====================================
    // 내용
    // ====================================

    detailContent.textContent =
        record.content || "내용 없음";


    // ====================================
    // 카테고리
    // ====================================

    renderCategory(
        record.category
    );


    // ====================================
    // 태그
    // ====================================

    renderTags(
        record.tags
    );


    // ====================================
    // 관련 기록
    // ====================================

    renderRelatedRecords(
        record
    );

}


// ========================================
// 카테고리 출력
// ========================================

function renderCategory(category) {

    const categoryItems =
        document.querySelectorAll(
            ".category-item"
        );


    categoryItems.forEach(item => {

        const text =
            item.querySelector("span")
                ?.textContent
                .trim();


        // active 초기화
        item.classList.remove("active");


        if (text === category) {

            item.classList.add("active");

        }

    });

}


// ========================================
// 태그 출력
// ========================================

function renderTags(tags) {

    detailTags.innerHTML = "";


    if (!tags) {

        detailTags.innerHTML = `
            <span class="tag">
                태그 없음
            </span>
        `;

        return;

    }


    const tagArray =
        tags
            .split(/\s+/)
            .filter(tag => tag.length > 0);


    tagArray.forEach(tag => {

        const tagElement =
            document.createElement("span");

        tagElement.className =
            "tag";


        // @ # * 제거
        tagElement.textContent =
            tag.replace(/^[@#*]/, "");


        detailTags.appendChild(
            tagElement
        );

    });

}


// ========================================
// 관련 기록
// ========================================

function renderRelatedRecords(currentRecord) {

    relatedList.innerHTML = "";


    const records =
        getRecords();


    // 같은 카테고리의 다른 기록
    const relatedRecords =
        records.filter(record => {

            return (
                String(record.id) !==
                String(currentRecord.id)
                &&
                record.category ===
                currentRecord.category
            );

        });


    // 최신순
    relatedRecords.sort((a, b) => {

        return new Date(b.createdAt) -
            new Date(a.createdAt);

    });


    // 최대 3개
    const displayRecords =
        relatedRecords.slice(0, 3);


    // 개수 표시
    if (relatedCount) {

        relatedCount.textContent =
            `${displayRecords.length} / ${relatedRecords.length}`;

    }


    // 관련 기록 없음
    if (displayRecords.length === 0) {

        relatedList.innerHTML = `
            <div class="empty-related">
                관련 기록이 없습니다.
            </div>
        `;

        return;

    }


    // 카드 생성
    displayRecords.forEach(record => {

        const card =
            createRelatedCard(record);

        relatedList.appendChild(card);

    });

}


// ========================================
// 관련 기록 카드 생성
// ========================================

function createRelatedCard(record) {

    const article =
        document.createElement("article");


    article.className =
        "diary-card";


    // 카드 클릭
    article.addEventListener(
        "click",
        () => {

            location.href =
                `recordDetail.html?id=${record.id}`;

        }
    );


    // 이미지
    const image =
        record.image ||
        "https://placehold.co/164x92";


    // 아이콘
    const icon =
        categoryIcons[record.category] ||
        categoryIcons["행복"];


    // 태그
    let tagsHTML = "";


    if (record.tags) {

        const tags =
            record.tags
                .split(/\s+/)
                .filter(tag => tag.length > 0);


        tagsHTML =
            tags
                .map(tag => {

                    const cleanTag =
                        tag.replace(/^[@#*]/, "");

                    return `
                        <span class="tag">
                            ${escapeHTML(cleanTag)}
                        </span>
                    `;

                })
                .join("");

    }


    article.innerHTML = `

        <div class="card-header">

            <div class="emotion-icon">

                <div class="emotion-bg"></div>

                <img
                    class="emotion-image"
                    src="${icon}"
                    alt=""
                >

            </div>

            <span class="nickname">
                ${escapeHTML(
        record.category || "기타"
    )}
            </span>

            <span class="dot">
                ·
            </span>

            <span class="date">
                ${formatDate(
        record.createdAt
    )}
            </span>

        </div>


        <div class="card-body">

            <div class="card-image">

                <img
                    src="${image}"
                    alt="기록 이미지"
                >

            </div>


            <div class="card-info">

                <p class="card-content">
                    ${escapeHTML(
        record.content || ""
    )}
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
// HTML 특수문자 처리
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


// ========================================
// 삭제
// ========================================

const deleteBtn =
    document.querySelector(".delete-btn");


if (deleteBtn) {

    deleteBtn.addEventListener(
        "click",
        () => {

            const record =
                getCurrentRecord();


            if (!record) {
                return;
            }


            const confirmDelete =
                confirm(
                    "이 기록을 삭제하시겠습니까?"
                );


            if (!confirmDelete) {
                return;
            }


            let records =
                getRecords();


            records =
                records.filter(
                    item =>
                        String(item.id) !==
                        String(record.id)
                );


            localStorage.setItem(
                "starlogRecords",
                JSON.stringify(records)
            );


            alert(
                "기록이 삭제되었습니다."
            );


            location.href =
                "record.html";

        }
    );

}


// ========================================
// 수정 버튼
// ========================================

const editBtn =
    document.querySelector(".edit-btn");


if (editBtn) {

    editBtn.addEventListener(
        "click",
        () => {

            location.href =
                `write.html?edit=${recordId}`;

        }
    );

}


// ========================================
// 뒤로가기
// ========================================

const backBtn =
    document.querySelector(".back-btn");


if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            history.back();

        }
    );

}


// ========================================
// 메인으로
// ========================================

const mainBtn =
    document.querySelector(".main-btn");


if (mainBtn) {

    mainBtn.addEventListener(
        "click",
        () => {

            location.href =
                "index.html";

        }
    );

}


// ========================================
// 초기 실행
// ========================================

const currentRecord =
    getCurrentRecord();


renderRecord(
    currentRecord
);