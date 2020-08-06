angular.module('socialApp')
    .directive('timeline',function(){
        return{
            restrict: 'E',
            templateUrl:'/js/directives/timeline/timeline.html',
            replace:true,
            scope:{
                data : '=',
                edit: '='
            },
            link: function (scope) {

            }
        }
    });