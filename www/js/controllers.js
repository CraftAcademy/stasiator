angular.module('stasiator.controllers', [])

  .controller('imageCtrl', function ($scope, $cordovaCamera, Location, ClarifaiService, $ionicLoading) {
    var lat, long, image;
    $scope.status = {
      text: "",
      tags: ""
    };

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
        $scope.status = {
          text: "",
          tags: ""
        };
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
        var image = document.getElementById('image');
        var exif;
        image.src = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");
        CordovaExif.readData(image.src, function (exifObject) {
          exif = exifObject;
          $scope.status.text = Location.getCoordinates(exif);
          lat = $scope.status.text.lat;
          long = $scope.status.text.long;
          Location.addMap(lat, long);
          $scope.$apply();
        });
      };
    });


    $scope.getKeywords = function () {
      $ionicLoading.show({
        template: 'Analyzing image...'
      });
      var image = document.getElementById('image');
      ClarifaiService.getKeywords(image)
        .then(function (resp) {
          $scope.status.tags = resp;
          $ionicLoading.hide();
        });
    }

  });

