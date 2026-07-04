const filterBtn = document.querySelector(".filter-btn");
const filterModal = document.getElementById("filterModal");
const overlay = document.querySelector(".filter-overlay");
const applyBtn = document.querySelector(".apply-btn");
const selectedFilters = document.getElementById("selectedFilters");
const selectedList = document.getElementById("selectedList");

filterBtn.addEventListener("click", () => {
    filterModal.classList.add("show");
});

overlay.addEventListener("click", () => {
    filterModal.classList.remove("show");
});

applyBtn.addEventListener("click",()=>{

    selectedList.innerHTML="";

    document.querySelectorAll(".filter-group").forEach(group=>{

        const active = group.querySelector(".chip.active");

        if(!active) return;

        // "전체"는 표시 안함
        if(active.textContent==="전체") return;

        const chip=document.createElement("div");
        chip.className="selected-chip";

        chip.innerHTML=`
            <span>${active.textContent}</span>
            <button>&times;</button>
        `;

        chip.querySelector("button").onclick=()=>{

            chip.remove();

            if(selectedList.children.length===0){

                selectedFilters.classList.remove("show");

            }

        };

        selectedList.appendChild(chip);

    });

    if(selectedList.children.length>0){

        selectedFilters.classList.add("show");

    }else{

        selectedFilters.classList.remove("show");

    }

    filterModal.classList.remove("show");

});

// 칩 선택
document.querySelectorAll(".chip").forEach(btn => {

    btn.addEventListener("click", () => {

        const group = btn.closest(".filter-group");

        group.querySelectorAll(".chip").forEach(chip => {
            chip.classList.remove("active");
        });

        btn.classList.add("active");

    });

});