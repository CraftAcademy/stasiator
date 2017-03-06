angular.module('stasiator.controllers', [])

  .controller('imageCtrl', function ($scope, $cordovaCamera, Location, ClarifaiService) {
    var lat, long, image;
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
        var image = document.getElementById('image');
        var exif;
        image.src = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");
        CordovaExif.readData(image.src, function (exifObject) {
          exif = exifObject;
          ClarifaiService.getKeywords(image).then(
            function(resp){
              console.log(resp);
              $scope.status.tags = resp;
            }
          );
          $scope.status.text = Location.getCoordinates(exif);
          lat = $scope.status.text.lat;
          long = $scope.status.text.long;
          Location.addMap(lat, long);
          $scope.$apply();
        });
      };
    });


    $scope.getKeywords = function(){
      var image = document.getElementById('image');
      $scope.status.tags = ClarifaiService.getKeywords(image);
    }
    
  });

