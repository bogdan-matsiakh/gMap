if (!window.DigitalUkraine) window.DigitalUkraine = {};
if (!window.DigitalUkraine.Menu) window.DigitalUkraine.Menu = function (map, mapWorker) {

	function Polygon(cfg) {
		this.markers = ko.observableArray([]);
		this.index = cfg.index;
		this.isPainted = ko.observable(false);
		this.area = null;
		this.title = ko.observable('polygon ' + (scope.polygons().length));
		
		this.paintPolygon = function() {
			var coords = [],
				area;

			this.clearPolygon();
			
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
			google.maps.event.addListener(this.area, 'dragend', function(){
			  console.log('dragend', arguments);
			});
			this.area.getPaths().forEach((function(path, index){

				google.maps.event.addListener(path, 'insert_at', (function(index) {
					console.log('insert_at', index, path.getAt(index));
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
		this.clearPolygon = function() {
			if (this.area) {
				this.area.setMap(null);
			}
			this.isPainted(false);
		};
		this.editPolygon = function() {
			console.log('edit');
		}
		this.addMarker = function(marker) {
			marker.indexPol = this.markers().length;
			marker.text = ko.observable('');
			_getMarkerText(marker);
			this.markers.push(marker);
			
			google.maps.event.addListener(marker, "dragend", (function(event) {
				this.paintPolygon();
			}).bind(this));
		};
		this.removeMarker = function(marker) {
			this.markers.splice(marker.indexPol, 1);
			marker.setMap(null);
			
			this.clearPolygon();
			
			if (this.markers().length >=3) {
				this.paintPolygon();
			}
		};
		this._removeAllMarkers = function() {
			this.markers().forEach(function(marker) {
				marker.setMap(null);	
			});
			this.markers = ko.observableArray([]);
			this.clearPolygon();
		}
		this._refreshMarkers = function() {
			this._removeAllMarkers();
			this.area.getPaths().forEach((function(path, index) {
				console.log('asdfasdf', path, path.getAt(index));
			}).bind(this));
		}
		this._insertMarkerAt = function(index) {
			var position;
			console.log(this.area.getPaths(index));
			console.log(this.area.getPaths(index).getAt(index));
			this.area.getPaths().forEach(function(path, index) {
				position = path.getAt(index);
			});
			var marker = mapWorker.placeMarker({
				position: position
			});
			this.addMarker(marker);
		}
		activePolygon = this;
		this.addMarker(cfg.marker);
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