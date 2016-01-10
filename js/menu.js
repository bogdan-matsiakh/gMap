if (!window.DigitalUkraine) window.DigitalUkraine = {};
if (!window.DigitalUkraine.Menu) window.DigitalUkraine.Menu = function (map) {

	function Polygon(cfg) {
		this.markers = ko.observableArray([]);
		this.index = cfg.index;
		this.isPainted = ko.observable(false);
		this.paintPolygon = function() {
			var coords = [];
			this.markers().forEach(function(marker) {
				coords.push(marker.position);
			});
			this.isPainted(true);
			this.area = new google.maps.Polygon({
				paths: coords,
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35
			});
			this.area.setMap(map);
		}
		this.clearPolygon = function() {
			this.area.setMap(null);
			this.isPainted(false);
		};
		this.addMarker = function(marker) {
			marker.indexPol = this.markers().length;
			marker.text = ko.observable('');
			_getMarkerText(marker);
			this.markers.push(marker);
		};
		this.removeMarker = function(index) {
			this.markers().splice(index, 1);
			this.clearPolygon();
			if (this.markers().length >=3) {
				this.paintPolygon();
			}
		}
		activePolygon = this;
		this.addMarker(cfg.marker);
	}

	function _init(map) {
		$(document).on('marker:added', _onMarkerAdded);
		$(document).on('polygon:added', _onPolygonAdded);
		$(document).on('marker:remove', _onMarkerRemove);
		scope.polygons = ko.observableArray([]);
		ko.applyBindings(scope);
	}
	function _onGetMarkerButtonClick() {
		$(document).trigger('getMarkers:click');
	}

	function _onMarkerRemove(e, marker) {
		scope.polygons()[activePolygon.index].removeMarker(marker.indexPol);
	}


	function _onMarkerAdded(e, marker) {
		var markers,
			markersIndex,
			polygon;
		if (scope.polygons().length > 0) {
			scope.polygons()[activePolygon.index].addMarker(marker);
		} else {
			scope.polygons.push(new Polygon({
				index: 0,
				marker: marker,
				title: 'polygon ' + (scope.polygons.length + 1),
			}));
			
		}
	}

	function _onPolygonAdded(e, polygon) {

	}

	function _getCreatePolygonHTML() {
		
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
					console.log(results[1]);
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