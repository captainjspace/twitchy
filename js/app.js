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
        <div><span class="small" id="videoStatus"></span></div>
        <div>
          <iframe
            id="vidPlayer"
            src=""
            allowfullscreen="true">
          </iframe>
        </div>
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
    this._currentSearch = "";
  }

  //getter-setter
  get initState() {
    return this._initState;
  }
  set initState(initState) {
    this._initState = initState;
  }
  get currentSearch() {
    return this._currentSearch;
  }
  set currentSearch(currentSearch) {
    this._currentSearch = currentSearch;
  }
  get pager() {
    return this._pager;
  }
  set pager(pager) {
    this._pager = pager;
  }

  //app methods
  /* creates items from twitch JSON (parsed) */
  parseItems(data) {
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
      i.raw = x;
      items.push(i);
    }
    return items;
  }

  /*
   * select the relevant json data and create an item for the pager
   * @param {object} data - json object of Twitch response body
   */
  initPager(data) {
    if (data === undefined)
      return false;

    /* parse itesms, set pager and render view, then call lazyLoad */
    this.pager = new Pager(this.parseItems(data), data._total, 5);
    this.renderView(this.pager);
    this.lazyLoad();
    return true;
  }

  /*
   * replaces pager body with the current items in pager
   * @param {Pager} pager - pager contains all parsed items and nav data
   */
  renderView() {
    if (this.pager === undefined && this.pager.pagerState === true)
      return false;

    var pagerBody = document.getElementById("pagerBody");
    /* create it if it doesn't exist */
    if (!pagerBody) {
      pagerBody = document.createElement('div');
      pagerBody.id = 'pagerBody';
      document.getElementById('app').appendChild(pagerBody);
    }
    /* could be more efficient than full div replace here */
    pagerBody.innerHTML = this.pager.toDiv();
    this.pager.pagerState = false;
    return true;
  }

  /*
   * app movement wrappers -
   * could remove pager checks, since init is forced,
   * and pager will always be accesible
   */
  first() {
    if (this.pager === undefined)
      return false;
    this.pager.currentPage = 1;
    this.renderView();
  }
  prev() {
    if (this.pager === undefined)
      return false;
    this.pager.prevPage();
    this.renderView();
  }
  next() {
    if (this.pager === undefined)
      return false;
    this.pager.nextPage();
    this.renderView();
  }
  last() {
    if (this.pager === undefined)
      return false;
    this.pager.currentPage = this.pager.pageCount;
    this.renderView();
  }

  /*
   * lazyLoad kicks loops kicks of async requests to get all streams up to the expected total
   * the variance is tracked in pager, twitch totals seem out of sync with actual live streams
   */
  lazyLoad() {
    const chunk = 50;
    let dataService = new TwitchService();
    let max = this.pager.total;

    let offset = chunk;
    while (offset < max) {
      dataService.getStreamData(this.currentSearch, offset).then((response) => {
        let _offset = offset
        let items = this.parseItems(response);
        this.pager.addItems(items);
        this.pager.lastOffset = offset;
        this.pager.updatePagerNav();
        this.pager.sort();
      }).catch((err) => {
        console.log(err);
      });
      offset += chunk;
    }
    return true;
  }
  /*
   * new search calls twitch service with promises
   */
  executeSearch() {
    if (!this.initState)
      return false;
    this.currentSearch = document.getElementById('gameQuery').value;
    let dataService = new TwitchService();
    dataService.getStreamData(this.currentSearch).then((response) => {
      this.initPager(response);
    }).catch((err) => {
      console.log(err);
    });
    localStorage.setItem('search', this.currentSearch);
    return true;
  }

  /* UI - IMAGE AND VIDEO OPERATIONS */
  /* generic find rule function -> specific for move Image */
  getImageMoveRule() {
    let ss = document.styleSheets[0];
    for (var j = 0; j < ss.cssRules.length; j++) {
      if (ss.cssRules[j].name == "moveImage") {
        return ss.cssRules[j];
      }
    }
  }

  /*
   * facade pattern function - manipulates
   * css animation, vidstatus, image downloads and events
   * Queues up request to upgrade to large image on screen if not large
   * attaches img src update event on lodd.
   * TODO: Could potentially get get downgraded to medium on lazyLoad, if we are ahead
   * customizes animation for image location
   * start animation sending image (graphically) to vidPlayer
   * attaches event to end animation to clean up img state, and vid status
   * @param {id} - id of img
   * @param {mature} - boolean -determines whether to reset videoStatus text-align
   * @param {origText} - current text (channelName playing)
   * @param {videoStatus} - handle to tv caption span
   */
  upgradeImage(id, mature, origText, videoStatus) {

    /* start image download */
    let item = this.pager.getItemById(id);
    let imgEl = document.getElementById(id);

    if (imgEl.src != item.raw.preview.large) {
      let i = new Image();
      i.src = item.raw.preview.large;
      i.onload = () => {
        imgEl.src = i.src;
        item.src = i.src;
      }
    }
    /* call image animation -> vid Player */
    var rect = imgEl.getBoundingClientRect();
    let rule = this.getImageMoveRule();
    /* generate custom margin-top for this image */
    let kf = `
      50% {
        margin-top:   -${rect.top + 30}px;
        margin-left: 635px;
        transform: scale(.2);
      }
    `;
    rule.deleteRule('50%');
    rule.appendRule(kf, '50%');

    /* add style & class */
    imgEl.style.webkitAnimationName += ' ' + 'moveImage';
    imgEl.classList.add('animate');

    imgEl.addEventListener('animationend', () => {
      /* remove style & class to reactive */
      imgEl.classList.remove('animate');
      imgEl.style.webkitAnimationName = "";
      /* reset caption to what's playing if mature requested */
      if (mature) {
        videoStatus.textContent = origText;
        videoStatus.style.color = 'white';
      }
    });
  }
  
  /*
   * set feed for twitch tv video player, blocks channels marked mature
   * @param {string} channelName - name of channel to load
   * @param {boolean} mature - is the channel for mature audiences
  */
  launchVideo(channelName, mature, id) {

    let url = 'https://player.twitch.tv/?muted=false&channel=' + channelName;
    let videoStatus = document.getElementById('videoStatus');
    let origText = videoStatus.textContent;

    /* call GUI fluff */
    this.upgradeImage(id, mature, origText, videoStatus);

    if (mature) {
      //mature content cannot be viewed anonymously
      videoStatus.textContent = 'Mature channel access not allowed'
      videoStatus.style.color = 'yellow';
    } else {
      //launchVideo
      document.getElementById('vidPlayer').src = url;
      videoStatus.textContent = 'Now Playing: ' + channelName;
      videoStatus.style.color = 'white';
      return true;
    };
    return false;
  }

  /*
   * Initiailize application screen
   */
  init() {

    if (this.initState === true)
      return false;

    /* just demonstrating manipulation of style/DOM from js and attaching listeners */
    let appHTMLContainer = document.createElement('div');
    appHTMLContainer.id = 'app';
    appHTMLContainer.style.width = '800px';
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
    el.value = (lastSearch)
      ? lastSearch
      : seedSearch; //initialize
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
