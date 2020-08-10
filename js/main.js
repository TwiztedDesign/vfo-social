angular.module('socialApp',[])
    .controller('socialController', ['$scope','$http', function($scope, $http) {
        $scope.selectedTab = 'timeline';
        $scope.data = vff.state.data;
        $scope.style = vff.state.data.__style;
        $scope.edit = false;
        $scope.ready = false;
        $scope.engVisibility=true;
        $scope.tabsMenu=false;
        $scope.themes = themes;

        $scope.data.timeline = vff.state.data.timeline ||  
        {        
            visible:true,
            showAvatars:false,
            showTimestamps:false,
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

        $scope.data.settings = vff.state.data.settings || 
        {
            contentAlign:'left',
            allowToggle:true,
            resizeVideo:true,
            bgImage:'',
            header:{
                logo:'',
                title:'',
                subtitle:''
            }
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

        $scope.save = function(){
            vff.state.take();
        }

        $scope.toggleTabsMenu = function(){
            if($scope.tabsMenu){
                $scope.save();
            }
            $scope.tabsMenu = !$scope.tabsMenu;
            $scope.engVisibility = true;
            handleOrientation();   
        }

        $scope.saveTabsSettings = function(){
            $scope.tabsMenu = false;
            $scope.save();
        }

        $scope.toggleAlignment = function(){
            if($scope.data.settings.contentAlign==='right'){
                $scope.data.settings.contentAlign='left';
            }else{
                $scope.data.settings.contentAlign='right';
            }
            $scope.engVisibility = true;
            handleOrientation();        
        }

        $scope.clearHeaderLogo = function(){
            $scope.data.settings.header.logo='';
        }

        $scope.clearBg = function(){
            $scope.data.settings.bgImage='';
        }

        $scope.applyTheme = function(theme){
            $scope.style.engTabBg = theme[1];
            $scope.style.engTabColor = theme[2];
            $scope.style.engTabHoverBg = theme[3];
            $scope.style.engTabHoverColor = theme[4];
            $scope.style.engTabActiveBg = theme[3];
            $scope.style.engTabActiveColor = theme[4];
            $scope.style.engTabContentBg = theme[0];
        }

        vff.ready(()=>{
            $scope.edit = vff.isController();
            handleOrientation();
            $scope.ready = true;
            $scope.$apply();
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