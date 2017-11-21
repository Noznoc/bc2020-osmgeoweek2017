mapboxgl.accessToken = 'pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/julconz/cj725p6pj1c272spmrrgseoly',
  center: [-99.93, 54.32],
  zoom: 4,
  maxZoom: 22,
  minZoom: 3,
  maxBounds: [-168.39312,40.713956,-50.971241,83.359511],
  hash: true,
  logoPosition: 'bottom-right'
});

var days = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

function flyTo(coordinates, zoom, object, total, contributors, location){
  map.flyTo({center: coordinates, zoom: zoom})
  document.getElementById('task-buttons').style.display = 'block';
  document.getElementById('stats').style.display = 'block';
  document.getElementById('stats').innerHTML = '<h3>Between Nov 10-20, ' + total + ' buildings were mapped by ' + contributors + ' contributors in ' + location + '.</h3>';
  document.getElementById('task').href = 'http://tasks.osmcanada.ca/project/' + object.value;  
}

// filter by time
function filterBy(day){
	var layers = ['bc2020-buildings-points', 'bc2020-buildings-polygons', 'bc2020-buildings-lines'];
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

  // create popup
  var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

  // hover events for popup
  map.on('click', 'bc2020-buildings-polygons', function(e) {
    var text;
    map.getCanvas().style.cursor = 'pointer';
    console.log(e.features[0].properties.id.split("way/")[1])
    text = '<div class="buttons"><a href="https://www.openstreetmap.org/edit?editor=id&way=' + e.features[0].properties.id.split("way/")[1] + '" target="_blank"><button>Edit in iD</button></a></div>';

    // populate popup content
    popup.setLngLat(e.lngLat)
      .setHTML(text)
      .addTo(map);
  });

  map.on('move', 'bc2020-buildings-polygons', function(e) {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
});