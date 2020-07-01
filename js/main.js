angular.module('socialApp',[])
    .controller('socialController', ['$scope','$http', function($scope, $http) {
        $scope.selectedTab = 'chat';
        $scope.igData = igData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;

        $scope.data = {
            bgImage:'',
            header:{
                header:'Nuggets',
                subHeader:'Denver',
                logo:'https://www.videoflow.io/img/logo2.svg',
                // links:[
                //     {
                //         name:'',
                //         url:''
                //     },
                //     {
                //         name:'',
                //         url:''
                //     },
                //     {
                //         name:'',
                //         url:''
                //     }
                // ]
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
        $scope.chat=[
            {
                name:"Jan Umansky",
                time:"Tue Jun 30 22:31:08 +0000 2020",
                text:"Let's go NUGGETS!!!"
            },
            {
                name:"Don josh",
                time:"Tue Jun 30 22:31:12 +0000 2020",
                text:"This is the greatest game ever!"
            },
            {
                name:"Mandy Mack",
                time:"Tue Jun 30 22:31:14 +0000 2020",
                text:"Love #DanIssel"
            },
            {
                name:"ClarkP",
                time:"Tue Jun 30 22:31:17 +0000 2020",
                text:"Nuggets RULE!!!"
            },
            {
                name:"George McProductMan",
                time:"Tue Jun 30 22:31:20 +0000 2020",
                text:"Yeah! Clark~~~~~"
            }
        ];

        $scope.postChat = function(){
            $scope.chat.push({
                name:"Anonymous user",
                time:function(){
                    return (new Date()).now();
                },
                text:$scope.newChatItem
            });

            $scope.newChatItem='';

            setTimeout(function(){
                let objDiv = document.getElementById("chat-view");
                objDiv.scrollTop = objDiv.scrollHeight+1000;
            },100);

        };

        $scope.twitter =[];
        $scope.activationItems=[
            {
                id: 1,
                type: 'poll',
                style: 'list',
                duration: "30",
                visible: true,
                question: "Who is your favorite Nugget of all time?",

                answers: [
                    {
                        value: '',
                        text: "Dan Issel",
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/dan-issel.jpg'
                    },
                    {
                        value: '',
                        text: 'David Thompson',
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/david-thompson.jpg'
                    },
                    {
                        value: '',
                        text: 'Carmelo Anthony',
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/carmelo-anthony.jpg'
                    },
                    {
                        value: '',
                        text: "Dikembe Mutombo",
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/dikembe-mutombo.jpg'
                    }
                ]

            },
            {
                id: 2,
                type: 'poll',
                style: 'gallery',
                duration: "30",
                visible: true,
                question: "Who in your favorite Nugget crunch time scorer of all-Time",

                answers: [
                    {
                        value: '',
                        text: "Dan Issel",
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/dan-issel.jpg'
                    },
                    {
                        value: '',
                        text: 'Carmelo Anthony',
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/carmelo-anthony.jpg'
                    }
                ]
            },
            {
                id: 1,
                type: 'poll',
                style: 'list',
                duration: "30",
                visible: true,
                question: "Who's your favorite Nugget today?",

                answers: [
                    {
                        value: '',
                        result:25,
                        text: "Nikola Jokic",
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/nikola-jokic.jpg'
                    },
                    {
                        value: '',
                        result:30,
                        text: 'Jamal Murray',
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/jamal-murray.jpg'
                    },
                    {
                        value: '',
                        result:8,
                        text: 'Will Barton',
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/michael-porter.jpg'
                    },
                    {
                        value: '',
                        result:37,
                        text: "Michael Jordan",
                        media: 'https://overlay.videoflow.io/5efbdc6847408700135ac603/img/will-barton.jpg'
                    }
                ]

            },
        ];


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

        let integrationKey = 'BJl4MiIt0IrybVGsIFALBJf4fjUKA8';

        function getTweets(handle){
            return new Promise((resolve, reject) => {
                $http.get(`https://www.videoflow.io/ext/${integrationKey}/tweets?handle=${handle}`).then(res => {
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

                Object.assign($scope.activationItems, e.data.engagements);
                // let item = $scope.activationItems.find(i => i.question === e.data.question);
                // if(item){
                //     Object.assign(item, e.data);
                // } else {
                //     $scope.activationItems.unshift(e.data);
                // }
                $scope.$apply();

            }
        }
        // vff.onController('engagements', (e) => {
        //     $scope.activationItems = e.data;
        //     $scope.activationItems.forEach(item => {
        //         try { item.style = JSON.parse(item.style)[0].key; } catch(e){}
        //         try { item.duration = JSON.parse(item.duration)[0].key; } catch(e){}
        //     });
        //     // Object.assign($scope.activationItems, e.data);
        //     $scope.$apply();
        // })
        // vff.on('engagements', engagementHandler());
        // Array.from(Array(100), (_, i) => (i) + "").forEach(e => vff.on(e, engagementHandler()));

        // setInterval(function(){
        //     getTweets('nuggets').then((tweets) => {
        //         console.log(tweets)
        //     })
        // },300 * 1000);




    }]);