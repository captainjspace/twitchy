/* seed search */
const seedSearch = 'destiny';

/*
 * this is the constant header and first child Node of the body - note the video player
 * could add all this via js, but I demonstrate that below in init function
 */
const mastHTML = `
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
    this._initState = false;
    this._pager = undefined;
  }

  //getter-setter
  get initState() {
    return this._initState;
  }
  set initState(initState) {
    this._initState = initState;
  }
  get pager() {
    return this._pager;
  }
  set pager(pager) {
    this._pager = pager;
  }

  //app methods
  /*
   * select the relevant json data and create an item for the pager
   * @param {object} data - json object of Twitch response body
   */
  setItems(data) {
    if (data === undefined) return false;

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
    return true;
  }

  /*
   * replaces pager body with the current items in pager
   * @param {Pager} pager - pager contains all parsed items and nav data
   */
  renderView() {
    if (this.pager === undefined ) return false;

    var pagerBody = document.getElementById("pagerBody");
    /* create it if it doesn't exist */
    if (!pagerBody) {
      pagerBody = document.createElement('div');
      pagerBody.id = 'pagerBody';
      document.getElementById('app').appendChild(pagerBody);
    }
    pagerBody.innerHTML = this.pager.toDiv();
    return true;
  }

  /*
   * app movement wrappers -
   * could remove pager checks, since init is forced,
   * and pager will always be accesible
   */
  first() {
    if (this.pager === undefined ) return false;
    this.pager.currentPage=1;
    this.renderView();
  }
  prev() {
    if (this.pager === undefined ) return false;
    this.pager.prevPage();
    this.renderView();
  }
  next() {
    if (this.pager === undefined ) return false;
    this.pager.nextPage();
    this.renderView();
  }
  last() {
    if (this.pager === undefined ) return false;
    this.pager.currentPage=this.pager.pageCount;
    this.renderView();
  }
  /*
   * call twitch service with promises
   */
  executeSearch() {
    if (!this.initState) return false;
    let query = document.getElementById('gameQuery').value;
    let dataService = new TwitchService();
    dataService.getStreamData(query).then((response) => {
      this.setItems(response);
    }).catch((err) => {
      console.log(err);
    });
    localStorage.setItem('search', query);
    return true;
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
      document.getElementById('vidPlayer').src = url;
      return true;
    };
    return false;
  }

  /*
   * Initiailize application screen
   */
   init() {

     if (this.initState === true) return false;

     /* just demonstrating manipulation of style/DOM from js and attaching listeners */
     let appHTMLContainer = document.createElement('div');
     appHTMLContainer.id = 'app';
     /* query form */
     let queryForm = document.createElement('div');
     queryForm.id = 'queryForm';
     queryForm.className = "container";
     queryForm.style.border = "1px solid black";


     //see constant above, could do this all in js...
     queryForm.innerHTML = mastHTML;

     /* init screen */
     appHTMLContainer.appendChild(queryForm);
     document.body.appendChild(appHTMLContainer);

     /* initialize, attach 'return' submit listener to text box */
     let el = document.getElementById('gameQuery');
     let lastSearch = localStorage.getItem('search');
     el.value = (lastSearch) ? lastSearch : seedSearch; //initialize
     el.addEventListener('keypress', function(e) {
       if (e.keyCode == 13) {
         app.executeSearch();
       }
     });
     this.initState = true;
     app.executeSearch();
     return this.initState;
   }
}
/* pager is the main content - twitch navigation tool */
var app = new App();

/* once all scripts, css and body are loaded, insert the search form */
window.onload = () => {
  app.init();
}
