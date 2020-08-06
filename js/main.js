angular.module('socialApp',[])
    .controller('socialController', ['$scope','$http', function($scope, $http) {
        $scope.selectedTab = 'timeline';

        $scope.data = {
            bgImage:'',
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
                        header:"test",
                        desc:"TEST TEST TEST",
                        img: "../../../img/david-thompson.jpg",
                        cta:"Click ME!"
                    }
                ]
            }
        };

        $scope.twitter =[];


        vff.onController('data',(e)=>{
            Object.assign($scope.data,e.data);
            $scope.$apply();
        }, {changeOnly : false});

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
                vff.transform(0,0,1,1,0, 0.125, 0.75, 0.875);
            }
        }

        handleOrientation();
        window.addEventListener('resize', handleOrientation);

        
    }]);