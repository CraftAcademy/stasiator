angular.module('stasiator.services', [])

  .service('LocationService', function (ClarifaiService, $q) {

    return {
      getCoordinates: function (exif) {
        var deferred = $q.defer();
        var coords;
        if (exif.GPSLatitude) {
          $longitude = (exif.GPSLongitude[0] + exif.GPSLongitude[1] / 60 + exif.GPSLongitude[2] / 3600);
          if (exif.GPSLongitudeRef === "W") {
            $longitude = -($longitude);
          }
          $latitude = (exif.GPSLatitude[0] + exif.GPSLatitude[1] / 60 + exif.GPSLatitude[2] / 3600);

          if (exif.GPSLatitudeRef === "S") {
            $latitude = -($latitude);
          }
          coords = {lat: $latitude, long: $longitude}
          deferred.resolve(coords);
        } else {
          coords = {lat: 0, long: 0};
          deferred.resolve(coords);
        }
        return deferred.promise;
      },

      initiateMap: function (element) {
        var openStreetMap = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
          maxZoom: 16
        });

        map = new L.Map(element, {
          layers: [openStreetMap],
          attribution: 'Craft Academy Labs - Stasiator',
          continuousWorld: true,
          zoomControl: true
        });

      },

      addMarker: function (lat, long, map) {
        L.marker([lat, long]).addTo(map);
      }
    }

  })


  .service('ClarifaiService', function ($q) {
    return {
      analyze: function (image, options) {
        var deferred = $q.defer();
        var path = image.src;
        var app = new Clarifai.App(
          '7WEA3uUeoF-KTvjKVI3g1qWBKNOAcPvyQdj4tCmY',
          'HzTEezVKOnsWbR34JgUpuC4t6skZ8qh3zw6E6EYX'
        );

        getFileContentAsBase64(path, function (response) {
          var encodedImage = response.replace(/^data:image\/(png|gif|jpeg);base64,/, '');
          app.models.predict(options.model, {base64: encodedImage})
            .then(
              function (response) {
                var object = JSON.parse(response.request.responseText).outputs[0];
                var tags = getSFWStatus(object);
                deferred.resolve(tags);
              },
              function (err) {
                deferred.resolve(err);
              }
            );
        });
        return deferred.promise;
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

    function getSFWStatus(object) {
      var keywords = [];
      angular.forEach(object.data.concepts, function (entry, key) {
        keywords.push({name: entry.name, value: entry.value})
      });
      return keywords;
    }
  });
