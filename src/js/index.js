const FlightDate = document.getElementById("data");
const Pilot = document.getElementById("pilot");
const Competition = document.getElementById("competition");
const Model = document.getElementById("model");
const startTime = document.getElementById("startTime");
const finishTime = document.getElementById("finishTime")
const Form = document.getElementById("form");
const Input = document.getElementById("igcInput");
const mapcontainer = document.getElementById("map");


// import igcParser from "../node_modules/igc-parser/index.js";
const igcParser = require("igc-parser")

const initMap = (latitude, longitude, finishLat, finishLong) => {
    let container = L.DomUtil.get(mapcontainer);
    if (container != null) {
        container._leaflet_id = null;
    }
    const map = L.map(mapcontainer, {
        renderer: L.canvas()
    }).setView([latitude, longitude], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).bindPopup("start").openPopup().addTo(map)
    L.marker([finishLat, finishLong]).bindPopup("finish").openPopup().addTo(map)


}



const cors = "https://cors-anywhere.herokuapp.com/";
const url = "https://xcportal.pl/sites/default/files/tracks/2020-06-09/069daro396091568.igc";
const defaultApi = `${cors}${url}`;

const FetchData = (api) => {
    fetch(api, {
        method: "GET",
        mode: "cors",
        headers: {
            'Content-Type': 'application/text',
        },
    })
        .then(response => response.text())
        .then(data => {
            const igcData = igcParser.parse(data);
            const { date, pilot, competitionClass, gliderType, fixes } = igcData
            const startFlight = {
                time: fixes[0].time,
                lat: fixes[0].latitude,
                long: fixes[0].longitude
            }
            const finishFlight = {
                time: fixes[fixes.length - 1].time,
                lat: fixes[fixes.length - 1].latitude,
                long: fixes[fixes.length - 1].longitude
            }
            Pilot.textContent = pilot.toUpperCase();
            FlightDate.textContent = date;
            startTime.textContent = startFlight.time;
            finishTime.textContent = finishFlight.time;
            Competition.textContent = competitionClass.toUpperCase();
            Model.textContent = gliderType ? gliderType.toUpperCase() : "brak danych"
            initMap(startFlight.lat, startFlight.long, finishFlight.lat, finishFlight.long)
        })
}


Form.addEventListener("submit", (e) => {
    e.preventDefault();
    let value = Input.value;
    const url = `${cors}${value}`
    FetchData(url)
    Input.value = ""
})
window.onload = function () {
    FetchData(defaultApi);
};