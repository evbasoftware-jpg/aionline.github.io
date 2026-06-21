// main.js
// Part 1
let rows = [];

function el(id) {
    return document.getElementById(id);
}

function formatDate(dateObj) {
    const d = String(dateObj.getDate()).padStart(2, "0");
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const y = dateObj.getFullYear();
    return d + "/" + m + "/" + y;
}

// Sticky Header
window.addEventListener("load", function () {
    updateHeaderTop();
});
window.addEventListener("resize", function () {
    updateHeaderTop();
});

function updateHeaderTop() {
    const panel = el("topPanel");
    if (!panel) return;
    const topHeight = panel.offsetHeight;
    document.querySelectorAll("thead th").forEach(function (th) {
        th.style.top = topHeight + "px";
    });
}

// Career Increment
function getCareerIncrementYears() {
    const arr = [];
    document.querySelectorAll(".incOpt:checked").forEach(function (item) {
        arr.push(Number(item.value));
    });
    return arr;
}

// Increment Count
function getIncrementCount(currentDate, doj){
    // একই দিন ও মাস না হলে Increment নয়
    if(
        currentDate.getDate() !== doj.getDate() ||
        currentDate.getMonth() !== doj.getMonth()
    ){
        return 0;
    }

    // DOJ বছরের মধ্যে Increment হবে না
    const serviceYears =
        currentDate.getFullYear() - doj.getFullYear();
    if(serviceYears <= 0){
        return 0;
    }

    // Normal Increment
    let count = 1;

    // Career Double Increment
    getCareerIncrementYears().forEach(function(y){
        if(serviceYears === y){
            count = 2;
        }
    });
    return count;
}

// July Increment (ROPA 2009 / 2019)
function isJulyIncrement(date){

    return (
        date.getDate() === 1 &&
        date.getMonth() === 6
    );

}

// Promotion
function isPromotionDate(date){
    const p = el("pDate").value;
    if(!p) return false;
    const pd = new Date(p);
    return (
        date.getFullYear() === pd.getFullYear() &&
        date.getMonth() === pd.getMonth() &&
        date.getDate() === pd.getDate()
    );
}

// A Category Change
function isACategoryDate(date){
    const a = el("aDate").value;
    if(!a) return false;
    const ad = new Date(a);
    return (
        date.getFullYear() === ad.getFullYear() &&
        date.getMonth() === ad.getMonth() &&
        date.getDate() === ad.getDate()
    );
}

// Auto Fill
function autoFillBasicAndROPA() {

    const dojStr = el("dojInput").value;
    const category = el("category").value;

    if (!dojStr) {
        return;
    }

    const doj = new Date(dojStr);
    const ropa = [
        {
            id: "r1981",
            end: new Date("1990-02-28"),
            year: 1981
        },
        {
            id: "r1990",
            end: new Date("1999-02-28"),
            year: 1990
        },
        {
            id: "r1998",
            end: new Date("2009-03-31"),
            year: 1998
        },
        {
            id: "r2009",
            end: new Date("2019-12-31"),
            year: 2009
        },
        {
            id: "r2019",
            end: new Date("2099-12-31"),
            year: 2019
        }
    ];

    let found = false;

    ropa.forEach(function (r) {
        if (!found && doj <= r.end) {
            el(r.id).value = dojStr;
            if (
                typeof ENTRY_PAY !== "undefined" &&
                ENTRY_PAY[r.year]
            ) {
                el("basicInput").value =
                    ENTRY_PAY[r.year][category];
            }
            found = true;
        }
    });
}

// Generate Salary Table
function generate() {
    const doj = new Date(el("dojInput").value);
    const dor = new Date(el("dorInput").value);

    if (isNaN(doj) || isNaN(dor)) {
        alert("Please Select DOJ and DOR");
        return;
    }
    rows = [];

    let currentBasic = Number(el("basicInput").value);
    const ropaConfig = [
        {
            title: "ROPA 1981",
            year: 1981,
            start: el("r1981").value,
            end: "1990-02-28",
            ma: 15
        },
        {
            title: "ROPA 1990",
            year: 1990,
            start: el("r1990").value,
            end: "1999-02-28",
            ma: 30
        },
        {
            title: "ROPA 1998",
            year: 1998,
            start: el("r1998").value,
            end: "2009-03-31",
            ma: 100
        },
        {
            title: "ROPA 2009",
            year: 2009,
            start: el("r2009").value,
            end: "2019-12-31",
            ma: 300
        },
        {
            title: "ROPA 2019",
            year: 2019,
            start: el("r2019").value,
            end: "2099-12-31",
            ma: 500
        }
    ];

    let startFound = false;
 ropaConfig.forEach(function (ropa, index) {
    if (!ropa.start) return;
    let startDate = new Date(ropa.start);
    let endDate = new Date(ropa.end);
    if (endDate > dor) {
        endDate = new Date(dor);
    }

    // DOJ-এর আগে শেষ হয়ে যাওয়া ROPA Skip
    if (doj > endDate) {
        return;
    }

    // প্রথম Applicable ROPA
    if (!startFound) {
        if (doj >= startDate && doj <= endDate) {
            startDate = new Date(doj);
            startFound = true;
        } else {
            return;
        }
    }

    rows.push({
        isHeader: true,
        title: ropa.title
    });

    let loopDate = new Date(startDate);

    while (loopDate <= endDate) {
        // DOJ বছরে Increment হবে না
        let serviceYears =
            loopDate.getFullYear() - doj.getFullYear();
        let increment = 0;
        if (
            serviceYears > 0 &&
            loopDate.getDate() === doj.getDate() &&
            loopDate.getMonth() === doj.getMonth()
        ) {
            increment = 1;
            document.querySelectorAll(".incOpt:checked")
                .forEach(function (c) {
                    if (serviceYears === Number(c.value)) {
                        increment = 2;
                    }
                });
        }

        for (let i = 0; i < increment; i++) {
            currentBasic =
                getScaleIncrement(
                    currentBasic,
                    ropa.year
                );
        }

        // ROPA 2009 ও 2019-এ 1st July Increment
        if (
            (ropa.year === 2009 || ropa.year === 2019) &&
            loopDate.getDate() === 1 &&
            loopDate.getMonth() === 6
        ) {
            currentBasic =
                getScaleIncrement(
                    currentBasic,
                    ropa.year
                );
        }

        let row = {
            date: new Date(loopDate),
            ropaYear: ropa.year,
            basic: currentBasic,
            ADD: 0,
            DA: 0,
            HRA: 0,
            MA: ropa.ma,
            IR: 0,
            GPF: Math.round(currentBasic * 0.06),
            GI: 60,
            PTAX: 0,
            gross: 0,
            net: 0
        };
        calculateSalary(row);
        rows.push(row);
        loopDate.setMonth(loopDate.getMonth() + 1);
    }

    // পরবর্তী ROPA Fitment
    if (index < ropaConfig.length - 1) {
        currentBasic =
            getFitmentBasic(
                currentBasic,
                ropa.year,
                ropaConfig[index + 1].year
            );
    }
});
    
    rows = rows.filter(function(r){
    return r!=null;
});
    render();
                       }

// Update Value
function updateValue(index, field, value){
    let v = Number(value);
    if(isNaN(v)){
        v = 0;
    }
    rows[index][field] = v;
    if(field=="basic"){
        let currentBasic=v;
        for(let i=index;i<rows.length;i++){
            if(rows[i].isHeader){
                continue;
            }
            rows[i].basic=currentBasic;
            calculateSalary(rows[i]);
            // পরবর্তী Increment Date এ Basic Update
            if(i<rows.length-1){
                let next=rows[i+1];
                if(next && !next.isHeader){
                    let inc=
                        getIncrementCount(
                            next.date,
                            new Date(el("dojInput").value)
                        );
                    for(let j=0;j<inc;j++){
                        currentBasic=
                            getScaleIncrement(
                                currentBasic,
                                next.ropaYear
                            );
                    }
                }
            }
        }
    }
    else{
        calculateSalary(rows[index]);
    }
    render();
}

// Render
function render() {
    const tbody = el("tbody");
    tbody.innerHTML = "";
    let lastRopa="";
    rows.forEach(function (row, index) {
        const tr = document.createElement("tr");
        
        if(row.isHeader){
    lastRopa=row.title;
    tr.innerHTML=
    `<td colspan="14"
    class="ropa-header">
    ${row.title}
    </td>`;
    tbody.appendChild(tr);
    return;
        }
        
        tr.innerHTML =
`<td>${formatDate(row.date)}</td>
<td>
<input class="edit-input" type="number" value="${row.basic}"
onchange="updateValue(${index},'basic',this.value)">
</td>
<td>${((row.daRate || 0) * 100).toFixed(0)}%</td>
<td>${((row.hraRate || 0) * 100).toFixed(0)}%</td>
<td>
<input class="edit-input" type="number" value="${row.ADD}"
onchange="updateValue(${index},'ADD',this.value)">
</td>
<td>${row.DA}</td>
<td>${row.HRA}</td>
<td>
<input class="edit-input" type="number" value="${row.MA}"
onchange="updateValue(${index},'MA',this.value)">
</td>
<td>
<input class="edit-input" type="number" value="${row.IR}"
onchange="updateValue(${index},'IR',this.value)">
</td>
<td>${row.gross}</td>
<td>
<input class="edit-input" type="number" value="${row.GPF}"
onchange="updateValue(${index},'GPF',this.value)">
</td>
<td>${row.PTAX}</td>
<td>
<input class="edit-input" type="number" value="${row.GI}"
onchange="updateValue(${index},'GI',this.value)">
</td>
<td>${row.net}</td>`;
        tbody.appendChild(tr);
    });
}

function refreshAll(){
    rows.forEach(function(r){
        if(r.isHeader){
            return;
        }
        calculateSalary(r);
    });
    render();
}

function updateBasic(){
    refreshAll();
}
