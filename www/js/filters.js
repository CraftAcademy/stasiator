angular.module('stasiator.filters', [])

  .filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }])
  // Usage:
  // <p>{{floatValue | percentage:2}}</p>

  .filter('capitalize', function () {
    return function (input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
  });

  // Usage:
  // <p>{{stringValue | capitalize}}</p>
