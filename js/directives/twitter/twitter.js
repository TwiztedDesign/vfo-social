angular.module('socialApp')
    .directive('twitter',function($http){
        return{
            restrict: 'E',
            templateUrl:'/js/directives/twitter/twitter.html',
            replace:true,
            scope:{
                data : '=',
                isController: '='
            },
            link: function (scope) {
                let integrationKey = 'BJl4MiIt0IrybVGsIFALBJf4fjUKA8';
                function getTweets(handle){
                    return new Promise((resolve, reject) => {
                        $http.get(`https://www.videoflow.io/ext/${integrationKey}/tweets?handle=${handle}`).then(res => {
                            let tweets = res.data.data;
                            resolve(tweets);
                        }, reject);
                    })
                }
        
                getTweets(scope.handle).then((tweets) => {
                    console.log(tweets);
                    scope.tweets = tweets;
                    scope.$apply();
                });
            }
        }
    });