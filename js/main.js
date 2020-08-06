angular.module('socialApp',[])
    .controller('socialController', ['$scope','$http', function($scope, $http) {
        $scope.selectedTab = 'timeline';

        $scope.data = {
            bgImage:'',
            settings:{
                contentAlign:'left'
            },
            header:{
                header:'Nuggets',
                subHeader:'Denver',
                logo:'https://www.videoflow.io/img/logo2.svg',
            },
            twitter     : {
                visible: true,
                handle: 'nuggets'
            },
            timeline:{
                visible:true,
                items:[
                    {
                        imgs:[
                            "../../../img/carmelo-anthony.jpg",
                            "../../../img/dan-issel.jpg",
                            "../../../img/david-thompson.jpg"
                        ],
                        header:"test",
                        desc:"TEST TEST TEST",
                        img: "../../../img/david-thompson.jpg",
                        time:"00:05:34",
                        cta:"Click ME!"
                    }
                ]
            }
        };

        $scope.twitter =[];
        $scope.selectTab = function(tab) {
            $scope.selectedTab = tab;
        };

        let background = document.getElementById('background');
        function handleOrientation() {
            if (vff.isMobile || window.innerWidth < window.innerHeight || $scope.engVisibility) {
                vff.transform(0,0,1,1,0);
                background.style.display = 'none';
            } else {
                background.style.display = 'block';
                if($scope.data.settings.contentAlign==='left'){
                    vff.transform(0,0,1,1,0.25, 0.125, 1, 0.875);
                }else{
                    vff.transform(0,0,1,1,0, 0.125, 0.75, 0.875);
                }
            }
        }

        handleOrientation();
        window.addEventListener('resize', handleOrientation);

        
    }]);