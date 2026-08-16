// ========================================
// Starlog 분석 리포트
// ========================================


// ========================================
// 설정
// ========================================

const categoryIcons = {

    "행복": "icons/Joy.png",
    "애정": "icons/Love.png",
    "평온": "icons/Peace.png",
    "안정": "icons/Calm.png",
    "스트레스": "icons/Stress.png"

};


const categories = [
    "행복",
    "애정",
    "평온",
    "안정",
    "스트레스"
];


// ========================================
// 기록 가져오기
// ========================================

function getRecords() {

    const data =
        localStorage.getItem("starlogRecords");

    if (!data) {
        return [];
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "기록 데이터를 읽을 수 없습니다.",
            error
        );

        return [];

    }
}


// ========================================
// 오늘 날짜
// ========================================

function isToday(dateString) {

    const date =
        new Date(dateString);

    const today =
        new Date();


    return (
        date.getFullYear() ===
        today.getFullYear()

        &&

        date.getMonth() ===
        today.getMonth()

        &&

        date.getDate() ===
        today.getDate()
    );
}


// ========================================
// 오늘 기록
// ========================================

function getTodayRecords(records) {

    return records.filter(record => {

        return isToday(
            record.createdAt
        );

    });

}


// ========================================
// 날짜 표시
// ========================================

function renderDate() {

    const dateElement =
        document.getElementById("reportDate");


    if (!dateElement) {
        return;
    }


    const today =
        new Date();


    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");


    const day =
        String(today.getDate())
            .padStart(2, "0");


    dateElement.textContent =
        `${month}.${day}.`;

}


// ========================================
// 이번주 날짜 계산
// ========================================

function getWeekDates() {

    const today =
        new Date();


    const day =
        today.getDay();


    // 월요일 기준
    const monday =
        new Date(today);


    const diff =
        day === 0
            ? -6
            : 1 - day;


    monday.setDate(
        today.getDate() + diff
    );


    monday.setHours(
        0, 0, 0, 0
    );


    const dates = [];


    for (let i = 0; i < 7; i++) {

        const date =
            new Date(monday);


        date.setDate(
            monday.getDate() + i
        );


        dates.push(date);

    }


    return dates;

}


// ========================================
// 같은 날짜인지 확인
// ========================================

function isSameDate(a, b) {

    return (
        a.getFullYear() ===
        b.getFullYear()

        &&

        a.getMonth() ===
        b.getMonth()

        &&

        a.getDate() ===
        b.getDate()
    );

}


// ========================================
// 주간 차트
// ========================================

function renderWeeklyChart(records) {

    const dates =
        getWeekDates();


    const days =
        document.querySelectorAll(
            "#weekChart .day"
        );


    const counts = [];


    dates.forEach(date => {

        const count =
            records.filter(record => {

                const recordDate =
                    new Date(
                        record.createdAt
                    );


                return isSameDate(
                    recordDate,
                    date
                );

            }).length;


        counts.push(count);

    });


    const maxCount =
        Math.max(
            ...counts,
            1
        );


    days.forEach((dayElement, index) => {

        const count =
            counts[index] || 0;


        const countElement =
            dayElement.querySelector(
                ".count"
            );


        const bar =
            dayElement.querySelector(
                ".bar"
            );


        if (countElement) {

            countElement.textContent =
                count;

        }


        if (bar) {

            const height =
                count === 0
                    ? 4
                    : Math.max(
                        8,
                        (count / maxCount) * 55
                    );


            bar.style.height =
                `${height}px`;

        }


        // 오늘 강조
        const today =
            new Date();


        if (
            isSameDate(
                dates[index],
                today
            )
        ) {

            dayElement.classList.add(
                "active"
            );

        } else {

            dayElement.classList.remove(
                "active"
            );

        }

    });


    // 평균
    const total =
        counts.reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const average =
        (total / 7).toFixed(1);


    const averageElement =
        document.getElementById(
            "averageCount"
        );


    if (averageElement) {

        averageElement.textContent =
            `${average} 기록`;

    }

}


// ========================================
// 오늘 카테고리 통계
// ========================================

function renderCategoryStats(todayRecords) {

    const counts = {};


    categories.forEach(category => {

        counts[category] = 0;

    });


    todayRecords.forEach(record => {

        if (
            counts[
            record.category
            ] !== undefined
        ) {

            counts[
                record.category
            ]++;

        }

    });


    const total =
        todayRecords.length;


    // 가장 많은 카테고리
    let topCategory = "행복";
    let topCount = 0;


    categories.forEach(category => {

        if (
            counts[category] >
            topCount
        ) {

            topCategory =
                category;

            topCount =
                counts[category];

        }

    });


    // 제목
    const title =
        document.getElementById(
            "activityTitle"
        );


    if (title) {

        if (total === 0) {

            title.textContent =
                "오늘의 기록이 없어요";

        } else {

            title.textContent =
                `${topCategory} 중심의 하루였어요`;

        }

    }


    // 설명
    const description =
        document.getElementById(
            "activityDescription"
        );


    if (description) {

        if (total === 0) {

            description.textContent =
                "오늘 기록을 추가하면 분석할 수 있어요.";

        } else {

            const percent =
                Math.round(
                    (topCount / total) * 100
                );


            description.textContent =
                `전체 기록 중 ${percent}%가 ${topCategory} 감정이었어요`;

        }

    }


    // 대표 카테고리 아이콘
    const topIcon =
        document.getElementById(
            "topCategoryIcon"
        );


    if (topIcon) {

        topIcon.src =
            categoryIcons[
            topCategory
            ];

    }


    const topName =
        document.getElementById(
            "topCategoryName"
        );


    if (topName) {

        topName.textContent =
            topCategory;

    }


    // 오늘 기록 수
    const todayCount =
        document.getElementById(
            "todayCount"
        );


    if (todayCount) {

        todayCount.textContent =
            total;

    }


    // 각각의 비율
    categories.forEach(category => {

        const percent =
            total === 0
                ? 0
                : Math.round(
                    (counts[category] /
                        total) * 100
                );


        const percentElement =
            document.querySelector(
                `[data-category-percent="${category}"]`
            );


        if (percentElement) {

            percentElement.textContent =
                `${percent}%`;

        }


        const fillElement =
            document.querySelector(
                `[data-category-fill="${category}"]`
            );


        if (fillElement) {

            fillElement.style.width =
                `${percent}%`;

        }

    });

}


// ========================================
// 태그 분석
// ========================================

function getTagCounts(records) {

    const tagCounts = {};


    records.forEach(record => {

        if (!record.tags) {
            return;
        }


        const tags =
            record.tags
                .split(/\s+/)
                .filter(
                    tag => tag.length > 0
                );


        tags.forEach(tag => {

            const cleanTag =
                tag.trim();


            if (!cleanTag) {
                return;
            }


            if (
                tagCounts[cleanTag]
                === undefined
            ) {

                tagCounts[cleanTag] = 0;

            }


            tagCounts[cleanTag]++;

        });

    });


    return tagCounts;

}


// ========================================
// 태그 리포트
// ========================================

function renderTagStats(todayRecords) {

    const tagCounts =
        getTagCounts(
            todayRecords
        );


    const sortedTags =
        Object.entries(tagCounts)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    const tagTitle =
        document.getElementById(
            "tagTitle"
        );


    const tagDescription =
        document.getElementById(
            "tagDescription"
        );


    if (sortedTags.length === 0) {

        if (tagTitle) {

            tagTitle.textContent =
                "오늘의 태그가 없어요";

        }


        if (tagDescription) {

            tagDescription.textContent =
                "태그를 추가하면 맥락을 분석할 수 있어요.";

        }

    } else {

        const topTag =
            sortedTags[0][0];


        const topCount =
            sortedTags[0][1];


        if (tagTitle) {

            tagTitle.textContent =
                `${topTag} 관련 기록이 많았어요`;

        }


        if (tagDescription) {

            tagDescription.textContent =
                `오늘 ${topTag} 태그가 ${topCount}회 사용되었어요`;

        }

    }

    // 범례
    const legend =
        document.getElementById(
            "tagLegend"
        );


    if (!legend) {
        return;
    }


    legend.innerHTML = "";


    const colors = [
        "firstDot",
        "secondDot",
        "thirdDot"
    ];


    sortedTags
        .slice(0, 3)
        .forEach(
            ([tag, count], index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "legend-item";


                item.innerHTML = `

                    <span
                        class="dot ${colors[index]}"
                    ></span>

                    <span>
                        ${escapeHTML(tag)}
                    </span>

                    <span class="new-tag">
                        ${count}개
                    </span>

                `;


                legend.appendChild(
                    item
                );

            }
        );


    // 태그가 없을 경우
    if (sortedTags.length === 0) {

        legend.innerHTML = `
            <div class="legend-item">
                <span>오늘의 태그 없음</span>
            </div>
        `;

    }

}

// ========================================
// 태그 그래프
// ========================================

function renderTagDonut(todayRecords) {

    const tagCounts = getTagCounts(todayRecords);

    const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1]);

    const donut = document.querySelector(".donut-chart");

    if (!donut) return;

    // 기록이 없을 경우
    if (sortedTags.length === 0) {

        donut.style.background =
            "conic-gradient(#424242 0deg 360deg)";

        return;
    }

    const total = sortedTags.reduce(
        (sum, [, count]) => sum + count,
        0
    );

    const maxTags = sortedTags.slice(0, 3);

    const colors = [
        "#23AC9C",
        "#E8650A",
        "#EDA21F"
    ];

    let currentDegree = 0;

    const gradients = [];

    maxTags.forEach(([tag, count], index) => {

        const degree =
            (count / total) * 360;

        const start = currentDegree;
        const end = currentDegree + degree;

        gradients.push(
            `${colors[index]} ${start}deg ${end}deg`
        );

        currentDegree = end;

    });

    // 3개를 넘는 태그는 기타 처리
    const otherCount =
        sortedTags
            .slice(3)
            .reduce(
                (sum, [, count]) => sum + count,
                0
            );

    if (otherCount > 0) {

        const degree =
            (otherCount / total) * 360;

        gradients.push(
            `#666666 ${currentDegree}deg ${currentDegree + degree}deg`
        );

    }

    donut.style.background =
        `conic-gradient(${gradients.join(", ")})`;

}

// ========================================
// 인사이트
// ========================================

function renderInsight(todayRecords) {

    const insight =
        document.getElementById(
            "insightText"
        );


    if (!insight) {
        return;
    }


    if (todayRecords.length === 0) {

        insight.textContent =
            "오늘 기록이 아직 없어요. 새로운 기록을 추가해보세요.";

        return;

    }


    // 카테고리
    const categoryCounts = {};


    todayRecords.forEach(record => {

        const category =
            record.category;


        categoryCounts[category] =
            (categoryCounts[category] || 0)
            + 1;

    });


    const topCategory =
        Object.entries(categoryCounts)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )[0];


    // 태그
    const tagCounts =
        getTagCounts(
            todayRecords
        );


    const topTag =
        Object.entries(tagCounts)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )[0];


    let messages = [];


    if (topCategory) {

        messages.push(
            `${topCategory[0]} 감정의 기록이 가장 많았어요.`
        );

    }


    if (topTag) {

        messages.push(
            `${topTag[0]} 태그가 ${topTag[1]}회 사용되었어요.`
        );

    }


    if (messages.length === 0) {

        messages.push(
            "오늘의 기록이 쌓이고 있어요."
        );

    }


    insight.innerHTML =
        messages.join("<br>");

}


// ========================================
// HTML 특수문자 처리
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


// ========================================
// 기록 추가 버튼
// ========================================

const recordBtn =
    document.querySelector(
        ".record-btn"
    );


if (recordBtn) {

    recordBtn.addEventListener(
        "click",
        () => {

            location.href =
                "write.html";

        }
    );

}


// ========================================
// 뒤로가기
// ========================================

const backBtn =
    document.querySelector(
        ".back-btn"
    );


if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            history.back();

        }
    );

}


// ========================================
// 실행
// ========================================

function initReport() {

    const records =
        getRecords();

    const todayRecords =
        getTodayRecords(records);

    renderDate();

    renderWeeklyChart(records);

    renderCategoryStats(todayRecords);

    renderTagStats(todayRecords);

    renderTagDonut(todayRecords);

    renderInsight(todayRecords);
}


initReport();