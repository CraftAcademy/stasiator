angular.module('stasiator.controllers', [])

  .controller('imageCtrl', function ($scope, $cordovaCamera, Location, ClarifaiService) {
    var lat, long, map;
    var image = document.getElementById('image');
    $scope.status = {text: ""};

    //Location.addBasicMap();


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
        $cordovaCamera.getPicture(options)
          .then(function (imageData) {
            getPictureSuccess(imageData);
          })
          .catch(function (e) {
            getPictureError(e);
          }, false);
      };

      var getPictureError = function (e) {
        alert('Error getting image: ' + e);
      };

      var getPictureSuccess = function (imageData) {
        image.src = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");

        CordovaExif.readData(image.src, function (exifObject) {
          ClarifaiService.getKeywords(image).then(function(response){
            $scope.status.tags = response;
            $scope.$apply();
            console.log($scope.status.tags);
          });
          Location.getCoordinates(exifObject).then(function(response){
            $scope.status.text = response;
            $scope.$apply();
            lat = $scope.status.text.lat;
            long = $scope.status.text.long;
            Location.addMap(lat, long);
          });


        });

      };
    });

  });

