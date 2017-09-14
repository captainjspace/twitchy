/* this is the constant header and first child Node of the body - note the video player */
const initial = `
    <div class="flex-column">
      <div id="sonyLogo">
        <img src="img/navigation_home_ps-logo-us.png">
      </div>
      <div id="searchBox">
        <input type="text" id="gameQuery">
        <input type="button" value="Search"
               onClick="app.executeSearch()")>
      </div>
      <div id="tv">
        <iframe
          id="vidPlayer"
          src=""
          allowfullscreen="true">
        </iframe>
      </div>
    </div>
`;

/*
 * @filename App.js
 * Main application facade, wraps core functions
 */
class App {
  constructor() {
    this._pager = {};
  }

  get pager() {
    return this._pager;
  }
  set pager(pager) {
    this._pager = pager;
  }

  /*
   * select the relevant json data and create an item for the pager
   * @param {object} data - json object of Twitch response body
   */
  setItems(data) {
    let items = [];
    for (let x of data.streams) {
      /* too many items to cleanly use a constructor */
      var i = new Item();
      i.id = x._id;
      i.img = x.preview.small;
      i.streamDisplayName = x.channel.display_name;
      i.gameName = x.game;
      i.viewerCount = x.viewers;
      i.description = x.channel.description;
      i.channelName = x.channel.name;
      i.channelMature = x.channel.mature;
      items.push(i);
    }

    /* set pager and render view */
    this.pager = new Pager(items, data._total, 5);
    this.renderView(this.pager);
    return false;
  }

  /*
   * replaces pager body with the current items in pager
   * @param {Pager} pager - pager contains all parsed items and nav data
   */
  renderView() {
    var pagerBody = document.getElementById("pagerBody");
    /* create it if it doesn't exist */
    if (!pagerBody) {
      pagerBody = document.createElement('div');
      pagerBody.id = 'pagerBody';
      document.body.appendChild(pagerBody);
    }
    pagerBody.innerHTML = this.pager.toDiv();
    return false;
  }

  /* app movement wrappers */
  first() {
    this.pager.currentPage=1;
    this.renderView();
  }
  prev() {
    this.pager.prevPage();
    this.renderView();
  }
  next() {
    this.pager.nextPage();
    this.renderView();
  }
  last() {
    this.pager.currentPage=this.pager.pageCount;
    this.renderView();
  }
  /*
   * call twitch service with promises
   */
  executeSearch() {
    let query = document.getElementById('gameQuery').value;
    let dataService = new TwitchService();
    dataService.getStreamData(query).then((response) => {
      this.setItems(response);
    }).catch((err) => {
      console.log(err);
    });
    return false;
  }

  /*
   * set feed for twitch tv video player, blocks channels marked mature
   * @param {string} channelName - name of channel to load
   * @param {boolean} mature - is the channel for mature audiences
  */
  launchVideo(channelName, mature) {
    let url = 'https://player.twitch.tv/?muted=false&channel=' + channelName;
    if (mature) {
      //mature content cannot be viewed anonymously
      alert('Mature channel access not allowed');
    } else {
      document.getElementById('vidPlayer').src = url
    };
    return false;
  }

  /*
   * Initiailize application screen
   */
   init() {
     /* just demonstrating manipulation of style from js and attaching listeners */
     let queryForm = document.createElement('div');
     queryForm.id = 'queryForm';
     queryForm.className = "container";
     queryForm.style.border = "1px solid black";
     queryForm.innerHTML = initial;
     document.body.appendChild(queryForm);

     let el = document.getElementById('gameQuery');
     el.addEventListener('keypress', function(e) {
       if (e.keyCode == 13) {
         app.executeSearch();
       }
     });
   }
}
/* pager is the main content - twitch navigation tool */
var app = new App();

/* once all scripts, css and body are loaded, insert the search form */
window.onload = () => {
  app.init();
}
