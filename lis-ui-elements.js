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
 * @requires momentjs, fdSlider, kalendae, lodash
 *
 */
var module = angular.module('lisUiElements', ['ng']);
	module
	  .directive('fdSlider', function ($parse) {
		return {
		  restrict: 'AE',
		  replace: false,
		  link: function postLink(scope, element, attrs) {
			var model = attrs.ngModel;
			attrs.lisOptions = attrs.lisOptions || '{}';
			var options = _.defaults(JSON.parse(attrs.lisOptions),{
				inp: element[0],
				min: 0,
				max: 100,
				step: 1,
				callbacks: {
				// TODO: extend change callback array instead of replacing
					change: model ? [function(obj){
						$parse(model).assign(scope, obj.value);
						scope.$digest();
					}] : []
				}
				    
			});
			fdSlider.createSlider(options);
			element.css("display","none");
		  }
		};
	  });
	
	function makeKalendae( scope, element, attrs, type, $parse ) {
		attrs.lisOptions = attrs.lisOptions || '{}';
		var model = attrs.ngModel,
			options = JSON.parse(attrs.lisOptions),
		cal = new type(element[0],options);
		cal.subscribe("change", function(value){
			// TODO: Range, multiple and multiple calendars
			$parse(model).assign(scope,this.getSelectedAsDates());
			scope.$digest();
		});
	}
	  
	module.directive('kalendae', function($parse) {
		return {
		  restrict: 'EA',
		  link: function postLink(scope, element, attrs) {
			makeKalendae(scope, element, attrs, Kalendae, $parse);
		  }
		};
	});
	  
	module.directive('inputKalendae', function($parse) {
		return {
		  restrict: 'A',
		  link: function postLink(scope, element, attrs) {
			makeKalendae(scope, element, attrs, Kalendae.Input, $parse);
		  }
		};
	});
})(window, window.angular);
