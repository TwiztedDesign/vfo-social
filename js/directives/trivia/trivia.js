angular.module('socialApp')
    .directive('trivia',function(){
        return{
            restrict: 'E',
            template:`
            <div class="trivia" ng-class="{edit:edit}">
                <div class="style-editor scroll" ng-if="edit">
                    <div class="style-editor-columns">
                        <div class="style-editor-column">
                            <div class="editor-block">
                                <input type="checkbox" id="showTrivia" ng-model="data.trivia.visible">
                                <label for="showTrivia">Visible</label>
                            </div>
                            <div class="editor-block">
                                <input type="checkbox" id="showMultipleQuestions" ng-model="data.trivia.multipleQuestions">
                                <label for="showMultipleQuestions">Show multiple questions</label>
                            </div>
                            <div class="editor-block">
                                <label class="editor-block-title">Selected answer background</label>
                                <color-picker value="style.triviaItemSelectedAnswerBg" default="transparent"></color-picker>
                            </div>
                            <div class="editor-block">
                                <label class="editor-block-title">Selected answer color</label>
                                <color-picker value="style.triviaItemSelectedAnswerColor" default="#5D8097"></color-picker>
                            </div>
                            <div class="editor-block">
                                <label class="editor-block-title">Correct answer background</label>
                                <color-picker value="style.triviaItemCorrectAnswerBg" default="#0a490a"></color-picker>
                            </div>
                            <div class="editor-block">
                                <label class="editor-block-title">Correct answer color</label>
                                <color-picker value="style.triviaItemCorrectAnswerColor" default="#ffffff"></color-picker>
                            </div>
                        </div>
                        <div class="style-editor-column">
                            <div class="editor-block">
                                <label class="editor-block-title">Wrong answer background</label>
                                <color-picker value="style.triviaItemWrongAnswerBg" default="#a81515"></color-picker>
                            </div>
                            <div class="editor-block">
                                <label class="editor-block-title">Wrong answer color</label>
                                <color-picker value="style.triviaItemWrongAnswerColor" default="#ffffff"></color-picker>
                            </div>
                        </div>
                    </div>                            
                </div>
            
                <div class="trivia-items scroll" sortable="data.trivia.items">
                    <trivia-item class="trivia-item" ng-repeat="item in data.trivia.items" data="item" edit="edit" ng-if="edit || item.visible" show="showTriviaItem(item)" hide="hideTriviaItem(item)"
                    on-remove="removeTriviaItem(item)" on-duplicate="duplicateTriviaItem(item)"></trivia-item>
                </div>
                <div class="tab-menu" ng-if="edit">
                    <div class="tab-menu-item" ng-click="newTriviaItem()">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                        <span>New item</span>
                    </div>
                </div>
            </div>
            `,
            replace:true,
            // scope:{
            //     data : '=',
            //     edit: '=',
            // },
            link: function ($scope) {
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


                $scope.newTriviaItem = function(){
                    $scope.data.trivia.items.push(JSON.parse(JSON.stringify(newItem)));
                }

                $scope.duplicateTiviaItem = function(item){
                    $scope.data.trivia.items.splice($scope.data.trivia.items.indexOf(item),0,JSON.parse(angular.toJson(item)));
                }

                $scope.removeTriviaItem = function(item){
                    if (window.confirm("Delete current item?")) { 
                        $scope.data.trivia.items.splice($scope.data.trivia.items.indexOf(item),1);
                    }
                }

                $scope.showTriviaItem = function(item){
                    if(!$scope.data.trivia.multipleQuestions){
                        $scope.data.trivia.items.forEach((i)=>{
                            i.visible=false;
                        });
                    }

                    item.visible = true;
                    item.enabled = true;

                    vff.send();

                    setTimeout(() => {
                        if(!$scope.data.trivia.multipleQuestions){
                            item.visible = false;
                        }
                        item.enabled= false;
                        vff.send();
                        $scope.$apply();
                    }, $scope.data.trivia.time * 1000);
                }

                $scope.hideTriviaItem = function(item){
                    item.visible=false;
                    item.enabled= false;
                    vff.send();
                }
            }
        }
    });