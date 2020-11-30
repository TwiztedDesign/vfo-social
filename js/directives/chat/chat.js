angular.module('socialApp')
    .directive('chat',function($http){
        return{
            restrict: 'E',
            template:`<div id="chat-wrapper" class="vf-chat">
                <div class="style-editor scroll" ng-if="edit">
                    <div class="style-editor-columns">
                        <div class="style-editor-column">
                            <div class="editor-block">
                                <input type="checkbox" id="showChat" ng-model="data.chat.visible"/>
                                <label for="showChat">Visible</label>
                            </div>
                            <div class="editor-block">
                                <input type="checkbox" id="showChatUsername" ng-model="data.chat.showUsername"/>
                                <label for="showChatUsername">Show user name</label>
                            </div>
                            <div class="editor-block">
                                <input type="checkbox" id="showChatMsgTime" ng-model="data.chat.showTime"/>
                                <label for="showChatMsgTime">Show message time</label>
                            </div>
                            <div class="editor-block">
                                <label class="editor-block-title">Chat app</label>
                                <select ng-model="data.chat.apiKey" ng-if="apps.chat && apps.chat.length>0">
                                    <option ng-repeat="app in apps.chat" value="{{app.apikey}}">{{app.name}}</option>
                                </select>
                                <div class="editor-button" ng-if="apps.chat && apps.chat.length>0" ng-click="connectChat(true)">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </div>
                                <a class="editor-button" href="https://www.videoflow.io/integrations" ng-if="!apps.chat || apps.chat.length===0" target="_blank">Add a Chat app.</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-login" ng-if="!chatConnected && chatAvailable">
                    <div class="chat-login-button" ng-click="chatLogin('twitter');">
                        <i class="fa fa-twitter" aria-hidden="true"></i>    
                        <span>Login with Twitter</span>
                    </div>
                    <div class="chat-login-button" ng-click="chatLogin('facebook');" ng-if="false">
                        <i class="fa fa-facebook" aria-hidden="true"></i>
                        <span>Login with Facebook</span>
                    </div>
                    <div class="chat-login-button" ng-click="chatLogin('google');">
                        <i class="fa fa-google" aria-hidden="true"></i>
                        <span>Login with Google</span>
                    </div>
                    <div class="chat-login-button" ng-click="chatLogin('anonymous');">
                        <i class="fa fa-google" aria-hidden="true"></i>
                        <span>Login as guest</span>
                    </div>
                </div>
                <div class="chat-body" ng-if="chatConnected && chatAvailable">
                    <div id="chat-messages" class="chat-messages scroll">
                        <div class="chat-msg" ng-repeat="msg in chatData" ng-class="{self:msg.userId===chatUser.id}">
                            <div class="chat-msg-header">
                                <div class="chat-msg-user" ng-if="data.chat.showUsername">{{msg.name}}</div>
                                <div class="chat-msg-time" ng-if="data.chat.showTime">{{msg.timestamp | timestamp}}</div>
                            </div>
                            <div class="chat-msg-content">{{msg.message}}</div>
                        </div>
                    </div>
                    <div class="chat-input">
                        <textarea ng-keypress="chatKeyPress($event)" placeholder="Type your messsage here..." class="chat-input-text scroll" ng-model="$parent.chatMsg"></textarea>
                        <div class="chat-input-send" ng-click="sendChatMsg()">
                            <i class="fa fa-paper-plane" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>`,
            replace:true,
            link: function ($scope, element) {
                $scope.chatData=[];
                $scope.chatUser=undefined;
                $scope.chatConnected = false;
                $scope.chatAvailable = false;
                $scope.chatMsg='';
                $scope.chatSending=false;
                let chat, roomId, chatId;

                // Initialize Firebase
                $scope.connectChat = function(force){
                    if($scope.data.chat.apiKey && !$scope.chatConnected){
                        //$http.get(`https://www.videoflow.io/ext/${$scope.data.chat.apiKey}/connection`).then(res => {
                        $http.get(`http://localhost:3002/ext/${$scope.data.chat.apiKey}/connection`).then(res => {
                            if(firebase.apps.length===0){
                                firebase.initializeApp(res.data.firebaseConfig);

                                chatId = res.data.chatId;
                                $scope.chatAvailable = true;
    
                                firebase.auth().onAuthStateChanged(function(user) {
                                    if (user) {
                                      initChat(user);
                                    }
                                  });
                            }
                        });
                    }else if($scope.chatConnected && force){
                        firebase.app().delete().then(()=>{
                            $scope.chatConnected=false;
                            $scope.connectChat();
                          });
                    }
                }

                function initChat(user) {
                    // Get a Firebase Database ref
                    let firebaseRef = firebase.database().ref(chatId);
                    $scope.chatData = [];

                    chat = new Firechat(firebaseRef);
                    chat.setUser(user.uid, user.displayName || ('Guest' +  ("" + Math.random()).substring(2, 8)), function(u) {
                        //chat.resumeSession();

                        chat.getRoomList((rooms)=>{
                            if(!rooms || Object.keys(rooms).length===0){
                                chat.createRoom('main', 'public', (rid)=>{
                                    roomId=rid;
                                    chat.enterRoom(rid);
                                });
                            }else {
                                roomId=rooms[Object.keys(rooms)[0]].id;
                                chat.enterRoom(roomId);
                            }
                        });

                        $scope.chatUser = u;
                        $scope.chatConnected=true;
                        $scope.$apply();
                    });

                    chat.on('message-add',(rid, msg)=>{
                        $scope.chatData.push(msg);

                        if(msg.userId!==$scope.chatUser.id){
                            if($scope.selectedTab!=='chat'){
                                $scope.chatNewMsg++;
                            }
                            //$scope.$apply();
                        }

                        $scope.safeApply();
    
                        let objChat = document.getElementById("chat-messages");
                        if(objChat){
                            objChat.scrollTop = objChat.scrollHeight+100;
                        }
                    });

                    chat.on('room-enter',(room)=>{
                        console.log("room entered");
                        console.log(room);
                    });

                    $scope.chatKeyPress = function(e){
                        if(e.keyCode===13 && !e.shiftKey){
                            $scope.sendChatMsg();
                            e.preventDefault();
                        }
                    }

                    $scope.connectChat();
                  }

        
              $scope.chatLogin = function(method) {
                let m = method || 'google'
                let provider = {};
                switch(m){
                    case 'google':
                        provider = new firebase.auth.GoogleAuthProvider();
                        break;
                    case 'facebook':
                        provider = new firebase.auth.FacebookAuthProvider();
                        break;
                    case 'twitter':
                        provider = new firebase.auth.TwitterAuthProvider();
                        break;
                    default:
                        provider = new firebase.auth.GoogleAuthProvider();
                        break;
                }
                if(m === 'anonymous'){
                    firebase.auth().signInAnonymously().catch(function(error) {
                        console.log("Error authenticating user:", error);
                    });
                } else {
                    firebase.auth().signInWithPopup(provider).catch(function(error) {
                        console.log("Error authenticating user:", error);
                    });
                }
              }

              $scope.sendChatMsg = function(){
                  if(chat && $scope.chatUser && $scope.chatConnected && $scope.chatMsg && $scope.chatMsg!==''){
                      $scope.chatSending=true;
                        chat.sendMessage(roomId, $scope.chatMsg, messageType='default', ()=>{
                            console.log("Message sent!");
                            $scope.chatMsg = '';
                            $scope.chatSending=false;
                            $scope.$apply();
                        });
                  }
              }

              $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase === '$apply' || phase === '$digest') {
                    if (fn && (typeof (fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };
            }
        };
    })
    .filter('timestamp', function() {
        return function(input) {
          return moment(input).format("h:mm a");
        };
      });