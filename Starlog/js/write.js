const btnRecord = document.getElementById('btn-record');
const btnSync = document.getElementById('btn-sync');

const contentRecord = document.getElementById('content-record');
const contentSync = document.getElementById('content-sync');

if (btnRecord && btnSync) {
    // 1. [기록 남기기] 탭 클릭 시 -> 작성 폼(write-page) 노출
    btnRecord.addEventListener('click', () => {
        btnRecord.style.background = '#7C58F4';
        btnSync.style.background = 'transparent';

        contentRecord.style.display = 'inline-flex';
        contentSync.style.display = 'none';
    });

    // 2. [연동 기록 불러오기] 탭 클릭 시 -> 스마트폰 태그 안내 노출
    btnSync.addEventListener('click', () => {
        btnRecord.style.background = 'transparent';
        btnSync.style.background = '#7C58F4';

        contentRecord.style.display = 'none';
        contentSync.style.display = 'inline-flex';
    });
}