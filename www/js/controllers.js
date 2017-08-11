angular.module('stasiator.controllers', [])

  .controller('imageCtrl', function ($scope, $cordovaCamera, LocationService, ClarifaiService, $ionicLoading, $q) {
    var lat, long, image;

    document.addEventListener("deviceready", function () {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.NATIVE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $scope.selectPicture = function () {
        $scope.status = {
          text: "",
          tags: ""
        };
        $cordovaCamera.getPicture(options)
          .then(function (imageData) {
            getPictureSuccess(imageData).then(function (imageData) {
              CordovaExif.readData(imageData, function (exifObject) {
                LocationService.getCoordinates(exifObject).then(function (coords) {
                  $scope.status.text = coords;
                  lat = $scope.status.text.lat;
                  long = $scope.status.text.long;
                  document.getElementById('map-container').innerHTML = "<div id='map'></div>";
                  LocationService.initiateMap('map');
                  map.setView([lat, long], 8, {
                    reset: true
                  });
                  LocationService.addMarker(lat, long, map);
                });


                $scope.$apply();
              });
            });
          })
          .catch(function (e) {
            getPictureError(e);
          }, false);
      };

      function getPictureError(e) {
        alert('Error getting image: ' + e);
      };

      function getPictureSuccess(imageData) {
        var deferred = $q.defer();
        var image = document.getElementById('image');
        $scope.imageLoaded = true;
        image.src = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");
        $scope.status.text = "Getting location...";
        deferred.resolve(image.src);
        console.log(deferred.promise);
        return deferred.promise;
      }
    });


    $scope.getKeywords = function () {
      $ionicLoading.show({
        template: 'Analyzing image...'
      });
      var image = document.getElementById('image');
      ClarifaiService.analyze(image, {model: Clarifai.NSFW_MODEL})
        .then(function (resp) {
          $scope.status.tags = resp;
          $ionicLoading.hide();
        }, function (error) {
          $scope.status.tags = error;
          $ionicLoading.hide();
        });
    }

  });
