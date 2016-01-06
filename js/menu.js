if (!window.DigitalUkraine) window.DigitalUkraine = {};
if (!window.DigitalUkraine.Menu) window.DigitalUkraine.Menu = function () {
	function _init(map) {
		$('#get-markers').click(_onGetMarkerButtonClick);
		$(document).on('marker:added', _onMarkerAdded);
		$(document).on('polygon:added', _onPolygonAdded);
	}
	function _onGetMarkerButtonClick() {
		$(document).trigger('getMarkers:click');
	}

	function _onMarkerAdded(e, marker) {
		$('#markers-group').append(_getMarkerHTML(marker));
		if (markers.length >= 3) {
			$('#markers-group').append(_getCretePolygonHTML());	
		}
	}

	function _onPolygonAdded(e, polygon) {

	}

	function _getCretePolygonHTML() {
		
	}
	
	function _getMarkerHTML(marker) {
		var el = $('<div><i class="icon-remove"></i><span>' + (markers.length + 1) + '</span></div>'),
			text;
		geocoder.geocode({
			'latLng': marker.position
		}, _updateMarkerText(el));
		markers.push(el);
		$('.icon-remove', el).click(_removeMarker(el, marker));
		return el;
	}
	function _updateMarkerText(el) {
		return function (results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					console.log(results[1]);
					$('span', el).html(results[1].formatted_address);
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

	return {
		init: _init
	};
};