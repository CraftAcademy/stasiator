angular.module('stasiator.controllers', [])

  .controller('imageCtrl', function ($scope, $cordovaCamera, Location) {

    $scope.status = {text: ""};


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
    });


    var getPictureError = function (e) {
      alert('Error getting image: ' + e);
    };

    var getPictureSuccess = function (imageData) {
      var image = document.getElementById('image');
      image.src = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");

      CordovaExif.readData(image.src, function(exifObject) {
        $scope.status.text = Location.getCoordinates(exifObject);
        console.log($scope.status.text);
        $scope.$apply();

      });

    };

  });
