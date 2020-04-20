// Global Variables
const paginationNav = document.getElementById("pagination");
let currentPage = 1;
let pages = document.querySelectorAll(".optionParent");
const estadosSelect = document.getElementById("inputState");
const citySelect = document.getElementById("inputCity");
const estados = [
  "Ciudad de México",
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Coahuila de Zaragoza",
  "Colima",
  "Chiapas",
  "Chihuahua",
  "Durango",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "México",
  "Michoacán de Ocampo",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz de Ignacio de la Llave",
  "Yucatán",
  "Zacatecas"
];


//Event Listeners
eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", updateTable);
  paginationNav.addEventListener("click", pagination);

  //update city selector
  estadosSelect.addEventListener("change",updateCitySelector);
}

//Functions

async function readApi(endpoint) {
  const result = await fetch(endpoint);

  //Procede cuando la resupuesta este completa
  const datos = await result.json();

  return datos;
}

function updateTable() {

  
  let html = "<option selected>Choose...</option>"
  estados.forEach(estado => {
      html += `<option> ${estado} </option>`
  });
  estadosSelect.innerHTML = html;




  readApi(`https://api.datos.gob.mx/v1/precio.gasolina.publico?page=${currentPage}&pageSize=15&fields=regular,premium,razonsocial,latitude,longitude`)
    .then((e) => {
      let html = "";
      e.results.forEach((sucursal) => {
        html += `
                <tr>
                <td>${sucursal.razonsocial}</td>
                <td>${sucursal.regular}</td>
                <td>${sucursal.premium}</td>
                <td><a target=”_blank” href="https://maps.google.com/?q=${sucursal.latitude},${sucursal.longitude}">Ver ubicación</a></td>
                </tr>
                `;
      });

      const table = document.querySelector(".table tbody");
      table.innerHTML = html;
    })
    .catch((err) => console.error(err));
}


//Update City selector

function updateCitySelector() {

  const stateSelected = estadosSelect.options[estadosSelect.selectedIndex].value
  let html =" <option selected>Choose...</option>"
  fetch(`https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/${stateSelected}`)
  .then(res => res.json())
  .then(cities => {
    cities.response.municipios.forEach(city => {
      
      html += `
      <option>${city}</option>
      `
    });
    citySelect.innerHTML = html;
  })
  .catch(err => console.log(err));

  
}






//Pagination
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