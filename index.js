window.onload = function() {init()}; // Initialize TableTop on window load
			
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1IKvJUsED-w9hAmnbId3OqVCqRS_jMgyr-2rXaZ8L7mY/edit?usp=sharing';

mapboxgl.accessToken = 'pk.eyJ1IjoianVsY29ueiIsImEiOiJjaWo1eHJqd2YwMDFkMXdtM3piZndjNzlxIn0.3fMbo8z3SxitKnkoNkZ2jw';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/julconz/cja00smvy92252sob26ardnrv',
  center: [-97.47, 60.72],
  zoom: 3
});

function init() { // Function that initializes TableTop. Tabletop will pull the data from the Google Sheet that stores all the da
	Tabletop.init( { 
		key: public_spreadsheet_url,
		callback: showInfo,
		simpleSheet: true 
	} )
}

var features = [];
var years = [];

function showInfo(data, tabletop) { // Function to show data from Google Sheet
	
	data.forEach(function(data) {
		if (data.lng) {
			// store all lat, lng as geojson features
			var coordinates = [parseFloat(data.lng), parseFloat(data.lat)];
			var year = parseInt(data.date_set.substr(0, 4));
			
			features.push(JSON.parse('{"type":"Feature","properties":{"description":"' + data.community + '","date_revoked":"' + data.date_revoked + '","population":' + parseInt(data.population_int) + ',"year":' + year + ',"date_set":"' + data.date_set + '"},"geometry":{"type":"Point","coordinates":[' +  coordinates + ']}}'));

			// store all years
			if (years.indexOf(year) == -1){
				years.push(year);
			}
		}
	});

	// sort years
	years.sort(function(a, b){return a-b})

	// load map
	renderMap(features);

	// filter by time
	function filterBy(year){
		var filters = ['<=', 'year', year];
		map.setFilter('water-advisories', filters);
		document.getElementById('year').textContent = "Since " + year;
	}

	// render map
	function renderMap(features) {
		
		// add data as a geojson source
		map.addSource('markers', {
			type: 'geojson',
			data: {
				'type': 'FeatureCollection',
				'features': features
			}
		});

		// add water advisory data as a layer
		map.addLayer({
			id: 'water-advisories',
			type: 'circle',
			source: 'markers',
			paint: {
				'circle-color': {
					property: 'date_revoked',
					default: '#252726',
					type: 'categorical',
					stops: [
						['None', '#893838'],
					]
				}, 
				'circle-radius': {
					property: 'population',
					type: 'interval',
					stops: [
						[5, 2],
						[10, 3],
						[20, 4],
						[30, 5],
						[40, 6],
						[50, 7]
					]
				}
			}
		});

		// initial filter
		filterBy(years[0]);

		// create popup
		var popup = new mapboxgl.Popup({
	        closeButton: false,
	        closeOnClick: false
	    });

		// hover events for popup
		map.on('mouseenter', 'water-advisories', function(e) {
			var text;
			map.getCanvas().style.cursor = 'pointer';

			// set popup text
			if (e.features[0].properties.date_revoked !== 'None'){
				text = '<h2>' + e.features[0].properties.description + '</h2><h3>Date Set: ' + e.features[0].properties.date_set + '<br>Date Revoked: ' + e.features[0].properties.date_revoked + '</h3>';
			} else {
				text = '<h2>' + e.features[0].properties.description + '</h2><h3>Date Set: ' + e.features[0].properties.date_set + '</h3>';
			}

			// populate popup content
			popup.setLngLat(e.features[0].geometry.coordinates)
				.setHTML(text)
				.addTo(map);
		});

		map.on('mouseleave', 'water-advisories', function(e) {
			map.getCanvas().style.cursor = '';
			popup.remove();
		});

		// when time slider is moved filter the data
        document.getElementById('slider').addEventListener('input', function(e) {
            filterBy(years[e.target.value]);
        });

        console.log(map.getSource('markers'));
	}
}