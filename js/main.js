angular.module('socialApp',[])
    .controller('socialController', ['$scope','$http', function($scope, $http) {
        $scope.selectedTab = 'timeline';
        $scope.data = vff.state.data;
        $scope.style = vff.state.data.__style;
        $scope.edit = false;
        $scope.ready = false;
        $scope.engVisibility=true;

        $scope.data.timeline = $scope.data.timeline ||  
        {        
            visible:true,
            showAvatars:false,
            items:[
                {
                    imgs:[],
                    header:"",
                    desc:"",
                    img: "",
                    time:0,
                    cta:""
                }
            ]
        }

        $scope.data.settings = $scope.data.settings || 
        {
            contentAlign:'left',
            allowToggle:true,
            resizeVideo:true,
            bgImage:''
        }

        $scope.twitter =[];
        $scope.selectTab = function(tab) {
            $scope.selectedTab = tab;
        };

        $scope.showTabs = function(){
            let count=0;
            if($scope.data.timeline.visible){
                count++;
            }
            return count>1;
        }

        $scope.toggleEng = function(){
            if($scope.data.settings.allowToggle){
                $scope.engVisibility = !$scope.engVisibility;
                handleOrientation();
            }else{
                return;
            }
        }

        vff.ready(()=>{
            $scope.edit = vff.isController();
            $scope.$apply();

            handleOrientation();
            $scope.ready = true;
        });

        vff.state.on(e => {
            handleOrientation();
            $scope.$apply();
        });

        

        let background = document.getElementById('background');
        function handleOrientation() {
            if (vff.isMobile || (!$scope.engVisibility && $scope.data.settings.allowToggle)) {
                vff.transform(0,0,1,1,0);
                background.style.display = 'none';
            } else {
                background.style.display = 'block';
                if($scope.data.settings.contentAlign==='right'){
                    vff.transform(0,0,1,1,0, 0.125, 0.75, 0.875);
                }else{
                    vff.transform(0,0,1,1,0.25, 0.125, 1, 0.875);
                }
            }
        }

        //handleOrientation();
        window.addEventListener('resize', handleOrientation);

        
    }]);