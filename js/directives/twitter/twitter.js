angular.module('socialApp')
    .directive('twitter',function($http){
        return{
            restrict: 'E',
            //templateUrl:'/js/directives/twitter/twitter.html',
            template:`
            <div class="twitter">
                <div class="style-editor scroll" ng-if="edit">
                    <div class="style-editor-columns">
                        <div class="style-editor-column">
                            <div class="editor-block">
                                <input type="checkbox" id="showTmeline" ng-model="data.twitter.visible"/>
                                <label for="showTmeline">Visible</label>
                            </div>
                            <div class="editor-block">
                                <label class="editor-block-title">Twitter app</label>
                                <!-- <input ng-model="temp.twitterHandle"/>
                                <div class="editor-button" ng-click="setTwitterHandle()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </div> -->
                                <select ng-model="data.twitter.twitter.fetchUrl" ng-if="apps.twitter && apps.twitter.length>0">
                                    <option ng-repeat="app in apps.twitter" value="{{app.params.fetchUrl}}">{{app.name}}</option>
                                </select>
                                <a href="https://www.videoflow.io/integrations" ng-if="!apps.twitter || apps.twitter.length===0" target="_blank">Add a Twitter app.</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tweets scroll">
                    <tweet tweet="tweet" ng-repeat="tweet in tweets"></tweet>
                </div>
            </div>
            `,
            replace:true,
            // scope:{
            //     data : '=',
            //     edit: '='
            // },
            link: function ($scope) {
                $scope.tweets =[];

                $scope.$watch('data.twitter.twitter.fetchUrl', () => {
                    getTweets().then((data) => {
                        console.log(data);
                        $scope.tweets = data;
                        $scope.$apply();
                    });
                });

                function getTweets(){
                    return new Promise((resolve, reject) => {
                        if($scope.data.twitter.fetchUrl && $scope.data.twitter.fetchUrl!==''){
                            $http.get($scope.data.twitter.fetchUrl).then(res => {
                                let tweets = res.data;
                                resolve(tweets);
                            }, reject);
                        }
                        else{
                            resolve([]);
                        }
                    })
                }
        
                getTweets().then((data) => {
                    console.log(data);
                    $scope.tweets = data;
                    $scope.$apply();
                });
            }
        }
    });