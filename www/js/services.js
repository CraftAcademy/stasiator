angular.module('stasiator.services', [])

  .service('Location', function () {

    return {
      getCoordinates: function (exifObject) {
        $longitude = (exifObject.GPSLongitude[0] + exifObject.GPSLongitude[1] / 60 + exifObject.GPSLongitude[2] / 3600);
        if (exifObject.GPSLongitudeRef === "W") {
          $longitude = -($longitude);
        }
        $latitude = (exifObject.GPSLatitude[0] + exifObject.GPSLatitude[1] / 60 + exifObject.GPSLatitude[2] / 3600);

        if (exifObject.GPSLatitudeRef === "S") {
          $latitude = -($latitude);
        }

        return {lat: $latitude, long: $longitude}
      },

      addMap: function(lat, long){
        var map;
        map = L.map('map');
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Craft Acadeny Labs',
          maxZoom: 18,
          id: 'mapbox.outdoors',
          accessToken: 'pk.eyJ1IjoiYXF1YWFtYmVyIiwiYSI6ImNpejVreGVxNzAwNTEyeXBnbWc5eXNlcTYifQ.ah37yE5P2LH9LVzNelgymQ'
        }).addTo(map);
        //map.setView([63.53, -19.51], 10);
        map.setView([lat, long], 13);
        L.marker([lat, long]).addTo(map);

        return map;
      },
      addBasicMap: function(){
        var map;
        map = L.map('map');
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Craft Acadeny Labs',
          maxZoom: 18,
          id: 'mapbox.outdoors',
          accessToken: 'pk.eyJ1IjoiYXF1YWFtYmVyIiwiYSI6ImNpejVreGVxNzAwNTEyeXBnbWc5eXNlcTYifQ.ah37yE5P2LH9LVzNelgymQ'
        }).addTo(map);
        map.setView([63.53, -19.51], 10);


        return map;
      }
    }

  });
