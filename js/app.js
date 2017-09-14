/* this is the constant header and first child Node of the body - note the video player */
const initial = `
    <div class="flex-column">
      <div id="sonyLogo">
        <img src="img/navigation_home_ps-logo-us.png">
      </div>
      <div id="searchBox">
        <input type="text" id="gameQuery">
        <input type="button" value="Search"
               onClick="executeSearch()")>
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
 * select the relevant json data and create an item for the pager
 * @param {object} data - json object of Twitch response body
 */
function setItems(data) {
  let items = [];
  for (x of data.streams) {
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
  pager = new Pager(items, data._total, 5);
  renderView(pager);
  return false;
}

/*
 * replaces pager body with the current items in pager
 * @param {Pager} pager - pager contains all parsed items and nav data
 */
function renderView(pager) {
  var pagerBody = document.getElementById("pagerBody");
  /* create it if it doesn't exist */
  if (!pagerBody) {
    pagerBody = document.createElement('div');
    pagerBody.id = 'pagerBody';
    document.body.appendChild(pagerBody);
  }
  pagerBody.innerHTML = pager.toDiv();
  return false;
}

/*
 * call twitch service with promises
 */
function executeSearch() {
  let query = document.getElementById('gameQuery').value;
  let data;
  let dataService = new TwitchService();
  dataService.getStreamData(query).then((response) => {
    setItems(response);
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
function launchVideo(channelName, mature) {
  let url='https://player.twitch.tv/?muted=false&channel='+channelName;
  if (mature) {
    //mature content cannot be viewed anonymously
    alert ('Mature channel access not allowed');
  } else {
    document.getElementById('vidPlayer').src=url
  };
  return false;
}

/* pager is the main content - twitch navigation tool */
var pager;

/* once all scripts, css and body are loaded, insert the search form */
window.onload = () => {
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
      executeSearch();
    }
  });
}
