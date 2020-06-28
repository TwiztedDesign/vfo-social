angular.module('socialApp',[])
    .controller('socialController', ['$scope','$http', function($scope, $http) {
        $scope.selectedTab = 'twitter';

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
                feed:[]
            },
            activation:{
                visible:true,
                header:{
                    text:'This interactive experience is brough to you by the best company in the world!',
                    media:'https://montecarlo.vteximg.com.br/arquivos/ids/214433/Jolie_CocaCola_categoria-2.jpg?v=636773614271570000'
                },
                items:[
                    {
                        type: 'poll',
                        style: 'list',
                        question:'who is your favorite player?',
                        answers:[
                            {
                                value:'option1',
                                text:'This is option1',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option2',
                                text:'This is option2',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option3',
                                text:'This is option3',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option4',
                                text:'This is option4',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            }
                        ]
                    },
                    {
                        type: 'poll',
                        style: 'gallery',
                        disabled:true,
                        question:'who is your favorite player?',
                        answers:[
                            {
                                value:'option1',
                                text:'This is option1 sdfsad fasdf asdf ',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option2',
                                text:'This is option2',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            }
                        ]
                    },
                    {
                        type: 'poll',
                        style: 'gallery',
                        disabled:true,
                        question:'who is your favorite player?',
                        answers:[
                            {
                                value:'option1',
                                text:'This is option1 sdfsad fasdf asdf ',
                                result:10,
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option2',
                                text:'This is option2',
                                result:20,
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option3',
                                text:'This is option1 sdfsad fasdf asdf ',
                                result:55,
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option4',
                                text:'This is option2',
                                result:15,
                                media:'https://www.videoflow.io/img/logo2.svg'
                            }
                        ]
                    },
                    {
                        type: 'poll',
                        style: 'list',
                        question:'who is your favorite player?',
                        answers:[
                            {
                                value:'option1',
                                text:'This is option1',
                                result:25,
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option2',
                                text:'This is option2',
                                result:30,
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option3',
                                text:'This is option3',
                                result:45,
                                media:'https://www.videoflow.io/img/logo2.svg'
                            }
                        ]
                    },
                    {
                        type: 'poll',
                        style: 'list',
                        question:'who is your favorite player?',
                        answers:[
                            {
                                value:'option1',
                                text:'This is option1',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option2',
                                text:'This is option2',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option3',
                                text:'This is option3',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option4',
                                text:'This is option4',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            }
                        ]
                    },
                    {
                        type: 'poll',
                        style: 'list',
                        question:'who is your favorite player?',
                        answers:[
                            {
                                value:'option1',
                                text:'This is option1',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option2',
                                text:'This is option2',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option3',
                                text:'This is option3',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            },
                            {
                                value:'option4',
                                text:'This is option4',
                                media:'https://www.videoflow.io/img/logo2.svg'
                            }
                        ]
                    }
                ]
            }
        };

        $scope.selectTab = function(tab) {
            $scope.selectedTab = tab;
        };

        $scope.selectAnswer=function(activation, answer){
            activation.answers.forEach(function(a){
                a.selected=false;
            });

            answer.selected = true;
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

        let integrationKey = 'BJedgoUUA8ryZuljUIC8SkfOxiUU0U';
        let twitterHandle = 'nuggets';

        function getTweets(handle){
            return new Promise((resolve, reject) => {
                $http.get(`http://localhost:3002/ext/${integrationKey}/tweets?handle=${handle}`).then(res => {
                    let tweets = res.data.data;
                    resolve(tweets);
                }, reject);
            })
        }
        getTweets(twitterHandle).then((tweets) => {
            console.log(tweets);
            $scope.data.twitter.feed = tweets;
            $scope.$apply();
        });
        // setInterval(function(){
        //     getTweets('nuggets').then((tweets) => {
        //         console.log(tweets)
        //     })
        // },300 * 1000);




    }]);