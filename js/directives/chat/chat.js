angular.module('socialApp')
    .directive('chat',function($sce){
        return{
            restrict: 'E',
            template:`<div id="chat-wrapper" class="vf-chat">
                <div class="chat-login">
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
            </div>`,
            replace:true,
            link: function ($scope) {
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
                // Log the user in via Twitter
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
        
              function initChat(user) {
                // Get a Firebase Database ref
                let chatRef = firebase.database().ref("chat");
        
                // let chat = new Firechat(chatRef);

                // Create a Firechat instance
                let chat = new FirechatUI(chatRef, document.getElementById("chat-wrapper"));

                 // Go to room

                // chatUI._chat.enterRoom("-MGFPCJwuG-2skxxjVDa");

                // Set the Firechat user
                chat.setUser(user.uid, user.displayName);

                chat._chat.getRoomList((rooms)=>{
                    console.log(rooms);
                    if(!rooms){
                        chat._chat.createRoom('main;', 'public', (roomId)=>{
                            console.log(roomId);
                            chat._chat.enterRoom(roomId);
                        });
                    }else {
                        chat._chat.enterRoom(rooms[Object.keys(rooms)[0]].id);
                    }
                });

                chat._chat.on('message-add',(roomId, msg)=>{
                    console.log(msg);
                });
               
              }
            }
        };
    });