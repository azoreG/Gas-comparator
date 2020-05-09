class UI {
    constructor() {
        
        //Crear los markers con LayerGroup
        this.markers = new L.LayerGroup();

         // Iniciar el mapa
         this.mapa = this.inicializarMapa();

    }

    inicializarMapa() {
         // Inicializar y obtener la propiedad del mapa
         const map = L.map('map').setView([19.390519, -99.3739778], 6);
         const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
         L.tileLayer(
             'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: '&copy; ' + enlaceMapa + ' Contributors',
             maxZoom: 18,
             }).addTo(map);
         return map;

    }


    mostrarPines(datos,latitude,longitude){
        //Limpiar los markers
        this.markers.clearLayers();
        this.mapa.setView([latitude, longitude], 15)
        //recorres los establecimientos

        datos.forEach(dato => {
            //destructuring
            const {latitude,longitude,regular,premium,calle,distance} = dato;

            //Crear popUp
            const opcionesPopUp = L.popup()
                .setContent(`
                <p>Address: ${calle}</p>
                <p><b>Regular:</b> ${regular}</p>
                <p><b>Premium:</b> ${premium}</p>
                <p><b>Distance:</b> ${distance.toFixed(2)} km</p>
                `);

            //Agregar el pin
            const marker = new L.marker([
                parseFloat(latitude),
                parseFloat(longitude)
            ]).bindPopup(opcionesPopUp);


            this.markers.addLayer(marker);
        });

        this.markers.addTo(this.mapa);
    }

   
}

