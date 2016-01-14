if (!window.DigitalUkraine) window.DigitalUkraine = {};
if (!window.DigitalUkraine.Menu) window.DigitalUkraine.Menu = function (map, mapWorker) {

	function Polygon(cfg) {
		this.markers = ko.observableArray([]);
		this.index = cfg.index;
		this.isPainted = ko.observable(false);
		this.area = null;
		this.title = ko.observable('polygon ' + (scope.polygons().length));
		
		this.paint = function() {
			var coords = [],
				area;

			this.clear();
			
			this.markers().forEach(function(marker) {
				coords.push(marker.position);
			});
			this.isPainted(true);
			this.area = area = new google.maps.Polygon({
				paths: coords,
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				editable: true
			});
			this.area.getPaths().forEach((function(path, index){

				google.maps.event.addListener(path, 'insert_at', (function(index) {
					// this._insertMarkerAt(index);
					activePolygon.isPainted(false);
					mapWorker.placeMarker({
						position: {
							lat: path.getAt(index).G,
							lng: path.getAt(index).K
						}
					});
				}).bind(path));

				google.maps.event.addListener(path, 'remove_at', (function(){
					console.log('remove_at', arguments);
					// this._refreshMarkers();
				}).bind(this));

				google.maps.event.addListener(path, 'set_at', (function(){
					console.log('set_at', arguments);
					// this._refreshMarkers();
				}).bind(this));

			}).bind(this));
			this.area.setMap(map);
		}
		this.clear = function() {
			if (this.area) {
				this.area.setMap(null);
			}
			this.isPainted(false);
		};
		this.editPolygon = function() {
			this.isPainted(false);
		}
		this.addMarker = function(marker) {
			marker.indexPol = this.markers().length;
			marker.text = ko.observable('');
			_getMarkerText(marker);
			this.markers.push(marker);
			
			google.maps.event.addListener(marker, "dragend", (function(event) {
				this.paint();
			}).bind(this));
		};
		this.removeMarker = function(marker) {
			this.markers.splice(marker.indexPol, 1);
			marker.setMap(null);
			
			this.clear();
			
			if (this.markers().length >=3) {
				this.paint();
			}
		};
		this._removeAllMarkers = function() {
			this.markers().forEach(function(marker) {
				marker.setMap(null);	
			});
			this.markers = ko.observableArray([]);
			this.clear();
		}
		this._refreshMarkers = function() {
			this._removeAllMarkers();
			this.area.getPaths().forEach((function(path, index) {
				console.log('asdfasdf', path, path.getAt(index));
			}).bind(this));
		}
		this._insertMarkerAt = function(index) {
			var position,
				marker;
			
			this.area.getPaths().forEach(function(path, index) {
				position = path.getAt(index);
			});
			marker = mapWorker.placeMarker({
				position: position
			});
			this.addMarker(marker);
		}
		activePolygon = this;
		this.addMarker(cfg.marker);

		this.sortCoordinatesClockwise = function() {
			var coords = [],
				bottomLeft,
				topRight;
			
			this.markers().forEach(function(marker) {
				coords.push(marker.position);
			});
			bottomLeft = this._getBottomLeftCoord(coords);
			// bottomLeft = this._getBottomLeftCoord(coords);
		};

		this._getBottomLeftCoord = function(coords) {
			var bottomLeft = coords[0];
			
			coords.forEach(function(coord) {
				console.log('coords', coord.lat(), coord.lng());
				if (coord.lat() < bottomLeft.lat()) {
					bottomLeft = coord;
				} else if (coord.lat() === bottomLeft.lat()) {
					// if (coord.lng()
				}
			});
			return bottomLeft;
		};

		this._getTopRightCoord = function() {
			var topRight = coords[0];
			
			coords.forEach(function(coord) {
				console.log('coords', coord.lat(), coord.lng());
				if (coord.lat() > bottomLeft.lat()) {
					bottomLeft = coord;
				} else if (coord.lat() === bottomLeft.lat()) {
					// if (coord.lng()
				}
			});
			return bottomLeft;
		};
		function distance(point1, point2) {
			return Math.sqrt((point1.lat() - point2.lat())^2 + (point1.lng() - point2.lng())^2);
		}
	}

	function _init(map) {
		$(document).on('marker:added', _onMarkerAdded);
		$(document).on('marker:remove', _onMarkerRemove);
		
		scope.polygons = ko.observableArray([]);
		ko.applyBindings(scope);
	}

	function _onMarkerRemove(e, marker) {
		activePolygon.removeMarker(marker);
	}

	function _onMarkerAdded(e, marker) {
		var polygonLength = scope.polygons().length;

		if (polygonLength > 0 && !activePolygon.isPainted()) {
			activePolygon.addMarker(marker);
		} else {
			scope.polygons.push(new Polygon({
				index: polygonLength,
				marker: marker
			}));
		}
	}
	
	function _getMarkerText(marker) {
		geocoder.geocode({
			'latLng': marker.position
		}, _updateMarkerText(marker));
	}
	function _updateMarkerText(marker) {
		return function (results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					marker.text(results[1].formatted_address);
				} else {
					alert('No results found');
				}
			} else {
				alert('Geocoder failed due to: ' + status);
			}
		}
	}
	function _removeMarker(el, marker) {
		return function() {
			el.remove();
			$(document).trigger('marker:remove', marker);
		}
	}
	var markers = [];
	var geocoder = new google.maps.Geocoder();
	var scope = {
		polygons: []
	};
	var activePolygon;

	return {
		init: _init
	};
};