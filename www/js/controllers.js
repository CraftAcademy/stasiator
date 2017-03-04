angular.module('stasiator.controllers', [])

  .controller('imageCtrl', function ($scope, $cordovaCamera) {

    $scope.status = {text: "Test"};


    document.addEventListener("deviceready", function() {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $scope.selectPicture = function () {
        $cordovaCamera.getPicture(options)
          .then(function (u) {
            //$scope.imgURI =  u;
            //getPictureSuccess(u);
            var image = document.getElementById('image');
            image.src = "data:image/jpeg;base64," + u;
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
      $scope.imgURI = u;
      //$scope.img.src = u;
      //console.log($scope.img.src);
      //$scope.status = {text: "Got image: " + $scope.img.src};

    };

  });
