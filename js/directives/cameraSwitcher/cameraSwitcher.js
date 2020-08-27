angular.module('socialApp')
    .directive('cameraSwitcher',function(){
        return{
            restrict: 'E',
            template:`
                <div class="camera-switcher">
                    <div class="camera-switcher-item" ng-repeat="camera in data.cameras" ng-class="{active:selectedCamera===camera}" ng-click="switch(camera)" ng-if="camera.name!=='' || edit">
                        <i class="fa fa-video-camera" aria-hidden="true"></i>
                        <input placeholder="Camera name..." ng-model="camera.name" ng-if="edit" class="edit-text"/>
                        <span ng-if="!edit">{{camera.name}}</span>
                    </div>
                </div>
            `,
            replace:true,
            scope:{
                data:'=',
                edit:'=',
                selectedCamera:'=',
                onSwitch: '&'
            },
            link: function (scope) {
                scope.switch = function(camera){
                    scope.onSwitch()(camera);
                }
            }
        };
    });