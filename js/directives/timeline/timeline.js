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

                let newItem = {
                    imgs:[],
                    header:"",
                    desc:"",
                    img: "",
                    time:"",
                    cta:""
                }

                scope.newItem = function(){
                    scope.data.items.push(JSON.parse(JSON.stringify(newItem)));
                }

                scope.duplicate = function(item){
                    scope.data.items.push(JSON.parse(JSON.stringify(item)));
                }

                scope.remove = function(item){
                    scope.data.items.splice(scope.data.items.indexOf(item),1);
                }

                scope.save = function(){
                    vff.state.take();
                }
            }
        }
    });