// Global Variables
let currentPage = 1;
const paginationNav = document.getElementById("pagination");
const tableComparative = document.getElementById("table-comparative");
const tableRegular = document.querySelector("#table-regular tbody");
const tablePremium = document.querySelector("#table-premium tbody");
let pages = document.querySelectorAll(".optionParent");
const stateSelect = document.getElementById("inputState");
const citySelect = document.getElementById("inputCity");
const states = [
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
  "Zacatecas",
];

//Event Listeners
eventListeners();
updateTable();
function eventListeners() {
  
  paginationNav.addEventListener("click", pagination);

  //update city selector
  stateSelect.addEventListener("change", updateCitySelector);

  //Filter button
  document.getElementById("submit").addEventListener("click", filter);


  document
    .getElementById("quitarfiltro")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("general").style.display = "block";
      tableComparative.style.display = "none";
      this.style.display = "none";
      citySelect.innerHTML = "<option selected>Choose...</option>";
    });
}

//Functions

// readapi function
async function readApi(endpoint) {
  const result = await fetch(endpoint);

  //Procede cuando la resupuesta este completa
  const datos = await result.json();

  return datos;
}

//Update general table
function updateTable(endpoint = `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=${currentPage}&pageSize=15&fields=regular,premium,razonsocial,latitude,longitude,calle`) {
  let html = "<option selected>Choose...</option>";
  states.forEach((estado) => {
    html += `<option> ${estado} </option>`;
  });
  stateSelect.innerHTML = html;

  readApi(endpoint)
    .then((e) => {
      let html = "";
      e.results.forEach((sucursal) => {
        html += `
                <tr>
                <td>${sucursal.razonsocial}</td>
                <td>${sucursal.regular}</td>
                <td>${sucursal.premium}</td>
                <td>${sucursal.calle}</td>
                <td><a target=”_blank” href="https://maps.google.com/?q=${sucursal.latitude},${sucursal.longitude}">Ver ubicación</a></td>
                </tr>
                `;
      });

      const table = document.querySelector("#table-cointainer-body");
      table.innerHTML = html;
    })
    .catch((err) => console.error(err));
}

//Update City selector
function updateCitySelector() {
  const stateSelected = stateSelect.options[stateSelect.selectedIndex].value;
  let html = " <option selected>Choose...</option>";
  readApi(
    `https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/${stateSelected}`
  )
    .then((cities) => {
      cities.response.municipios.forEach((city) => {
        html += `
      <option>${city}</option>
      `;
      });
      citySelect.innerHTML = html;
    })
    .catch((err) => console.log(err));
}

//FilterButton

function filter(e) {
  e.preventDefault();
  const gasSelect = document.getElementById("inputGas");
  const stateSelected = stateSelect.options[stateSelect.selectedIndex].value;
  const citySelected = citySelect.options[citySelect.selectedIndex].value;
  const gasSelected = gasSelect.options[gasSelect.selectedIndex].value;

  //checo si esta seleccionada o no una ciudad, para ver si se busca por estado o por ciudad
  if (citySelected === "Choose..." && stateSelected === "Choose...") {
    alert("Selecciona un estado o ciudad");
  } else if (citySelected === "Choose...") {
    readApi(
      `https://api-sepomex.hckdrk.mx/query/get_cp_por_estado/${stateSelected}`
    )
      .then((res) => {
        const minCp = Math.min(...res.response.cp);
        const maxCp = Math.max(...res.response.cp);

        tableComparative.style.display = "block";

        //tabla mas baratas
        fetch(
          `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=1&pageSize=5&${gasSelected}!=string()&${gasSelected}!=string(0)&codigopostal%3E=string(${minCp})&codigopostal%3C=string(${maxCp})&sort=${gasSelected}&fields=regular,premium,razonsocial,latitude,longitude`
        )
          .then((res) => res.json())
          .then((res) => {
            let html = "";
            res.results.forEach((sucursal) => {
              html += `
          <tr>
          <td>${sucursal.razonsocial}</td>
          <td>${sucursal.regular}</td>
          <td>${sucursal.premium}</td>
          <td><a target=”_blank” href="https://maps.google.com/?q=${sucursal.latitude},${sucursal.longitude}">Ver ubicación</a></td>
          </tr>
          `;
            });

            tableRegular.innerHTML = html;
          })
          .catch((err) => console.log(err));

        //tabla mas caras

        fetch(
          `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=1&pageSize=5&${gasSelected}!=string()&${gasSelected}!=string(0)&codigopostal%3E=string(${minCp})&codigopostal%3C=string(${maxCp})&sort=-${gasSelected}&fields=regular,premium,razonsocial,latitude,longitude`
        )
          .then((res) => res.json())
          .then((res) => {
            let html = "";
            res.results.forEach((sucursal) => {
              html += `
          <tr>
          <td>${sucursal.razonsocial}</td>
          <td>${sucursal.regular}</td>
          <td>${sucursal.premium}</td>
          <td><a target=”_blank” href="https://maps.google.com/?q=${sucursal.latitude},${sucursal.longitude}">Ver ubicación</a></td>
          </tr>
          `;
            });

            tablePremium.innerHTML = html;
          })
          .catch((err) => console.log(err));
          updateTable(`https://api.datos.gob.mx/v1/precio.gasolina.publico?page=1&pageSize=5&${gasSelected}!=string()&${gasSelected}!=string(0)&codigopostal%3E=string(${minCp})&codigopostal%3C=string(${maxCp})&fields=regular,premium,razonsocial,latitude,longitude,calle`)
      })
      .catch((err) => console.log(err));
    //muestra quitar filtro
    document.getElementById("quitarfiltro").style.display = "block";
  } else {
    readApi(
      `https://api-sepomex.hckdrk.mx/query/search_cp_advanced/${stateSelected}?municipio=${citySelected}`
    )
      .then((res) => {
        const minCp = Math.min(...res.response.cp);
        const maxCp = Math.max(...res.response.cp);

        tableComparative.style.display = "block";

        //tabla mas baratas
        fetch(
          `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=1&pageSize=5&${gasSelected}!=string()&${gasSelected}!=string(0)&codigopostal%3E=string(${minCp})&codigopostal%3C=string(${maxCp})&sort=${gasSelected}&fields=regular,premium,razonsocial,latitude,longitude`
        )
          .then((res) => res.json())
          .then((res) => {
            let html = "";
            res.results.forEach((sucursal) => {
              html += `
          <tr>
          <td>${sucursal.razonsocial}</td>
          <td>${sucursal.regular}</td>
          <td>${sucursal.premium}</td>
          <td><a target=”_blank” href="https://maps.google.com/?q=${sucursal.latitude},${sucursal.longitude}">Ver ubicación</a></td>
          </tr>
          `;
            });

            tableRegular.innerHTML = html;
          })
          .catch((err) => console.log(err));

        //tabla mas caras

        fetch(
          `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=1&pageSize=5&${gasSelected}!=string()&${gasSelected}!=string(0)&codigopostal%3E=string(${minCp})&codigopostal%3C=string(${maxCp})&sort=-${gasSelected}&fields=regular,premium,razonsocial,latitude,longitude`
        )
          .then((res) => res.json())
          .then((res) => {
            let html = "";
            res.results.forEach((sucursal) => {
              html += `
          <tr>
          <td>${sucursal.razonsocial}</td>
          <td>${sucursal.regular}</td>
          <td>${sucursal.premium}</td>
          <td><a target=”_blank” href="https://maps.google.com/?q=${sucursal.latitude},${sucursal.longitude}">Ver ubicación</a></td>
          </tr>
          `;
            });

            tablePremium.innerHTML = html;
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    //muestra quitar filtro
    document.getElementById("quitarfiltro").style.display = "block";
  }
}

//Pagination
function pagination(e) {
  e.preventDefault();

  //Botones intermedios;
  if (e.target.classList.contains("option")) {
    currentPage = Number(e.target.innerHTML);
    updateTable();
    updateSelection(e);
    console.log(currentPage);
  }

  //Next
  if (e.target.id === "next") {
    currentPage += 1;
    updatePagination();
    updateTable();
    updateSelection(e);
  }

  if (currentPage != 1) {
    document
      .getElementById("previous")
      .parentElement.classList.remove("disabled");
    if (e.target.id === "previous") {
      if (e.target.id !== "1") {
        currentPage -= 1;
        updatePagination();
        updateTable();
        updateSelection(e);
      }
    }
  } else {
    document.getElementById("previous").parentElement.classList.add("disabled");
  }
  //Previous
}

function updatePagination() {
  if (currentPage > document.getElementById(3).innerHTML) {
    document.getElementById(1).innerHTML =
      Number(document.getElementById(1).innerHTML) + 1;
    document.getElementById(2).innerHTML =
      Number(document.getElementById(2).innerHTML) + 1;
    document.getElementById(3).innerHTML =
      Number(document.getElementById(3).innerHTML) + 1;
  } else if (currentPage < document.getElementById(1).innerHTML) {
    document.getElementById(1).innerHTML =
      Number(document.getElementById(1).innerHTML) - 1;
    document.getElementById(2).innerHTML =
      Number(document.getElementById(2).innerHTML) - 1;
    document.getElementById(3).innerHTML =
      Number(document.getElementById(3).innerHTML) - 1;
  }
}

function updateSelection(e) {
  pages.forEach((element) => {
    element.classList.remove("active");
    if (Number(element.firstElementChild.innerHTML) === currentPage) {
      element.classList.add("active");
    }
  });
}
