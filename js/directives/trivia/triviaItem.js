angular.module('socialApp')
    .directive('triviaItem',function(){
        return{
            restrict: 'E',
            templateUrl:'/js/directives/trivia/triviaItem.html',
            replace:true,
            scope:{
                data : '=',
                edit: '=',
                show: '&',
                hide: '&',
                onRemove: '&',
                onDuplicate: '&'
            },
            link: function (scope) {
                let prevVis = false;
                scope.selectedAnswer = -1;

                scope.setAnswer = function(answer){
                    scope.data.answers.forEach((a)=>a.isCorrect=false);
                    answer.isCorrect=true;
                }

                scope.selectAnswer = function(answer){
                    scope.selectedAnswer = scope.data.answers.indexOf(answer);
                    scope.enabled=false;
                }

                scope.isSelected = function(answer){
                    return scope.selectedAnswer===scope.data.answers.indexOf(answer);
                }

                scope.removeAnswer = function(answer){
                    scope.data.answers.splice(data.answers.indexOf(answer),1);
                }

                scope.addAnswer = function(){
                    scope.data.answers.push(JSON.parse(JSON.stringify(
                        {
                            img:'',
                            text:'',
                            isCorrect:false
                        }
                    )));
                }

                scope.toggleVisibility = function(){
                    if(scope.data.visible){
                        scope.hide();
                    }else{
                        scope.show();
                    }
                }

                // if(!scope.edit){
                //     scope.$watch('data.visible', (v)=>{
                //         if(v!==prevVis){
                //             if(v){
                //                 itemIn.play();
                //             }else{
                //                 itemOut.play();
                //             }
                //             prevVis = v;
                //         }
                //     });
                

                //     let itemOut = anime({
                //         targets: '.trivia-item',
                //         translateY: [0,50],
                //         opacity:[1,0],
                //         duration:250,
                //         loop: false,
                //         autoplay: false,
                //         easing: 'easeInOutSine'
                //     });

                    
                //     let itemIn = anime({
                //         targets: '.trivia-item',
                //         translateY: [-50,0],
                //         opacity:[0,1],
                //         duration:250,
                //         loop: false,
                //         autoplay: false,
                //         easing: 'easeInOutSine'
                //     });
                // }
            }
        };
    });