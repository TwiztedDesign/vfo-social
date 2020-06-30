angular.module('app',[])

    .controller('ctrl', ['$scope','$http', function($scope, $http) {

        let activity = {
            id : 1,
            type: 'poll',
            style: 'list',
            duration:"30",
            visible:false,
            question:'',

            answers:[
                {
                    value:'',
                    text:'',
                    media:'https://www.videoflow.io/img/logo2.svg'
                },
                {
                    value:'',
                    text:'',
                    media:'https://www.videoflow.io/img/logo2.svg'
                },
                {
                    value:'',
                    text:'',
                    media:'https://www.videoflow.io/img/logo2.svg'
                },
                {
                    value:'',
                    text:'',
                    media:'https://www.videoflow.io/img/logo2.svg'
                }
            ]

        };



        $scope.engagements = [];
        $scope.data = {};

        function createEng(){
            let eng = Object.assign({},activity);
            eng.answers = eng.answers.map(a => Object.assign({}, a));
            return eng;
        }

        $scope.removeEng = function(index){
            $scope.engagements.splice(index, 1);
            if(!$scope.engagements.length){
                $scope.addEng();
            }
        };

        $scope.removeAllEng = function(){
            $scope.hideAllEng();
            vff.data().engagements = [];
            $scope.engagements = [];
            // $scope.addEng();
        };
        $scope.hideAllEng = function(){
            document.querySelectorAll('.eng-visibility').forEach(el => el.value = false);
            $scope.engagements.forEach(e => {
                if(e.visible){
                    $scope.activateEngagement(e);
                }
            });
        };

        $scope.addEng = function(){
            let newEng = createEng();
            // newEng.id = $scope.engagements.length + 1;
            newEng.id = ~~(Math.random()*10000) + "";
            $scope.engagements.push(newEng);//todo handle unshift
            setTimeout(setEngSelectOptions,1);
        };

        $scope.removeEng = function(index){
            $scope.engagements[index].visible = true;
            $scope.activateEngagement($scope.engagements[index]);
            $scope.engagements.splice(index, 1);
            vff.data().engagements.splice(index, 1);
        };


        function setEngSelectOptions(){
            document.querySelectorAll('.eng-style').forEach((el,index) => {
                if(!el.options || !el.options.length){
                    el.options = [{key: 'list', value: 'List'}, {key: 'gallery', value: 'Gallery'}];
                }
                if(!el.value.length){
                    setTimeout(()=>{
                        // $scope.engagements[index].style = [el.options[0]];
                        // el.value = [el.options[0]];
                    },500);

                }
            });
            document.querySelectorAll('.eng-duration').forEach((el, index) => {
                if( !el.options || !el.options.length){
                   el.options = [{key: '15', value: '15 Seconds'}, {key: '30', value: '30 Seconds'}, {key: '60', value: '1 Minute'}];
                }
                if(!el.value.length){
                    setTimeout(()=>{
                        // $scope.engagements[index].duration = [el.options[0]];
                        // el.value = [el.options[0]];
                    },500);
                }
            });
        }

        vff.onController('engagements',(e)=>{
            $scope.engagements = e.data;
            // e.data.forEach((eng, i) => {
            //     if($scope.engagements[i]){
            //         Object.assign($scope.engagements[i], e.data[i]);
            //     } else {
            //         $scope.engagements[i] = e.data[i];
            //     }
            // });
            setTimeout(setEngSelectOptions,1);
            $scope.$apply();
        }, {changeOnly : false});


        function generateRandom(n,sum){
            let numbers = [];
            for (let i = 0; i < n -1; i++) {
                let x = ~~(Math.random()*sum);
                sum -= x;
                numbers.push(x);
            }
            numbers.push(sum);
            return numbers;
        }

        const apiKey = 'SJlBfAtVKUrJZBfAt4tUSkGrMAF4F8'; //Jan
        // const apiKey = 'rk6xesaIP6LBJCelo6LwT8SkyZeiTIw6L'; //Dok
        const eventUrl = `http://localhost:3002/control?projectApiKey=${apiKey}`;


        $scope.activateEngagement = function(item, index){
            item.visible = !item.visible;
            let eng = vff.data().engagements.find((eng)=> eng.id === item.id);
            eng.visible = item.visible;
            // let data = {main : {ui : "custom", value : {data : {engagement : Object.assign(item, {disabled : false,visible: true, duration: 60*1000 , start_time : Date.now()})}}}};
            // let data =  Object.assign(item, {disabled : false, start_time : Date.now()});
            let data =  {engagements : vff.data().engagements};
            let event = {
                channel     : "controller",
                // channel     : 'engagements',
                overlay     : "http://localhost:8080?controls=0&mute=1&transparent=false",
                template    : "Start",
                timecode    : 0,
                query       : "",
                type        : "push",
                initiator   : "controller",
                offset      : 0,
                data : {main:{value:vff.data()}, ui:"custom"},
            };

            // if(eng.style = '[]') eng.style = JSON.stringify([{key: 'list', value: 'List'}]);
            // if(eng.duration = '[]') eng.duration = JSON.stringify([{key: '30', value: '30 Seconds'}]);


            if(!eng.visible) {
                eng.disabled = false;
                eng.answers.map(function (a) {
                    a.result = '';
                    return a;
                });
            }
            $http.post(eventUrl, {event, initiator : "controller"});
            if(item.visible){
                setTimeout(() => {
                    // data.main.value.data.engagement = Object.assign(item, {disabled : true});
                    let eng1 = vff.data().engagements.find((eng)=> eng.id === item.id);
                    eng1.disabled = true;
                    let results = generateRandom(4,100);
                    eng1.answers = item.answers.map(function(a, index){
                        a.result = results[index];
                        return a;
                    });

                    event.data = {main:{value:vff.data()}, ui:"custom"};
                    $http.post(eventUrl, {event, initiator : "controller"});
                },1000 * JSON.parse(eng.duration)[0].key);
            }

        };

    }]);



