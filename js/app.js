// Global Variables
const paginationNav = document.getElementById("pagination");
let currentPage = 1;
let pages = document.querySelectorAll(".optionParent");

//Event Listeners
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", updateTable);
  paginationNav.addEventListener("click", pagination);
}

//Functions

async function readApi() {
  const result = await fetch(
    `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=${currentPage}&pageSize=15&fields=regular,premium,razonsocial`
  );

  //Procede cuando la resupuesta este completa
  const datos = await result.json();

  return datos;
}

function updateTable(params) {
  readApi()
    .then((e) => {
      let html = "";
      e.results.forEach((sucursal) => {
        html += `
                <tr>
                <td>${sucursal.razonsocial}</td>
                <td>${sucursal.regular}</td>
                <td>${sucursal.premium}</td>
                </tr>
                `;
      });

      const table = document.querySelector(".table tbody");
      table.innerHTML = html;
    })
    .catch((err) => console.error(err));

  
}

function pagination(e) {
  e.preventDefault();
   
  
  //Botones intermedios;
  if (e.target.classList.contains("option")) {
    currentPage= Number(e.target.innerHTML);
    updateTable();
    updateSelection(e);
    console.log(currentPage);
  }

  //Next
  if(e.target.id === "next"){
    currentPage +=  1;
    updatePagination();
    updateTable();
    updateSelection(e);
    console.log(currentPage);
    
  }

  if(currentPage != 1){
    document.getElementById("previous").parentElement.classList.remove("disabled");
    if(e.target.id ==="previous"){
        if(e.target.id !== "1"){
            currentPage -=  1;
            updatePagination();
            updateTable();
            updateSelection(e);
        }
      }
} else{
 document.getElementById("previous").parentElement.classList.add("disabled");
}
  //Previous
 
}

function updatePagination() {
    if(currentPage > document.getElementById(3).innerHTML){
        document.getElementById(1).innerHTML = Number(document.getElementById(1).innerHTML) + 1;
        document.getElementById(2).innerHTML = Number(document.getElementById(2).innerHTML) + 1;
        document.getElementById(3).innerHTML = Number(document.getElementById(3).innerHTML) + 1;
    } else if(currentPage < document.getElementById(1).innerHTML){
        document.getElementById(1).innerHTML = Number(document.getElementById(1).innerHTML) - 1;
        document.getElementById(2).innerHTML = Number(document.getElementById(2).innerHTML) - 1;
        document.getElementById(3).innerHTML = Number(document.getElementById(3).innerHTML) - 1;
    }
}

function updateSelection(e) {
    pages.forEach(element => {
        element.classList.remove("active");
        if(Number(element.firstElementChild.innerHTML) === currentPage){
            element.classList.add("active");
        }
    });
    
    
}