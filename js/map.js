$(document).ready(function () {
	function initListeners() {
		$(document).on('getMarkers:click', _showMarkers);
		$(document).on('marker:added', _markerAdded);
		// $(document).on('marker:remove', _markerRemove);
	}

	function _showMarkers() {
		console.log(mapWorker.getMarkers());
		var markers = mapWorker.getMarkers(),
			coords = [];

		markers.forEach(function(marker) {
			coords.push({
				lat: marker.position.lat(),
				lng: marker.position.lng()
			});
		});

		var polygon = _createPolygon(coords);
		polygon.setMap(map);
		polygons.push(polygon);
		polygon.index = polygons.indexOf(polygon);
		$(document).trigger('polygon:added', polygon);
	}

	function _createPolygon(coords) {
		return new google.maps.Polygon({
			paths: coords,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35
		});
	}

	function _markerAdded(e, marker) {
		console.log(arguments);
	}
	function _markerRemove(e, marker) {
		mapWorker.removeMarker({
			marker: marker
		});
		_showMarkers();
	}

	var mapWorker = new DigitalUkraine.MapWorker(),
		menu,
		polygons = [],
		map;
	
	mapWorker.initMap({
		containerID: "map", 
		mapCenter: {lat: 49.84183, lng: 24.03148}, // Lviv center
		mapZoom: 8
	});
	
	map = mapWorker.getMap();
	menu = new DigitalUkraine.Menu(map, mapWorker);

	menu.init();
	
	// ========= MARKERS EXAMPLE USAGE =========
	
	// Add map click listener
	google.maps.event.addListener(map, 'click', function (e) {
		var marker = mapWorker.placeMarker({
			position: e.latLng,
			// icon: "http://d2zk8zqyfisjls.cloudfront.net/Content/Images/Layout/red-color-dot.png",
			title: "TEST TITLE",
			description: "This is test description <br /> with <u>html</u> into itself. <br /> <span style='color: red;'>Right click into me to remove me</span>"
		});
		
		// Add right click listener on marker
		google.maps.event.addListener(marker, 'rightclick', function (e) {
			mapWorker.removeMarker({
				marker: marker
			});
		});
	});
	initListeners();
});
