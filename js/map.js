$(document).ready(function () {
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
});
