angular.module('socialApp')
    .directive('tweetItem', [function() {
        return {
            restrict    : 'E',
            template:`<div class="sns-item">
                            <div class="sns-header">
                                <img class="sns-avatar" src="{{tweet.avatar}}" />
                                <div class="sns-header-info">
                                    <div class="sns-header-name">{{tweet.name}}</div>
                                    <div class="sns-header-handle">{{tweet.handle}}</div>
                                </div>
                            </div>
                            <div class="sns-content">
                                <div class="sns-content-text"></div>
                                <img class="sns-content-media" src="{{media.media_url_https}}" ng-repeat="media in tweet.extended_entities.media"/>
                            </div>
                            <div class="sns-footer">
                                <div class="sns-menu">
                                    <a class="sns-menu-item" href="{{'https://twitter.com/intent/tweet?in_reply_to='+tweet.id_str}}" target="_blank"><i class="fa fa-share" aria-hidden="true"></i></a>
                                    <a class="sns-menu-item" href="{{'https://twitter.com/intent/retweet?tweet_id='+tweet.id_str}}" target="_blank"><i class="fa fa-retweet" aria-hidden="true"></i></a>
                                    <a class="sns-menu-item" href="{{'https://twitter.com/intent/like?tweet_id='+tweet.id_str}}" target="_blank"><i class="fa fa-star" aria-hidden="true"></i></a>
                                </div>
                                <a class="sns-time">{{moment(tweet.created_at).fromNow()}}</a>
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
                    let tag = '<a class="sns-content-text-link" target="_blank" href="https://twitter.com/search?q=%23' + scope.tweet.entities.hashtags[i].text + '">#' + scope.tweet.entities.hashtags[i].text + '</a>';
                    t = t.slice(0, scope.tweet.entities.hashtags[i].indices[0]) + tag + t.slice(scope.tweet.entities.hashtags[i].indices[1]);
                }

                let tweetBody = element[0].querySelector('.sns-content-text');
                tweetBody.innerHTML=t;

            }
        }
    }]);