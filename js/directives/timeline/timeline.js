angular.module('socialApp')
    .directive('timeline',function(){
        return{
            restrict: 'E',
            //templateUrl:'/js/directives/timeline/timeline.html',
            template:`
            <div class="timeline" ng-class="{edit:edit}" >
                <div class="tl-items scroll" sortable="data.items">
                    <div class="tl-item" ng-repeat="item in data.items">
                        <div class="tl-item-menu" ng-if="edit">
                            <div class="tl-item-menu-button sort-handle">
                                <i class="fa fa-bars" aria-hidden="true"></i>
                                <div class="tl-item-menu-button-tooltip">Drag to reorder</div>
                            </div>
                            <div class="tl-item-menu-button" ng-click="duplicate(item)">
                                <i class="fa fa-clone" aria-hidden="true"></i>
                                <div class="tl-item-menu-button-tooltip">Duplicate item</div>
                            </div>
                            <div class="tl-item-menu-button" ng-click="remove(item)">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                                <div class="tl-item-menu-button-tooltip">Remove item</div>
                            </div>
                            <div class="tl-item-menu-button" ng-click="getTime(item)">
                                <i class="fa fa-clock-o" aria-hidden="true"></i>
                                <div class="tl-item-menu-button-tooltip">Set timestamp</div>
                            </div>
                        </div>
                        <div class="tl-item-content">
                            <div class="tl-item-avatars-wrap" ng-if="data.showAvatars">
                                <div class="tl-item-avatars" sortable="item.imgs">
                                    <div class="tl-item-avatar" ng-class="{'sort-handle':edit}" ng-repeat="img in item.imgs" >
                                        <img ng-src="{{img}}"/>
                                    </div>
                                    <div class="tl-item-img" ng-class="{'sort-handle':edit}" ng-if="(!item.imgs || item.imgs.length===0) && !edit"></div>
                                </div>
                                <div class="tl-item-avatars-menu" ng-if="edit">
                                    <div class="tl-item-avatars-menu-item">
                                        <i class="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="tl-item-time" ng-if="data.showTimestamps">
                                <div class="tl-item-time-wrap">
                                    <span class="tl-item-time-content" ng-if="!edit">{{item.time | timecode}}</span>
                                    <span class="tl-item-time-placeholder">00:00:00</span>
                                    <input ng-model="item.time" ng-if="edit" class="edit-text" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;"/>
                                </div>
                            </div>
                            <div class="tl-item-info">
                                <div class="tl-item-header" ng-if="edit?true:item.header && item.header!==''">
                                    <span ng-if="!edit">{{item.header}}</span>
                                    <input placeholder="Title" ng-model="item.header" ng-if="edit" class="edit-text"/>
                                </div>
                                <div class="tl-item-img" ng-if="edit?true:item.img && item.img!==''">
                                    <img ng-if="item.img && item.img!==''" ng-src="{{item.img}}"/>
                                    <div class="tl-item-img-menu" ng-class="{static:!item.img && item.img===''}" ng-if="edit">
                                        <div class="tl-item-img-menu-button" ng-if="edit" value="item.img" image-browser>
                                            <i class="fa fa-picture-o" aria-hidden="true"></i>
                                            <i class="fa fa-cog fa-spin loader"></i>
                                        </div>
                                        <div class="tl-item-img-menu-button" ng-if="edit && item.img && item.img!==''" ng-click="clearImage(item)">
                                            <i class="fa fa-trash" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="tl-item-desc" ng-if="edit?true:item.desc && item.desc!==''">
                                    <span ng-if="!edit">{{item.desc}}</span>
                                    <textarea placeholder="Description" rows="5" ng-model="item.desc" ng-if="edit" class="edit-text"></textarea>
                                </div>
                                <div class="tl-item-cta" ng-if="edit?true:item.cta && item.cta!==''">
                                    <span ng-if="!edit">{{item.cta}}</span>
                                    <input placeholder="Call to Action" ng-model="item.cta" ng-if="edit" class="edit-text"/>
                                </div>
                            </div>
                        </div>
                        <div class="tl-item-click" ng-click="gotoTime(item.time)" ng-if="!edit"></div>
                    </div>
                </div>
                <div class="tl-menu" ng-if="edit">
                    <div class="tl-menu-item" ng-click="newItem()">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                        <span>New item</span>
                    </div>
                    <div class="tl-menu-item" ng-click="save()">
                        <i class="fa fa-cloud-upload" aria-hidden="true"></i>
                        <span>Save</span>
                    </div>
                </div>
            </div>
            `,
            replace:true,
            scope:{
                data : '=',
                edit: '='
            },
            link: function (scope) {
                let newItem = {
                    imgs:[],
                    header:"",
                    desc:"",
                    img: "",
                    time:0,
                    cta:""
                }

                scope.style = vff.style;

                scope.newItem = function(){
                    scope.data.items.push(JSON.parse(JSON.stringify(newItem)));
                }

                scope.duplicate = function(item){
                    //Use angular.toJson to strip $$hashKey (default track by value) from the object forcing the ng-repeat to create a new one
                    scope.data.items.splice(scope.data.items.indexOf(item),0,JSON.parse(angular.toJson(item)));
                }

                scope.remove = function(item){
                    if (window.confirm("Delete current item?")) { 
                        scope.data.items.splice(scope.data.items.indexOf(item),1);
                    }
                }

                scope.clearImage = function(item){
                    item.img='';
                }

                scope.getTime = function(item){
                    item.time = vff.video.currentTime;
                };
                scope.gotoTime = function(seconds){
                    try { seconds = parseFloat(seconds);} catch (e) { }
                    vff.video.goTo(seconds);
                };

                scope.save = function(){
                    scope.itemsMenu=false;
                    vff.send();
                }
            }
        }
    })

    .filter('timecode', function() {
        return function(timestamp) {
            let hours = Math.floor(timestamp / 60 / 60);
            let minutes = Math.floor(timestamp / 60) - (hours * 60);
            let seconds = Math.floor(timestamp % 60);
            return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        };
    });