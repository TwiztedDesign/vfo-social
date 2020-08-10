angular.module('socialApp')
    .directive('twitter',function($http){
        return{
            restrict: 'E',
            templateUrl:'/js/directives/twitter/twitter.html',
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
                        $http.get(`https://www.videoflow.io/ext/${integrationKey}/tweets?handle=${scope.data.handle}`).then(res => {
                            let tweets = res.data.data;
                            resolve(tweets);
                        }, reject);
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