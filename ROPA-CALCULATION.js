function getIncrementCount(currentDate, doj){

    let count = 0;

    if(
        currentDate.getDate() === doj.getDate() &&
        currentDate.getMonth() === doj.getMonth()
    ){
        count = 1;
    }

    const serviceYears =
        currentDate.getFullYear() -
        doj.getFullYear();

    document.querySelectorAll(".incOpt:checked")
        .forEach(opt => {

            if(count === 1 &&
               serviceYears === Number(opt.value)){

                count = 2;

            }

        });

    return count;

}

// ===============================
// COMMON CALCULATION
// ===============================

function calculateCommon(row){

    // DA
    row.daRate = getDA(row.date);
    row.DA = Math.round(row.basic * row.daRate);

    // HRA
    row.hraRate = getHRAPercentage(row.date) / 100;
    row.HRA = Math.round(row.basic * row.hraRate);

    // HRA Limit

    if(row.ropaYear == 2009 && row.HRA > 6000){
        row.HRA = 6000;
    }

    if(row.ropaYear == 2019 && row.HRA > 12000){
        row.HRA = 12000;
    }

    // Gross

    row.gross =
        row.basic +
        row.DA +
        row.HRA +
        row.MA +
        row.ADD +
        row.IR;

    // PTAX

    row.PTAX = getDefaultPTAX(row.gross);

    // Net

    row.net =
        row.gross -
        row.GPF -
        row.PTAX -
        row.GI;

}

// ===============================
// ROPA 1981
// ===============================

function calculateROPA1981(row){

    row.ropaYear = 1981;

    calculateCommon(row);

}

// ===============================
// ROPA 1990
// ===============================

function calculateROPA1990(row){

    row.ropaYear = 1990;

    calculateCommon(row);

}

// ===============================
// ROPA 1998
// ===============================

function calculateROPA1998(row){

    row.ropaYear = 1998;

    calculateCommon(row);

}

// ===============================
// ROPA 2009
// ===============================

function calculateROPA2009(row){

    row.ropaYear = 2009;

    calculateCommon(row);

}

// ===============================
// ROPA 2019
// ===============================

function calculateROPA2019(row){

    row.ropaYear = 2019;

    calculateCommon(row);

}

// ===============================
// MASTER FUNCTION
// ===============================

function calculateSalary(row){

    switch(row.ropaYear){

        case 1981:
            calculateROPA1981(row);
            break;

        case 1990:
            calculateROPA1990(row);
            break;

        case 1998:
            calculateROPA1998(row);
            break;

        case 2009:
            calculateROPA2009(row);
            break;

        case 2019:
            calculateROPA2019(row);
            break;

        default:
            calculateCommon(row);

    }

}
