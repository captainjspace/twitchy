/*
 * Talks to Twitch Endpoint
 */
class TwitchService {
  constructor() {
    //could add offset or other parameters here and expand inputs, build querystring
    this._baseUrl = "https://api.twitch.tv/kraken/search/streams?query=";
    this._headers = {
      accept: "application/vnd.twitchtv.v5+json",
      clientId: "w3moe641p9cucblko66t42khea6rxk"
    };
    this._data = {};
    this._chunk = 50;
  }

  get chunk() { return this._chunk;}

  /*
   * wraps the json request in a promise, defaults offset to zero, fixed limit
   * limit should match chunk in app.js - so technically they should be in a <config>.js
   */
  getStreamData(game, offset=0) {
    //let _offset = (offset) ? offset : 0;
    let url = this._baseUrl + game + '&offset='+offset+'&limit=' + this.chunk;
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      /* inject required headers */
      xhr.setRequestHeader('Accept', this._headers.accept);
      xhr.setRequestHeader('Client-ID', this._headers.clientId);
      xhr.send();
      xhr.onload = () => {
        if (xhr.status == 200) {
          this._data = JSON.parse(xhr.response); //could resolve this too...
          resolve(this._data);
        } else {
          reject({status: this.status, statusText: xhr.statusText});
        }
      };
      xhr.onerror = () => {
        reject({status: this.status, statusText: xhr.statusText});
      };
    });
  }


}
