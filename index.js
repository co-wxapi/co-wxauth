'use strict';
var WxBase = require('co-wxbase');

class WxAuth extends WxBase{
  constructor(config){
    super(config);
  }

  *getAuthUrl(redirectUrl, state, moreInfo){
    var scope = moreInfo?'snsapi_userinfo':'snsapi_base';
    var redirect_uri = escape(redirectUrl);
    var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
    return url;
  }

  *getAuthToken(code){
    var url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.appId}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`;
    var result = yield this.jsonRequest(url, 'GET');
  }

  *getUserInfo(token, openid, lang){
    if ( !lang ) lang = 'zh_CN';
    var url = `https://api.weixin.qq.com/sns/userinfo?access_token=${token}&openid=${openid}&lang=${lang}`;
    var result = yield this.jsonRequest(url, 'GET');
  }

  *verifyToken(token, openid){
    var url = `https://api.weixin.qq.com/sns/auth?access_token=${token}&openid=${openid}`;
    var result = yield this.jsonRequest(url, 'GET');
  }

  *refreshToken(refreshToken){
    var url = `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${this.appId}&grant_type=refresh_token&refresh_token=${refreshToken}`;
    var result = yield this.jsonRequest(url, 'GET');
  }
}

module.exports = function(config){
  var authApi = new WxAuth(config);
  return authApi;
}
