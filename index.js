mapboxgl.accessToken = 'pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/julconz/cj725p6pj1c272spmrrgseoly',
  center: [-99.93, 54.32],
  zoom: 4,
  maxZoom: 16,
  minZoom: 3,
  maxBounds: [-168.39312,40.713956,-50.971241,83.359511]
});

var days = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
var universities = [[""]]

function flyTo(coordinates){
  map.flyTo({center: coordinates, zoom: 14})
}

// filter by time
function filterBy(day){
	var layers = ['bc2020-buildings-points', 'bc2020-buildings-polygons'];
	var filters = ['<=', 'timestamp', "201711" + day];
	layers.forEach(function(layer) {
      map.setFilter(layer, filters);
    });	
	document.getElementById('day').textContent = 'November ' + day + ', 2017'; 
}

// render map
map.on('load', function(){

	// initial filter
	filterBy(days[0]);

	// when time slider is moved filter the data
  document.getElementById('slider').addEventListener('input', function(e) {
      filterBy(days[e.target.value]);
  });
});