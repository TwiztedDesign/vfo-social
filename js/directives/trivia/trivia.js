angular.module('socialApp')
    .directive('trivia',function(){
        return{
            restrict: 'E',
            templateUrl:'/js/directives/trivia/trivia.html',
            replace:true,
            scope:{
                data : '=',
                edit: '=',
            },
            link: function (scope) {
                let newItem={
                    visible:false,
                    enabled:true,
                    question:'',
                    answers:[
                        {
                            img:'',
                            text:'',
                            isCorrect:true
                        },
                        {
                            img:'',
                            text:'',
                            isCorrect:false
                        },
                        {
                            img:'',
                            text:'',
                            isCorrect:false
                        },
                        {
                            img:'',
                            text:'',
                            isCorrect:false
                        }
                    ],
                }


                scope.newItem = function(){
                    scope.data.items.push(JSON.parse(JSON.stringify(newItem)));
                }

                scope.duplicate = function(item){
                    scope.data.items.splice(scope.data.items.indexOf(item),0,JSON.parse(angular.toJson(item)));
                }

                scope.remove = function(item){
                    if (window.confirm("Delete current item?")) { 
                        scope.data.items.splice(scope.data.items.indexOf(item),1);
                    }
                }

                scope.show = function(item){
                    if(!scope.data.multipleQuestions){
                        scope.data.items.forEach((i)=>{
                            i.visible=false;
                        });
                    }

                    item.visible = true;
                    item.enabled = true;

                    vff.send();

                    setTimeout(() => {
                        if(!scope.data.multipleQuestions){
                            item.visible = false;
                        }
                        item.enabled= false;
                        vff.send();
                        scope.$apply();
                    }, scope.data.time * 1000);
                }

                scope.hide = function(item){
                    item.visible=false;
                    item.enabled= false;
                    vff.send();
                }

                scope.save = function(){
                    vff.send();
                }
            }
        }
    });