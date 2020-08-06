angular.module('socialApp')
    .directive('timeline',function(){
        return{
            restrict: 'E',
            templateUrl:'/js/directives/timeline/timeline.html',
            replace:true,
            scope:{
                data : '=',
                isController: '='
            },
            link: function (scope) {
                
            }
        }
    });