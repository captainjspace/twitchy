/*
 * Talks to Twitch Endpoint
 */
class TwitchService {
  constructor() {
    //could add offset or other parameters here and expand inputs, build querystring
    this._baseUrl = "https://api.twitch.tv/kraken/search/streams?limit=100&query=";
    this._headers = {
      accept: "application/vnd.twitchtv.v5+json",
      clientId: "uo6dggojyb8d6soh92zknwmi5ej1q2"
    };
    this._data = {};
  }

  /* wraps the json request in a promise */
  getStreamData(game) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', this._baseUrl + game);
      /* inject required headers */
      xhr.setRequestHeader('Accept', this._headers.accept);
      xhr.setRequestHeader('Client-ID', this._headers.clientId);
      xhr.send();
      xhr.onload = () => {
        if (xhr.status == 200) {
          this._data = JSON.parse(xhr.response);
          console.log(this._data); //debug
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
