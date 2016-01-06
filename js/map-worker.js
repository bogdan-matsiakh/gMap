if (!window.DigitalUkraine) window.DigitalUkraine = {};
if (!window.DigitalUkraine.MapWorker) window.DigitalUkraine.MapWorker = function () {
	var _map = null,
		_initMap = function (args) {
			if ((args.containerID === undefined) ||
				(args.mapCenter === undefined) ||
				(args.mapZoom === undefined)) {
				throw "Missing parameter";
			}
			_map = new google.maps.Map(document.getElementById(args.containerID), {
				center: args.mapCenter,
				zoom: args.mapZoom
			});
		},
		_getMap = function () {
			return _map;
		},
		_markers = [],
		_showMarkerInfo = function (marker, description) {
			var infoWindow = new google.maps.InfoWindow({
					content: description
				});
			infoWindow.open(_map, marker);
		},
		_placeMarker = function (args) {
			if ((args.position === undefined) ||
				(args.icon === undefined) ||
				(args.title === undefined) ||
				(args.description === undefined)) {
				throw "Missing parameter";
			}
			var marker = new google.maps.Marker({
					map: _map,
					position: args.position,
					icon: args.icon,
					title: args.title
				});
			marker.clickListener = google.maps.event.addListener(marker, 'click', function () {
				_showMarkerInfo(marker, args.description);
			});
			_markers.push(marker);
			marker.index = _markers.indexOf(marker);

			$(document).trigger('marker:added', marker);
			
			return marker;
		},
		_removeMarker = function (args) {
			if (args.marker === undefined) {
				throw "Missing parameter";
			}
			_markers[args.marker.index].setMap(null);
			delete _markers[args.marker.index];
		},
		_getMarkers = function() {
			return _markers;
		}
	
	return {
		initMap: _initMap,
		getMap: _getMap,
		placeMarker: _placeMarker,
		removeMarker: _removeMarker,
		getMarkers: _getMarkers
	};
};