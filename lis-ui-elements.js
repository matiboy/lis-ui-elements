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
	  
	module.directive( 'dobSelects', function($parse) {
		return {
			restrict: 'EA',
			replace: true,
			template: '<div><select ng-model="day" ng-options="o as o for o in days"></select><select ng-model="month" ng-options="o as o for o in months"></select><select ng-model="year" ng-options="o as o for o in years"></select></div>',
			scope: true,
			link: function postLink( scope, element, attrs ) {
				scope.dt = moment();
				var getter = $parse(attrs.ngModel),
					setter = getter.assign,
					months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
					years = _.range(1900,parseInt(scope.dt.format('YYYY'))+1);
				scope.months = months;
				scope.years = years;
				scope.$watch('dt', function(nv, ov) {
					scope.days = _.range(1, nv.daysInMonth()+1);
				} );
				// scope.days = [1,2,3,4,5,6];
				scope.day = 1;
				scope.month = "Jan";
				scope.year = parseInt(scope.dt.format('YYYY'));
				
				scope.$watch('day',function(nv) {
					scope.dt.date(nv);
				});
				scope.$watch('month',function(nv) {
					scope.dt.month(_.indexOf(months,nv));
				});
				scope.$watch('year',function(nv) {
					scope.dt.year(nv);
				});
				
				setter(scope.$parent,scope.dt.toDate());
			}
		}
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
