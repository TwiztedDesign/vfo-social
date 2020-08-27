angular.module('socialApp')
    .directive('rss',function($sce){
        return{
            restrict: 'E',
            templateUrl:'/js/directives/rss/rss.html',
            replace:true,
            scope:{
                data : '=',
                edit: '=',
                control: '='
            },
            link: function (scope) {
                scope.sce= $sce;
                let source = '';

                function fetchRss(fource){
                    
                    if(scope.data.url && scope.data.url!==''){
                        if(fource || scope.data.url !== source){
                            feednami.load(scope.data.url)
                            .then(feed => {
                                scope.feed= feed.entries;
                                console.log(feed);
                                source = scope.data.url;
                                scope.$apply();
                            });
                        }
                    }else{
                        scope.feed=[];
                    }
                };

                fetchRss(true);

                scope.control.fetch = fetchRss;
            }
        };
    })
    .filter('trustHtml',function($sce){
        return function(html){
          return $sce.trustAsHtml(html.replace(/<a/g,'<a target="_blank"'));
        }
      });