angular.module('app',[])

    .controller('ctrl', ['$scope','$http', function($scope, $http) {

        $scope.data = {
            activities:{
                items:[
                    {
                        id  : 1,
                        type: 'poll',
                        style: 'list',
                        visibility:false,
                        time:5,
                        question:'who is your favorite player?',
                        answers:[
                            {
                                value:'option1',
                                text:'This is option1',
                            },
                            {
                                value:'option2',
                                text:'This is option2',
                            },
                            {
                                value:'option3',
                                text:'This is option3',
                            },
                            {
                                value:'option4',
                                text:'This is option4',
                            }
                        ]
                    },
                    {
                        id  : 2,
                        type: 'poll',
                        style: 'gallery',
                        visibility:false,
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
                        id  : 3,
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
                        id  : 4,
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
                        id  : 5,
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
                        id  : 6,
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

        const apiKey = 'rk6xesaIP6LBJCelo6LwT8SkyZeiTIw6L';
        const eventUrl = `http://localhost:3002/control?projectApiKey=${apiKey}`;

        $scope.activateEngagement = function(item){
            // let data = {main : {ui : "custom", value : {data : {engagement : Object.assign(item, {disabled : false,visible: true, duration: 60*1000 , start_time : Date.now()})}}}};
            let data =  Object.assign(item, {disabled : false,visible: true, duration: 60*1000 , start_time : Date.now()});
            let event = {
                // channel     : "controller",
                channel     : item.id+ "",
                overlay     : "http://localhost:8080?controls=0&mute=1&transparent=false",
                template    : "Start",
                timecode    : 0,
                query       : "",
                type        : "push",
                // initiator   : "controller",
                offset      : 0,
                data,
            };
            $http.post(eventUrl, {event, initiator : "controller"});
            setTimeout(() => {
                // data.main.value.data.engagement = Object.assign(item, {disabled : true});
                data = Object.assign(item, {disabled : true});
                $http.post(eventUrl, {event, initiator : "controller"});
            },1000 * 10);
        };
    }]);



