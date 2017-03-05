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

      addMap: function (lat, long) {
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
      addBasicMap: function () {
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

  })


  .service('ClarifaiService', function () {
    return {
      getKeywords: function (image) {
        var path = image.src;
        var app = new Clarifai.App(
          '7WEA3uUeoF-KTvjKVI3g1qWBKNOAcPvyQdj4tCmY',
          'HzTEezVKOnsWbR34JgUpuC4t6skZ8qh3zw6E6EYX'
        );
        getFileContentAsBase64(path, function (response) {
          var encodedImage = response.replace(/^data:image\/(png|gif|jpeg);base64,/, '');
          app.models.predict(Clarifai.GENERAL_MODEL, {base64: encodedImage})
            .then(
              function (response) {
                console.log(JSON.parse(response.request.responseText).outputs[0]);
              },
              function (err) {
                console.error(err);
              }
            );
        });
      }
    };

    function getFileContentAsBase64(path, callback) {
      window.resolveLocalFileSystemURL(path, success, error);

      function error(e) {
        alert('Cannot found requested file');
      }

      function success(fileEntry) {
        fileEntry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function (e) {
            var content = this.result;
            callback(content);
          };
          reader.readAsDataURL(file);
        });
      }
    }
  });
