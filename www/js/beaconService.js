angular.module('starter')
.service('BeaconService', function() {

  var beacons = {};

  function init() {
    evothings.eddystone.startScan(function(beacon) {
      beacon.rssi = mapBeaconRSSI(beacon.rssi);
      beacon.timestamp = +new Date();
      beacons[beacon.address] = beacon;
    }, function(error) {
      console.error(error);
    });

    setInterval(removeOldBeacons, 1000);
  }

  function get(mac) {
    return beacons.hasOwnProperty(mac) ? beacons[mac] : null;
  }

  function isInRange(mac) {
    var beacon = get(mac);
    if(beacon) {
      console.log('sees Beacon', mac, beacon.rssi);
      return true;
    } else {
      console.log('does not see beacon', mac);
    }

    return false;
  }

  function count() {
    return Object.keys(beacons).length;
  }

  function mapBeaconRSSI(rssi) {
		if (rssi >= 0) return 1; // Unknown RSSI maps to 1.
		if (rssi < -100) return 100; // Max RSSI
		return 100 + rssi;
	}

  function removeOldBeacons() {
		var timeNow = +new Date();
		for (var key in beacons) {
			var beacon = beacons[key];
			if (beacon.timestamp - 15000 > timeNow) {
        console.log('removed', key);
				delete beacons[key];
			}
		}
	}

  return {
    init: init,
    count: count,
    isInRange: isInRange,
    get: get
  };
})
