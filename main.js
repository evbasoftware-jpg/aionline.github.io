// main.js
// Generated modular scaffold

let rows=[];

function el(id){return document.getElementById(id);}

function formatDate(dateObj){
  let d=dateObj.getDate(),m=dateObj.getMonth()+1,y=dateObj.getFullYear();
  return (d<10?"0"+d:d)+"/"+(m<10?"0"+m:m)+"/"+y;
}

window.addEventListener("load",updateHeaderTop);
window.addEventListener("resize",updateHeaderTop);

function updateHeaderTop(){
  const panel=el("topPanel");
  if(!panel)return;
  const h=panel.offsetHeight;
  document.querySelectorAll("thead th").forEach(th=>th.style.top=h+"px");
}

function autoFillBasicAndROPA(){
  const dojStr=el("dojInput").value;
  const cat=el("category").value;
  if(!dojStr)return;
  const doj=new Date(dojStr);
  const ropa=[
    {id:"r1981",end:new Date("1990-02-28"),year:1981},
    {id:"r1990",end:new Date("1999-02-28"),year:1990},
    {id:"r1998",end:new Date("2009-03-31"),year:1998},
    {id:"r2009",end:new Date("2019-12-31"),year:2009},
    {id:"r2019",end:new Date("2099-12-31"),year:2019}
  ];
  let found=false;
  ropa.forEach(r=>{
    if(!found && doj<r.end){
      el(r.id).value=dojStr;
      el("basicInput").value=ENTRY_PAY[r.year][cat];
      found=true;
    }
  });
}

function generate(){
  const doj=new Date(el("dojInput").value);
  const dor=new Date(el("dorInput").value);
  if(isNaN(doj)||isNaN(dor)){alert("Please select DOJ and DOR");return;}
  rows=[];
  let currentBasic=Number(el("basicInput").value);

  const cfg=[
    {title:"ROPA 1981",year:1981,start:el("r1981").value,end:"1990-12-31",ma:15},
    {title:"ROPA 1990",year:1990,start:el("r1990").value,end:"1995-12-31",ma:30},
    {title:"ROPA 1998",year:1998,start:el("r1998").value,end:"2005-12-31",ma:100},
    {title:"ROPA 2009",year:2009,start:el("r2009").value,end:"2019-12-31",ma:300},
    {title:"ROPA 2019",year:2019,start:el("r2019").value,end:"2099-12-31",ma:500}
  ];

  let started=false;
  cfg.forEach((r,idx)=>{
    if(!r.start)return;
    let s=new Date(r.start),e=new Date(r.end);
    if(e>dor)e=dor;
    if(doj>e)return;
    let loop=(!started && doj>=s)?new Date(doj):new Date(s);
    started=true;
    rows.push({isHeader:true,title:r.title});
    while(loop<=e){
      let row={
        date:new Date(loop),
        ropaYear:r.year,
        basic:currentBasic,
        ADD:0,DA:0,HRA:0,MA:r.ma,IR:0,
        GPF:Math.round(currentBasic*0.06),
        GI:60,PTAX:0,gross:0,net:0
      };
      calculateSalary(row);
      rows.push(row);
      loop.setMonth(loop.getMonth()+1);
    }
    if(idx<cfg.length-1){
      currentBasic=Math.round((currentBasic*FITMENT[cfg[idx+1].year])/100)*100;
    }
  });
  render();
}

function updateValue(index,field,value){
  let v=Number(value); if(isNaN(v))v=0;
  rows[index][field]=v;
  calculateSalary(rows[index]);
  render();
}

function render(){
  const tbody=el("tbody");
  tbody.innerHTML="";
  rows.forEach((r,idx)=>{
    const tr=document.createElement("tr");
    if(r.isHeader){
      tr.innerHTML=`<td colspan="14" class="ropa-header">${r.title}</td>`;
    }else{
      tr.innerHTML=`
<td>${formatDate(r.date)}</td>
<td><input class="edit-input" type="number" value="${r.basic}" onchange="updateValue(${idx},'basic',this.value)"></td>
<td>${((r.daRate||0)*100).toFixed(0)}%</td>
<td>${((r.hraRate||0)*100).toFixed(0)}%</td>
<td>${r.ADD}</td><td>${r.DA}</td>
<td><input class="edit-input" type="number" value="${r.HRA}" onchange="updateValue(${idx},'HRA',this.value)"></td>
<td><input class="edit-input" type="number" value="${r.MA}" onchange="updateValue(${idx},'MA',this.value)"></td>
<td>${r.IR}</td><td>${r.gross}</td>
<td><input class="edit-input" type="number" value="${r.GPF}" onchange="updateValue(${idx},'GPF',this.value)"></td>
<td><input class="edit-input" type="number" value="${r.PTAX}" onchange="updateValue(${idx},'PTAX',this.value)"></td>
<td><input class="edit-input" type="number" value="${r.GI}" onchange="updateValue(${idx},'GI',this.value)"></td>
<td>${r.net}</td>`;
    }
    tbody.appendChild(tr);
  });
}

