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
			var model = attrs.ngModel,
				throttle = attrs.lisThrottle;
				
			attrs.lisOptions = attrs.lisOptions || '{}';
			throttle = throttle ? parseInt( throttle ) : false;
			
			var changeCallback;
			if( model ) {
				changeCallback = function(obj){
					$parse(model).assign(scope, obj.value);
					scope.$digest();
				}
				if( throttle ) {
					changeCallback = _.throttle( changeCallback, throttle );
				}
				changeCallback = [changeCallback];
			} else {
				changeCallback = [];
			}
			var options = _.defaults(angular.fromJson(attrs.lisOptions),{
				inp: element[0],
				min: 0,
				max: 100,
				step: 1,
				callbacks: {
				// TODO: extend change callback array instead of replacing
					change: changeCallback
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
			options = angular.fromJson(attrs.lisOptions),
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
