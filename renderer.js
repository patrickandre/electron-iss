// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const axios = require('axios')

let counter = 0;

/*setInterval(() => {
  counter++
  document.getElementsByTagName('pre')[0].innerHTML = counter
}, 1000);*/


// let interval = setInterval(() => {
//   getData()
// }, 2000);

let pre = document.createElement('pre');
document.body.appendChild(pre)

function getData() {
  axios.get('http://api.open-notify.org/iss-now.json')
    .then(function(response) {
      console.log(response.data)
      var lat = response.data['iss_position']['latitude'];
      var lon = response.data['iss_position']['longitude'];
      console.log(lat, lon);
      document.getElementsByTagName('pre')[0].innerHTML = `latitude: ${lat} <br>longitude: ${lon} 
    <br> <button id='st'> Stop Tracing </button>`;
    })
    .then(function() {
      stopTrace(); // hacky
    })
    .catch(function(error) {
      console.log(error);
    });
}


function stopTrace() {
  document.getElementById('st').addEventListener('click', function() {
    clearInterval(interval);
  });
}

var map = L.map('map').setView([0, 0], 4);


function moveISS() {
  axios.get('http://api.open-notify.org/iss-now.json')
    .then(function(response) {
      var lat = response.data['iss_position']['latitude'];
      var lon = response.data['iss_position']['longitude'];

      iss.setLatLng([lat, lon]);
      isscirc.setLatLng([lat, lon]);
      map.panTo([lat, lon], animate = true);
      document.getElementsByTagName('pre')[0].innerHTML = `latitude: ${lat} <br>longitude: ${lon} `;
    });
  setTimeout(moveISS, 1000);

}

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxZoom: 4,
}).addTo(map);

var ISSIcon = L.icon({
  iconUrl: 'ISSIcon.png',
  iconSize: [50, 30],
  iconAnchor: [25, 15],
  popupAnchor: [50, 25],
  shadowUrl: 'ISSIcon_shadow.png',
  shadowSize: [60, 40],
  shadowAnchor: [30, 15]
});


var iss = L.marker([0, 0], {
  icon: ISSIcon
}).addTo(map);
var isscirc = L.circle([0, 0], 1200e3, {
  color: "#c22",
  opacity: 0.3,
  weight: 1,
  fillColor: "#c22",
  fillOpacity: 0.1
}).addTo(map);

moveISS();