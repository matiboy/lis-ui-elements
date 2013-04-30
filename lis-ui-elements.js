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
	  .directive('fdSlider', function () {
		return {
		  restrict: 'AE',
		  replace: false,
		  link: function postLink(scope, element, attrs) {
			var model = attrs.ngModel;
			attrs.lisOptions = attrs.lisOptions || '{}';
			var options = _.defaults({
				inp: element[0],
				min: 0,
				max: 100,
				step: 1,
				callbacks: {
				// TODO: extend change callback array instead of replacing
					change: model ? [function(obj){
						scope[model] = obj.value;
						scope.$digest();
					}] : []
				}
				    
			},JSON.parse(attrs.lisOptions));
			fdSlider.createSlider(options);
			element.css("display","none");
		  }
		};
	  });
	
	function makeKalendae( scope, element, attrs, type ) {
		attrs.lisOptions = attrs.lisOptions || '{}';
		var model = attrs.ngModel,
			options = JSON.parse(attrs.lisOptions),
		cal = new type(element[0],options);
		cal.subscribe("change", function(value){
			// TODO: Range, multiple and multiple calendars
			scope[model] = this.getSelectedAsDates();
			scope.$digest();
		});
	}
	  
	module.directive('kalendae', function() {
		return {
		  restrict: 'EA',
		  link: function postLink(scope, element, attrs) {
			makeKalendae(scope, element, attrs, Kalendae);
		  }
		};
	});
	  
	module.directive('inputKalendae', function() {
		return {
		  restrict: 'A',
		  link: function postLink(scope, element, attrs) {
			makeKalendae(scope, element, attrs, Kalendae.Input);
		  }
		};
	});
})(window, window.angular);
