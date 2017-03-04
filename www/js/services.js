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
      }
    }

  })
