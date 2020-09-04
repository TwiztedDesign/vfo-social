angular.module('socialApp')
    .directive('chat',function(){
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
                                <label class="editor-block-title">Chat app</label>
                                <select ng-model="data.chat.appId" ng-if="apps.chat && apps.chat.length>0">
                                    <option ng-repeat="app in apps.chat" value="{{app.params}}">{{app.name}}</option>
                                </select>
                                <div class="editor-button" ng-if="apps.chat && apps.chat.length>0" ng-click="">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </div>
                                <a class="editor-button" href="https://www.videoflow.io/integrations" ng-if="!apps.twitter || apps.twitter.length===0" target="_blank">Add a Chat app.</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-login" ng-if="!chatConnected">
                    <div class="chat-login-button" ng-click="chatLogin('twitter');">
                        <i class="fa fa-twitter" aria-hidden="true"></i>    
                        <span>Login with Twitter</span>
                    </div>
                    <div class="chat-login-button" ng-click="chatLogin('facebook');">
                        <i class="fa fa-facebook" aria-hidden="true"></i>
                        <span>Login with Facebook</span>
                    </div>
                    <div class="chat-login-button" ng-click="chatLogin('google');">
                        <i class="fa fa-google" aria-hidden="true"></i>
                        <span>Login with Google</span>
                    </div>
                </div>
                <div class="chat-body" ng-if="chatConnected">
                    <div id="chat-messages" class="chat-messages scroll">
                        <div class="chat-msg" ng-repeat="msg in chatData" ng-class="{self:msg.userId===chatUser.id}">
                            <div class="chat-msg-header">
                                <div class="chat-msg-user">{{msg.name}}</div>
                                <div class="chat-msg-time">{{msg.timestamp}}</div>
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
                $scope.chatMsg='';
                $scope.chatSending=false;
                let chat;
                let roomId = '-MGQRc3SM2wEw2g_Mfw-';

                const firebaseConfig = {
                    apiKey: "AIzaSyBnNK9K2BQq-dthi35oy20GwKhuftHCrV0",
                    authDomain: "videoflow-integration.firebaseapp.com",
                    databaseURL: "https://videoflow-integration.firebaseio.com",
                    projectId: "videoflow-integration",
                    storageBucket: "videoflow-integration.appspot.com",
                    messagingSenderId: "198813729323",
                    appId: "1:198813729323:web:b4871116708a173bbde06e",
                    measurementId: "G-NN24HNHX0V"
                  };
                // Initialize Firebase
                firebase.initializeApp(firebaseConfig);
                firebase.analytics();
        
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
                firebase.auth().signInWithPopup(provider).catch(function(error) {
                  console.log("Error authenticating user:", error);
                });
              }
        
              firebase.auth().onAuthStateChanged(function(user) {
                // Once authenticated, instantiate Firechat with the logged in user
                if (user) {
                  initChat(user);
                }
              });

              $scope.sendChatMsg = function(){
                  if(chat && $scope.chatUser && $scope.chatConnected && $scope.chatMsg && $scope.chatMsg!==''){
                      $scope.chatSending=true;
                        chat.sendMessage(roomId, $scope.chatMsg, messageType='default', ()=>{
                            console.log("Message sent!");
                            $scope.chatSending=false;
                        });
                  }
              }
        
              function initChat(user) {
                // Get a Firebase Database ref
                let firebaseRef = firebase.database().ref("chat");

                chat = new Firechat(firebaseRef);

                // chat.createRoom("main", "public", (roomId)=>{
                    
                //     console.log(roomId);
                // })

                chat.setUser(user.uid, user.displayName, function(u) {
                    chat.resumeSession();
                    chat.enterRoom('-MGQRc3SM2wEw2g_Mfw-');
                    $scope.chatUser = u;
                    $scope.chatConnected=true;
                });

                chat.on('message-add',(rid, msg)=>{
                    //roomId=rid;
                    $scope.chatData.push(msg);

                    if(msg.userId!==$scope.chatUser.id){
                        $scope.$apply();
                    }

                    let objChat = document.getElementById("chat-messages");
                    objChat.scrollTop = objChat.scrollHeight+100;
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

                // Create a Firechat instance
                //let chat = new FirechatUI(chatRef, document.getElementById("chat-wrapper"));

                // Set the Firechat user
                //chat.setUser(user.uid, user.displayName);

                // chat._chat.getRoomList((rooms)=>{
                //     console.log(rooms);
                //     if(!rooms){
                //         chat._chat.createRoom('main;', 'public', (roomId)=>{
                //             console.log(roomId);
                //             chat._chat.enterRoom(roomId);
                //         });
                //     }else {
                //         chat._chat.enterRoom(rooms[Object.keys(rooms)[0]].id);
                //     }
                // });               
              }
            }
        };
    });