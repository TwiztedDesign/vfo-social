angular.module('socialApp',[])
    .controller('socialController', ['$scope','$http','$sce', function($scope, $http, $sce) {
        $scope.selectedTab = 'timeline';
        $scope.data = vff.state;
        $scope.style = vff.style
        $scope.edit = false;
        $scope.ready = false;
        $scope.engVisibility=true;
        $scope.settingsMenu=false;
        $scope.selectedSettings='';
        $scope.themes = themes;
        $scope.cameraSwitch=false;
        $scope.isMobile = vff.isMobile;
        $scope.apps = {};
        $scope.isChanged=false;
        $scope.selectedCamera = {
            crop: [0,0,1,1]
        }
        $scope.chatNewMsg=0;

        $scope.data.timeline = vff.state.timeline ||
        {        
            visible:false,
            showAvatars:false,
            showTimestamps:true,
            items:[]
        }

        $scope.data.twitter = vff.state.twitter ||
        {        
            visible:false,
            handle:'',
            fetchUrl:'',
            appKey:''
        }

        $scope.data.trivia = vff.state.trivia || {
            visible:false,
            time:30,
            multipleQuestions:false,
            items:[]
        }

        $scope.data.rss = vff.state.rss || {
            url:'',
            visible:false,
        }

        $scope.data.chat = vff.state.chat || {
            visible:false,
        }

        $scope.data.banner = vff.state.banner || {
            visible:false
        }

        $scope.data.cameraSwitch = vff.state.cameraSwitch || {
            cameras:[
                {
                    name:'Camera 1',
                    crop: [0,0,0.5,0.5]
                },
                {
                    name:'Camera 2',
                    crop: [0.5,0,1,0.5]
                },
                {
                    name:'Camera 3',
                    crop: [0,0.5,0.5,1]
                },
                {
                    name:'Camera 4',
                    crop: [0.5,0.5,1,1]
                }
            ]
        }

        $scope.data.settings = vff.state.settings ||
        {
            contentAlign:'left',
            allowToggle:true,
            resizeVideo:true,
            toggleText:'Toggle',
            bgImage:'',
            header:{
                logo:'',
                title:'',
                subtitle:''
            }
        }

        $scope.data.externalLinks = vff.state.externalLinks || [];

        $scope.selectTab = function(tab) {
            $scope.selectedTab = tab;
            $scope.selectedSettings = tab;
        };

        $scope.getTrustedUrl = function(url){
            return $sce.trustAsResourceUrl(url);
        };

        $scope.showTabs = function(){
            let count=0;
            let firstTab=''
            if($scope.data.timeline.visible){
                count++;
            }
            if($scope.data.twitter.visible){
                count++;
            }
            if($scope.data.trivia.visible){
                count++;
            }
            if($scope.data.rss.visible){
                count++;
            }
            if($scope.data.chat.visible){
                count++;
            }
            count+=$scope.data.externalLinks.length;
            return count>1;
        }

        $scope.$watch('data',()=>{
            $scope.isChanged = true;
        }, true);

        $scope.$watch('selectedTab',()=>{
            if($scope.selectedTab==='chat'){
                $scope.chatNewMsg=0;
            }
        }, true);

        $scope.toggleEng = function(){
            if($scope.data.settings.allowToggle){
                $scope.engVisibility = !$scope.engVisibility;
                handleOrientation();
            }else{
                return;
            }
        }

        $scope.save = function(){
            vff.send();
            $scope.isChanged=false;
            console.log("SAVE");
        }

        $scope.toggleSettingsMenu = function(menu){
            if(!$scope.settingsMenu || menu!==$scope.selectedSettings){
                $scope.selectedSettings = menu || 'general';
                $scope.settingsMenu = true;
                $scope.engVisibility = true;
                handleOrientation();   
            }
        }

        $scope.saveSettings = function(){
            $scope.settingsMenu = false;
            $scope.save();
        }

        $scope.toggleAlignment = function(){
            if($scope.data.settings.contentAlign==='right'){
                $scope.data.settings.contentAlign='left';
            }else{
                $scope.data.settings.contentAlign='right';
            }
            $scope.engVisibility = true;
            $scope.save();
            handleOrientation();        
        }

        $scope.clearHeaderLogo = function(){
            $scope.data.settings.header.logo='';
            $scope.save();
        }

        $scope.clearBg = function(){
            $scope.data.settings.bgImage='';
            $scope.save();
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

        $scope.switchCamera = function(camera){
            $scope.selectedCamera = camera;
            handleOrientation();
        }

        $scope.temp={
            twitterHandle:''
        }
        $scope.setTwitterHandle = function(){
            $scope.data.twitter.handle = $scope.temp.twitterHandle;
        }

        vff.ready(()=>{
            $scope.edit = vff.isController();
            handleOrientation();
            $scope.ready = true;
            $scope.$apply();
        });

        vff.onModeChange(() => {
            $scope.edit = vff.isController();
            handleOrientation();
            $scope.$apply();
        });

        vff.onStateChange(e => {
            handleOrientation();
            $scope.temp.twitterHandle = $scope.data.twitter.handle;
            $scope.$apply();
            $scope.fetchRss();
            $scope.fetchTweets();
            $scope.connectChat();

            if(!vff.isController()){
                $scope.selectedTab = entryPoint();
            }
        });

        vff.onDeviceChange((e)=>{
            $scope.isMobile = vff.isMobile;
            $scope.$apply();
        });

        vff.video.getInfo().then((video)=>{
            $scope.cameraSwitch = (video.metadata && video.metadata.cameraSwitch) || false;
            if($scope.cameraSwitch){
                $scope.selectedCamera = $scope.data.cameraSwitch.cameras[0];
            }
        });

        vff.getApps().then((apps)=>{
            $scope.apps.twitter = apps.filter((app)=>app.type==='twitter');
            $scope.apps.chat = apps.filter((app)=>app.type==='chat');
        }); 
        
        let background = document.getElementById('background');
        function handleOrientation() {
            if (vff.isMobile || (!$scope.engVisibility && $scope.data.settings.allowToggle)) {
                vff.transform($scope.selectedCamera.crop[0],$scope.selectedCamera.crop[1],$scope.selectedCamera.crop[2],$scope.selectedCamera.crop[3],0);
                background.style.display = 'none';
            } else {
                background.style.display = 'block';
                if($scope.data.settings.contentAlign==='right'){
                    vff.transform($scope.selectedCamera.crop[0],$scope.selectedCamera.crop[1],$scope.selectedCamera.crop[2],$scope.selectedCamera.crop[3],0, 0.125, 0.75, 0.875);
                }else{
                    vff.transform($scope.selectedCamera.crop[0],$scope.selectedCamera.crop[1],$scope.selectedCamera.crop[2],$scope.selectedCamera.crop[3],0.25, 0.125, 1, 0.875);
                }
            }
        }

        //handleOrientation();
        window.addEventListener('resize', handleOrientation);  

        //Select first available tab
        function entryPoint(){         
            if($scope.data.twitter.visible){
                return 'twitter';
            }
            if($scope.data.timeline.visible){
                return 'timeline';
            }
            if($scope.data.trivia.visible){
                return 'trivia';
            }
            if($scope.data.rss.visible){
                return 'rss';
            }
            if($scope.data.chat.visible){
                return 'chat';
            } 
            return'';           
        };
    }]);