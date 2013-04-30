/**
 * License: MIT
 */
(function(window, angular, undefined) {
'use strict';

/**
 * @ngdoc overview
 * @name lisUiElements
 * @description
 */

/**
 * @ngdoc object
 * @name lisUiElements
 * @requires momentjs, fdSlider, kalendae
 *
 */
var module = angular.module('lisUiElements', []);
module
  .directive('fdSlider', function ($parse) {
    return {
      restrict: 'AE',
	  replace: false,
      link: function postLink(scope, element, attrs) {
		var model = attrs.ngModel;
		fdSlider.createSlider({
			inp: element[0],
			min: attrs.fdSliderMin || 0,
			max: attrs.fdSliderMax || 100,
			step: attrs.fdSliderStep || 1,
			callbacks: {
			// TODO: extend change callback array instead of replacing
				change: model ? [function(obj){
					scope[model] = obj.value;
					scope.$digest();
				}] : []
			}
		});
		element.css("display","none");
      }
    };
  });
})(window, window.angular);
