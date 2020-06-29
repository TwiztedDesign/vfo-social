angular.module('socialApp',[])
    .controller('socialController', ['$scope','$http', function($scope, $http) {
        $scope.selectedTab = 'eng';
        $scope.twitter =[];

        $scope.data = {
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
                    text:'This interactive experience is brough to you by the best company in the world!',
                    media:'https://montecarlo.vteximg.com.br/arquivos/ids/214433/Jolie_CocaCola_categoria-2.jpg?v=636773614271570000'
                },
                items:[]
            }
        };

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

        let integrationKey = 'Syx4glHG3Ir1WNgeSfhISkGNxxHfnL';

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

                let item = $scope.data.activation.items.find(i => i.id === e.data.id);
                if(item){
                    Object.assign(item, e.data);
                } else {
                    $scope.data.activation.items.unshift(e.data);
                }
                $scope.$apply();

            }
        }
        Array.from(Array(6), (_, i) => (i + 1) + "").forEach(e => vff.on(e, engagementHandler()))

        // setInterval(function(){
        //     getTweets('nuggets').then((tweets) => {
        //         console.log(tweets)
        //     })
        // },300 * 1000);




    }]);