// Global Variables
let currentPage = 1;
let currentEndpoint = "";
const paginationNav = document.getElementById("pagination");
const tableComparative = document.getElementById("table-comparative");
const tableRegular = document.querySelector("#table-regular tbody");
const tablePremium = document.querySelector("#table-premium tbody");
let pages = document.querySelectorAll(".optionParent");
const stateSelect = document.getElementById("inputState");
const citySelect = document.getElementById("inputCity");
const neighborhoodSelect = document.getElementById("inputNeighborhood");
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
function eventListeners() {
  paginationNav.addEventListener("click", pagination);

  document.addEventListener("DOMContentLoaded", initialize);
  //update city selector
  stateSelect.addEventListener("change", updateCitySelector);

  //Filter button
  document.getElementById("submit").addEventListener("click", filter);

  //Search button
  document.getElementById("searchBtn").addEventListener("click", search);
  3;

  //Search nearby locations
  document.getElementById("locationBtn").addEventListener("click", geoFindMe);

  document
    .getElementById("quitarfiltro")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("general").style.display = "block";
      tableComparative.style.display = "none";
      this.style.display = "none";
      citySelect.innerHTML = "<option selected>Choose...</option>";

      //updata table
      updateTable();
      //update pagination
      currentPage = 1;
      document.getElementById(1).innerHTML = 1;
      document.getElementById(2).innerHTML = 2;
      document.getElementById(3).innerHTML = 3;
      updateSelection();
      document.getElementById("search").style.display = "none";
      document.getElementById("locationBtn").style.display = "block";
    });

  document
    .getElementById("removeLocationBtn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("removeLocationBtn").style.display = "none";
      document.getElementById("locationBtn").style.display = "block";
      document.getElementById("nearbyLocations").style.display = "none";
      document.getElementById("table-cointainer-general").style.display =
        "block";
      document.getElementById("pagination").style.display = "block";
    });

  document
    .getElementById("quitarBusqueda")
    .addEventListener("click", function (e) {
      e.preventDefault();

      //updata table
      updateTable(currentEndpoint);

      document.getElementById("pagination").style.display = "block";
      document.getElementById("quitarBusqueda").style.display = "none";
      document.getElementById("searchBtn").style.display = "block";

      document.getElementById("submit").click();
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
function initialize(e) {
  e.preventDefault();
  let html = "<option selected>Choose...</option>";
  states.forEach((estado) => {
    html += `<option> ${estado} </option>`;
  });
  stateSelect.innerHTML = html;

  updateTable();
}
//Update general table
function updateTable(endpoint, updateCurrentEndpoint = true) {
  if (endpoint !== undefined) {
    currentEndpoint = endpoint;
  } else {
    currentEndpoint = `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=${currentPage}&pageSize=15&fields=regular,premium,razonsocial,latitude,longitude,calle,codigopostal`;
  }

  readApi(currentEndpoint)
    .then((e) => {
      let html = "";
      const table = document.querySelector("#table-cointainer-body");
      table.innerHTML = "";
      document.getElementById("table-cointainer-general").style.display =
        "none";
      document.getElementById("loading-table").style.display = "block";

      if (e.results.length === 0) {
        document.getElementById(
          "loading-table"
        ).innerHTML = `<div class="table-cointainer">
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Error</th>
            </tr>
          </thead>
          <tbody id="table-cointainer-body">
            <tr>
              <td id="loading"><p>No se encontraron resultados</p></td>
              </tr>
          </tbody>
        </table>`;
      } else {
        e.results.forEach((sucursal, i) => {
          getInfo(sucursal.codigopostal).then((res) => {
            let tr = document.createElement("tr");
            html = `
                
                <td>${sucursal.razonsocial}</td>
                <td>${sucursal.regular}</td>
                <td>${sucursal.premium}</td>
                <td>${sucursal.calle}</td>
                <td>${res[0]}</td>
                <td>${res[1]}</td>
                <td><a target=”_blank” href="https://maps.google.com/?q=${sucursal.latitude},${sucursal.longitude}">Ver ubicación</a></td>
                
                `;
            tr.innerHTML = html;
            table.appendChild(tr);
            if (e.results.length - 1 === i) {
              document.getElementById(
                "table-cointainer-general"
              ).style.display = "block";
              document.getElementById("loading-table").style.display = "none";
            }
          });
        });
      }
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

//  update Neighborhood selector
function updateNeighborhood() {
  const citySelected = citySelect.options[citySelect.selectedIndex].value;
  let html = " <option selected>Choose...</option>";
  readApi(
    `https://api-sepomex.hckdrk.mx/query/get_colonia_por_municipio/${citySelected}`
  )
    .then((neighborhoods) => {
      neighborhoods.response.colonia.forEach((neighborhood) => {
        html += `
      <option>${neighborhood}</option>
      `;
      });
      neighborhoodSelect.innerHTML = html;
    })
    .catch((err) => console.log(err));
}

//FilterButton

function filter(e) {
  e.preventDefault();
  //update pagination
  currentPage = 1;
  document.getElementById(1).innerHTML = 1;
  document.getElementById(2).innerHTML = 2;
  document.getElementById(3).innerHTML = 3;
  updateSelection();
  updateNeighborhood();
  document.getElementById("search").style.display = "block";
  document.getElementById("locationBtn").style.display = "none";
  document.getElementById("removeLocationBtn").style.display = "none";
  document.getElementById("nearbyLocations").style.display = "none";

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
        currentEndpoint = `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=1&pageSize=5&${gasSelected}!=string()&${gasSelected}!=string(0)&codigopostal%3E=string(${minCp})&codigopostal%3C=string(${maxCp})&fields=regular,premium,razonsocial,latitude,longitude,calle,codigopostal,colonia`;
        updateTable(currentEndpoint);
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
        currentEndpoint = `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=1&pageSize=5&${gasSelected}!=string()&${gasSelected}!=string(0)&codigopostal%3E=string(${minCp})&codigopostal%3C=string(${maxCp})&fields=regular,premium,razonsocial,latitude,longitude,codigopostal,calle,colonia`;
        updateTable(currentEndpoint);
      })
      .catch((err) => console.log(err));

    //muestra quitar filtro
    document.getElementById("quitarfiltro").style.display = "block";
  }
}

// Search button

function search(e) {
  const stateSelected = stateSelect.options[stateSelect.selectedIndex].value;
  const citySelected = citySelect.options[citySelect.selectedIndex].value;
  const neighborhoodSelected =
    neighborhoodSelect.options[neighborhoodSelect.selectedIndex].value;

  let nameInput = document.getElementById("nameGasStation").value;

  document.getElementById("pagination").style.display = "none";
  document.getElementById("searchBtn").style.display = "none";
  document.getElementById("quitarBusqueda").style.display = "inline-block";

  if (neighborhoodSelect.value === "Choose..." && nameInput === "") {
    alert("Ingresa un valor");
  } else if (neighborhoodSelect.value === "Choose...") {
    let endpoint = "";
    endpoint = currentEndpoint + `&razonsocial=/${nameInput}/i`;
    updateTable(endpoint);
  } else if (nameInput === "" && neighborhoodSelect.value !== "Choose...") {
    readApi(
      `https://api-sepomex.hckdrk.mx/query/search_cp_advanced/${stateSelected}?limit=10&municipio=${citySelected}&colonia=${neighborhoodSelected}`
    )
      .then((res) => {
        const minCp = Math.min(...res.response.cp);
        const maxCp = Math.max(...res.response.cp);
        updateTable(
          `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=1&pageSize=10&codigopostal%3E=string(${minCp})&codigopostal%3C=string(${maxCp})&fields=regular,premium,razonsocial,latitude,longitude,codigopostal,calle,colonia&colonia=/${neighborhoodSelected}/i`
        );
      })
      .catch((err) => console.log(err));
  } else {
    readApi(
      `https://api-sepomex.hckdrk.mx/query/search_cp_advanced/${stateSelected}?limit=10&municipio=${citySelected}&colonia=${neighborhoodSelected}`
    )
      .then((res) => {
        const minCp = Math.min(...res.response.cp);
        const maxCp = Math.max(...res.response.cp);

        updateTable(
          `https://api.datos.gob.mx/v1/precio.gasolina.publico?page=1&pageSize=10&codigopostal%3E=string(${minCp})&codigopostal%3C=string(${maxCp})&fields=regular,premium,razonsocial,latitude,longitude,codigopostal,calle,colonia&colonia=/${neighborhoodSelected}/i&razonsocial=/${nameInput}/i`
        );
      })
      .catch((err) => console.log(err));
  }
}

// Get state and city
async function getInfo(cpInput) {
  let cp;
  if (cpInput.length === 4) {
    cp = `0${cpInput}`;
  } else {
    cp = cpInput;
  }

  let response = [];
  await fetch(`https://api-sepomex.hckdrk.mx/query/info_cp/${cp}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.error !== true) {
        response.push(res[0].response.estado);
        response.push(res[0].response.municipio);
      }
    })
    .catch((res) => console.log(res));

  return response;
}

//Pagination
function pagination(e) {
  e.preventDefault();

  //Botones intermedios;
  if (e.target.classList.contains("option")) {
    currentPage = Number(e.target.innerHTML);
    let endpoint = currentEndpoint.replace(/page=\d+/g, `page=${currentPage}`);
    updateTable(endpoint);
    updateSelection();
  }

  //Next
  if (e.target.id === "next") {
    currentPage += 1;

    let endpoint = currentEndpoint.replace(/page=\d+/g, `page=${currentPage}`);
    updateTable(endpoint);
    updatePagination();
    updateSelection();
  }

  if (currentPage != 1) {
    document
      .getElementById("previous")
      .parentElement.classList.remove("disabled");
    if (e.target.id === "previous") {
      if (e.target.id !== "1") {
        currentPage -= 1;
        updatePagination();
        let endpoint = currentEndpoint.replace(
          /page=\d+/g,
          `page=${currentPage}`
        );
        updateTable(endpoint);
        updateSelection();
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

function updateSelection() {
  pages.forEach((element) => {
    element.classList.remove("active");
    if (Number(element.firstElementChild.innerHTML) === currentPage) {
      element.classList.add("active");
    }
  });
}

//Finds your current position
function geoFindMe() {
  if (!navigator.geolocation) {
    console.log("No es soportado por tu navegador");
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    searchNearbyLocations(latitude, longitude);
  }

  function error() {
    console.log("error");
    return "error";
  }
}

//fetch nearby table
function searchNearbyLocations(latitude, longitude) {
  const nearbyLocationTable = document.getElementById("nearbyLocations");
  document.getElementById("table-cointainer-general").style.display = "none";
  paginationNav.style.display = "none";
  document.getElementById("loading-table").style.display = "block";
  document.getElementById("locationBtn").style.display = "none";

  fetch(
    "https://api.datos.gob.mx/v2/precio.gasolina.publico?page=1&pageSize=10018&regular!=string()"
  )
    .then((res) => res.json())
    .then((sucursales) => {
      sucursales.results.forEach((sucursal) => {
        sucursal.distance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          sucursal.latitude,
          sucursal.longitude
        );
      });
      sucursales.results.sort(function (a, b) {
        return a.distance - b.distance;
      });
      const sucursalesCercanas = sucursales.results.slice(0, 15);

      sucursalesCercanas.forEach((sucursal, i) => {
        getInfo(sucursal.codigopostal).then((res) => {
          let tr = document.createElement("tr");
          html = `
              
              <td>${sucursal.razonsocial}</td>
              <td>${sucursal.regular}</td>
              <td>${sucursal.premium}</td>
              <td>${sucursal.calle}</td>
              <td>${res[0]}</td>
              <td>${res[1]}</td>
              <td><a target=”_blank” href="https://maps.google.com/?q=${sucursal.latitude},${sucursal.longitude}">Ver ubicación</a></td>
              
              `;
          tr.innerHTML = html;
          nearbyLocationTable.firstElementChild.appendChild(tr);
          if (sucursalesCercanas.length - 1 === i) {
            nearbyLocationTable.style.display = "block";
            document.getElementById("loading-table").style.display = "none";
            document.getElementById("removeLocationBtn").style.display =
              "block";
          }
        });
      });
    });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
