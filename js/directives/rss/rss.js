angular.module('socialApp')
    .directive('rss',function($sce){
        return{
            restrict: 'E',
            template:`
            <div class="rss">
                <div class="style-editor scroll" ng-if="edit">
                    <div class="style-editor-columns">
                        <div class="style-editor-column">
                            <div class="editor-block">
                                <input type="checkbox" id="showTmeline" ng-model="data.rss.visible"/>
                                <label for="showTmeline">Visible</label>
                            </div>
                            <div class="editor-block">
                                <label class="editor-block-title">URL</label>
                                <input type="text" ng-model="data.rss.url"/>
                                <div class="editor-button" ng-click="fetchRss(true)">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="rss-items scroll">
                    <div class="rss-item" ng-repeat="entry in rssFeed">
                        <div class="rss-item-title" ng-bind-html="entry.title | trustHtml"></div>
                        <div class="rss-item-summary" ng-bind-html="entry.summary | trustHtml"></div>
                        <div class="rss-item-image" ng-repeat="image in entry.enclosures | filter:'image/jpeg'">
                            <img ng-src="{{image.url}}"/>
                        </div>
                    </div>
                </div>
            </div>
            `,
            replace:true,
            // scope:{
            //     data : '=',
            //     edit: '=',
            //     control: '='
            // },
            link: function ($scope) {
                $scope.sce= $sce;
                let source = '';

                $scope.fetchRss= function(force){
                    
                    if($scope.data.rss.url && $scope.data.rss.url!==''){
                        if(force || $scope.data.rss.url !== source){
                            feednami.load($scope.data.rss.url)
                            .then(feed => {
                                $scope.rssFeed= feed.entries;
                                console.log(feed);
                                source = $scope.data.rss.url;
                                $scope.$apply();

                                if(force){
                                    $scope.save();
                                }
                            });
                        }
                    }else{
                        $scope.rssFeed=[];
                    }
                };

                $scope.fetchRss(true);
            }
        };
    })
    .filter('trustHtml',function($sce){
        return function(html){
          return $sce.trustAsHtml(html.replace(/<a/g,'<a target="_blank"'));
        }
      });