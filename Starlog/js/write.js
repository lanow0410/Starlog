// ========================================
// 탭
// ========================================

const btnRecord = document.getElementById('btn-record');
const btnSync = document.getElementById('btn-sync');

const contentRecord = document.getElementById('content-record');
const contentSync = document.getElementById('content-sync');

if (btnRecord && btnSync) {

    btnRecord.addEventListener('click', () => {
        btnRecord.style.background = '#7C58F4';
        btnSync.style.background = 'transparent';

        contentRecord.style.display = 'inline-flex';
        contentSync.style.display = 'none';
    });

    btnSync.addEventListener('click', () => {
        btnRecord.style.background = 'transparent';
        btnSync.style.background = '#7C58F4';

        contentRecord.style.display = 'none';
        contentSync.style.display = 'inline-flex';
    });
}


// ========================================
// 사진 업로드
// ========================================

const photoInput = document.getElementById('photo-input');
const uploadContainer = document.querySelector('.upload-container');

let selectedImage = null;


// 사진 선택
if (photoInput) {

    photoInput.addEventListener('change', (event) => {

        const file = event.target.files[0];

        if (!file) return;

        // 이미지인지 확인
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            photoInput.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {

            selectedImage = e.target.result;

            // 미리보기
            uploadContainer.style.backgroundImage =
                `url("${selectedImage}")`;

            uploadContainer.style.backgroundSize = 'cover';
            uploadContainer.style.backgroundPosition = 'center';
            uploadContainer.style.backgroundRepeat = 'no-repeat';

            // 기존 아이콘 / 문구 숨기기
            const uploadIcon = uploadContainer.querySelector('.upload-icon-box');
            const uploadText = uploadContainer.querySelector('.upload-text');

            if (uploadIcon) {
                uploadIcon.style.display = 'none';
            }

            if (uploadText) {
                uploadText.style.display = 'none';
            }
        };

        reader.readAsDataURL(file);
    });
}


// ========================================
// 카테고리 선택
// ========================================

const categoryCards = document.querySelectorAll('.category-card');

let selectedCategory = '행복';

// 처음 활성화된 카테고리 확인
const initialCategory = document.querySelector('.category-card.active');

if (initialCategory) {
    selectedCategory =
        initialCategory.querySelector('span')?.textContent.trim() || '행복';
}


categoryCards.forEach(card => {

    card.addEventListener('click', () => {

        // 모든 카드 비활성화
        categoryCards.forEach(item => {
            item.classList.remove('active');
        });

        // 현재 카드 활성화
        card.classList.add('active');

        // 카테고리 이름 저장
        selectedCategory =
            card.querySelector('span')?.textContent.trim() || '';
    });
});


// ========================================
// 기록 저장
// ========================================

const saveBtn = document.querySelector('.save-btn');

if (saveBtn) {

    saveBtn.addEventListener('click', () => {

        // 입력값
        const titleInput = document.querySelector('.write-input');
        const contentInput = document.querySelector('.write-textarea');

        // write-input이 2개이므로 직접 선택
        const inputs = document.querySelectorAll('.write-input');

        const title = inputs[0]?.value.trim() || '';
        const tags = inputs[1]?.value.trim() || '';

        const content = contentInput?.value.trim() || '';


        // ========================================
        // 필수값 검사
        // ========================================

        if (!title) {
            alert('제목을 입력해주세요.');
            inputs[0]?.focus();
            return;
        }

        if (!content) {
            alert('내용을 입력해주세요.');
            contentInput?.focus();
            return;
        }


        // ========================================
        // 기록 객체 생성
        // ========================================

        const record = {

            // 고유 ID
            id: Date.now(),

            // 작성 시간
            createdAt: new Date().toISOString(),

            // 사진
            image: selectedImage,

            // 제목
            title: title,

            // 내용
            content: content,

            // 카테고리
            category: selectedCategory,

            // 태그
            tags: tags
        };


        // ========================================
        // 기존 기록 가져오기
        // ========================================

        let records = JSON.parse(
            localStorage.getItem('starlogRecords')
        ) || [];


        // 새 기록 추가
        records.push(record);


        // localStorage 저장
        localStorage.setItem(
            'starlogRecords',
            JSON.stringify(records)
        );


        // 저장 완료
        alert('기록이 저장되었습니다.');


        // 기록 저장 후 초기화
        resetWriteForm();
    });
}


// ========================================
// 작성 폼 초기화
// ========================================

function resetWriteForm() {

    // 입력창 초기화
    const inputs = document.querySelectorAll('.write-input');

    inputs.forEach(input => {
        input.value = '';
    });

    const textarea = document.querySelector('.write-textarea');

    if (textarea) {
        textarea.value = '';
    }


    // 카테고리 초기화
    categoryCards.forEach(card => {
        card.classList.remove('active');
    });

    if (categoryCards.length > 0) {

        categoryCards[0].classList.add('active');

        selectedCategory =
            categoryCards[0]
                .querySelector('span')
                ?.textContent.trim() || '행복';
    }


    // 사진 초기화
    selectedImage = null;

    if (photoInput) {
        photoInput.value = '';
    }

    if (uploadContainer) {

        uploadContainer.style.backgroundImage = '';

        const uploadIcon =
            uploadContainer.querySelector('.upload-icon-box');

        const uploadText =
            uploadContainer.querySelector('.upload-text');

        if (uploadIcon) {
            uploadIcon.style.display = '';
        }

        if (uploadText) {
            uploadText.style.display = '';
        }
    }
}