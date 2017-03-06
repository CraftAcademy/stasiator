angular.module('stasiator.services', [])

  .service('Location', function (ClarifaiService) {

    return {
      getCoordinates: function (exif) {
        $longitude = (exif.GPSLongitude[0] + exif.GPSLongitude[1] / 60 + exif.GPSLongitude[2] / 3600);
        if (exif.GPSLongitudeRef === "W") {
          $longitude = -($longitude);
        }
        $latitude = (exif.GPSLatitude[0] + exif.GPSLatitude[1] / 60 + exif.GPSLatitude[2] / 3600);

        if (exif.GPSLatitudeRef === "S") {
          $latitude = -($latitude);
        }
        return {lat: $latitude, long: $longitude}


      },

      addMap: function (lat, long) {
        var map;
        debugger;
        if (typeof(map) == 'object') {
          map.off();
          map.remove();
        }
        map = L.map('map');
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Craft Academy Labs',
          maxZoom: 18,
          id: 'mapbox.outdoors',
          accessToken: 'pk.eyJ1IjoiYXF1YWFtYmVyIiwiYSI6ImNpejVreGVxNzAwNTEyeXBnbWc5eXNlcTYifQ.ah37yE5P2LH9LVzNelgymQ'
        }).addTo(map);
        map.setView([lat, long], 13);
        L.marker([lat, long]).addTo(map);

        return map;
      }
    }

  })


  .service('ClarifaiService', function ($q, $timeout) {
    return {
      getKeywords: function (image) {
        var deferred = $q.defer();
        var path = image.src;
        var app = new Clarifai.App(
          '7WEA3uUeoF-KTvjKVI3g1qWBKNOAcPvyQdj4tCmY',
          'HzTEezVKOnsWbR34JgUpuC4t6skZ8qh3zw6E6EYX'
        );

        //$timeout(function () {
          getFileContentAsBase64(path, function (response) {
            var encodedImage = response.replace(/^data:image\/(png|gif|jpeg);base64,/, '');
            app.models.predict(Clarifai.GENERAL_MODEL, {base64: encodedImage})
              .then(
                function (response) {
                  //console.log(response);
                  var object = JSON.parse(response.request.responseText).outputs[0];
                  console.log(object);
                  var tags = getKeywords(object);
                  console.log(tags);
                  //return tags;
                  deferred.resolve(tags);
                },
                function (err) {
                  return err;
                }
              );
          });
        //}, 3000);
        console.log(deferred.promise);
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

    function getKeywords(object) {
      var keywords = [];
      angular.forEach(object.data.concepts, function (value, key) {
        keywords.push(value.name)
      });
      return keywords;
    }
  });
