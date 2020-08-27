angular.module('socialApp')
    .directive('twitter',function($http){
        return{
            restrict: 'E',
            //templateUrl:'/js/directives/twitter/twitter.html',
            template:`
            <div class="tweets scroll">
                <tweet tweet="tweet" ng-repeat="tweet in tweets"></tweet>
            </div>
            `,
            replace:true,
            scope:{
                data : '=',
                edit: '='
            },
            link: function (scope) {
                scope.$watch('data.handle', () => {
                    getTweets().then((tweets) => {
                        console.log(tweets);
                        scope.tweets = tweets;
                        scope.$apply();
                    });
                });

                scope.tweets =[];
                let integrationKey = 'BJl4MiIt0IrybVGsIFALBJf4fjUKA8';
                function getTweets(){
                    return new Promise((resolve, reject) => {
                        if(scope.data.handle && scope.data.handle!==''){
                            $http.get(`https://www.videoflow.io/ext/${integrationKey}/tweets?handle=${scope.data.handle}`).then(res => {
                                let tweets = res.data.data;
                                resolve(tweets);
                            }, reject);
                        }
                        else{
                            resolve([]);
                        }
                    })
                }
        
                getTweets().then((tweets) => {
                    console.log(tweets);
                    scope.tweets = tweets;
                    scope.$apply();
                });
            }
        }
    });