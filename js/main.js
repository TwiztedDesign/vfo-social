angular.module('socialApp',[])
    .controller('socialController', ['$scope','$http', function($scope, $http) {
        $scope.selectedTab = 'eng';

        $scope.data = {
            bgImage:'',
            header:{
                header:'Nuggets',
                subHeader:'Denver',
                logo:'https://www.videoflow.io/img/logo2.svg',
                links:[
                    {
                        name:'Google',
                        url:'https://www.google.com'
                    },
                    {
                        name:'Twitter',
                        url:'https://www.twitter.com'
                    },
                    {
                        name:'Facebook',
                        url:'https://www.facebook.com'
                    }
                ]
            },
            twitter     : {
                visible: true,
                handle: 'nuggets'
            },
            activation:{
                visible:true,
                header:{
                    text:'',
                    media:''
                },
                items:[]
            }
        };

        $scope.twitter =[];
        $scope.activationItems=[];


        vff.onController('data',(e)=>{
            $scope.data = e.data;
            $scope.$apply();
        }, {changeOnly : false});

        $scope.selectTab = function(tab) {
            $scope.selectedTab = tab;
        };

        let background = document.getElementById('background');
        function handleOrientation() {
            if (window.innerWidth < window.innerHeight || $scope.engVisibility) {
                console.log("FS", window.innerWidth, window.innerHeight);
                vff.transform(0,0,1,1,0);
                background.style.display = 'none';
            } else {
                console.log("TRANSFORM", window.innerWidth, window.innerHeight);
                background.style.display = 'block';
                vff.transform(0,0,1,1,0, 0.125, 0.75, 0.875);
            }
        }

        handleOrientation();
        window.addEventListener('resize', handleOrientation);

        let integrationKey = 'BJedgoUUA8ryZuljUIC8SkfOxiUU0U';

        function getTweets(handle){
            return new Promise((resolve, reject) => {
                $http.get(`http://localhost:3002/ext/${integrationKey}/tweets?handle=${handle}`).then(res => {
                    let tweets = res.data.data;
                    resolve(tweets);
                }, reject);
            })
        }
        getTweets($scope.data.twitter.handle).then((tweets) => {
            console.log(tweets);
            $scope.twitter = tweets;
            $scope.$apply();
        });

        function engagementHandler(){
            return function(e){

                let item = $scope.activationItems.find(i => i.id === e.data.id);
                if(item){
                    Object.assign(item, e.data);
                } else {
                    $scope.activationItems.unshift(e.data);
                }
                $scope.$apply();

            }
        }
        Array.from(Array(100), (_, i) => (i + 1) + "").forEach(e => vff.on(e, engagementHandler()));

        // setInterval(function(){
        //     getTweets('nuggets').then((tweets) => {
        //         console.log(tweets)
        //     })
        // },300 * 1000);




    }]);