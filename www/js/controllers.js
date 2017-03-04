angular.module('stasiator.controllers', [])

  .controller('imageCtrl', function ($scope, $cordovaCamera) {

    $scope.status = {text: ""};


    document.addEventListener("deviceready", function() {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $scope.selectPicture = function () {
        $cordovaCamera.getPicture(options)
          .then(function (u) {
            getPictureSuccess(u);
          })
          .catch(function (e) {
            getPictureError(e);
          }, false);
      };
    });


    var getPictureError = function (e) {
      alert('Error getting image: ' + e);
    };

    var getPictureSuccess = function (u) {
      var image = document.getElementById('image');
      image.src = "data:image/jpeg;base64," + u;
      $scope.status = {text: "Image info: "};

    };

  });
