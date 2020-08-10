angular.module('socialApp')
    .directive('tweet', [function() {
        return {
            restrict    : 'E',
            template:`<div class="tweet">
                            <div class="tweet-header">
                                <img class="tweet-avatar" src="{{tweet.user.profile_image_url_https}}" />
                                <div class="tweet-header-info">
                                    <div class="tweet-header-name">{{tweet.user.name}}</div>
                                    <div class="tweet-header-handle">@{{tweet.user.screen_name}}</div>
                                </div>
                            </div>
                            <div class="tweet-content">
                                <div class="tweet-content-text"></div>
                                <img class="tweet-content-media" ng-src="{{media.media_url_https}}" ng-repeat="media in tweet.entities.media"/>
                            </div>
                            <div class="tweet-footer">
                                <div class="tweet-menu">
                                    <a class="tweet-menu-item" href="{{'https://twitter.com/intent/tweet?in_reply_to='+tweet.id_str}}" target="_blank"><i class="fa fa-share" aria-hidden="true"></i></a>
                                    <a class="tweet-menu-item" href="{{'https://twitter.com/intent/retweet?tweet_id='+tweet.id_str}}" target="_blank"><i class="fa fa-retweet" aria-hidden="true"></i></a>
                                    <a class="tweet-menu-item" href="{{'https://twitter.com/intent/like?tweet_id='+tweet.id_str}}" target="_blank"><i class="fa fa-star" aria-hidden="true"></i></a>
                                </div>
                                <a class="tweet-time">{{moment(tweet.created_at).fromNow()}}</a>
                            </div>
                        </div>`,
            replace: true,
            scope       :{
                tweet   : '='
            },
            link        : function(scope,element,attr) {
                scope.moment =  moment;

                let t = scope.tweet.full_text;
                t = t.substring(scope.tweet.display_text_range[0], scope.tweet.display_text_range[1]);

                for (let i = scope.tweet.entities.hashtags.length - 1; i >= 0; i--) {
                    let tag = '<a class="tweet-content-text-link" target="_blank" href="https://twitter.com/search?q=%23' + scope.tweet.entities.hashtags[i].text + '">#' + scope.tweet.entities.hashtags[i].text + '</a>';
                    t = t.slice(0, scope.tweet.entities.hashtags[i].indices[0]) + tag + t.slice(scope.tweet.entities.hashtags[i].indices[1]);
                }

                let tweetBody = element[0].querySelector('.tweet-content-text');
                tweetBody.innerHTML=t;

            }
        }
    }]);