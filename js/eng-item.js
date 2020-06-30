angular.module('socialApp')
    .directive('engItem', [function() {
        return {
            restrict    : 'E',
            template:`<div ng-switch="item.type">
                            <div ng-switch-case="poll" class="eng-item poll" ng-class="item.style">
                                <div class="eng-item-timer">
                                    <div class="eng-item-timer-line animate" ng-style="{'transition-duration': item.time+ 's'}"></div>
                                </div>
                                <div class="eng-item-header">{{item.question}}</div>
                                <div class="eng-item-answers">
<!--                                    <a class="eng-item-answer" ng-class="{selected: answer.selected && (!answer.result || answer.result===''), disabled: answer.result && answer.result!==''}" ng-repeat="answer in item.answers" ng-click="selectAnswer(answer)">-->
                                    <a class="eng-item-answer" ng-class="{selected: answer.selected && (!answer.result || answer.result===''), disabled: item.disabled}" ng-repeat="answer in item.answers" ng-click="selectAnswer(answer)" ng-if="answer.text!==''">
                                        <img class="eng-item-answer-media" ng-if="answer.media && answer.media!==''" src="{{answer.media}}"/>
                                        <div  class="eng-item-answer-text" ng-if="!answer.result || answer.result===''">
                                            <div>{{answer.text}}</div>
                                        </div>
                                        <div class="eng-item-answer-result" ng-if="answer.result && answer.result!==''">
                                            <div class="eng-item-answer-result-bar" ng-style="{width : answer.result+'%'}"></div>
                                            <div class="eng-item-answer-result-text">{{answer.result}}%</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>`,
            replace: true,
            scope       :{
                item   : '='
            },
            link        : function(scope,element,attr) {
                scope.selectAnswer=function(answer){
                    scope.item.answers.forEach(function(a){
                        a.selected=false;
                    });

                    answer.selected = true;
                };
            }
        }
    }]);