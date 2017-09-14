/*
 * Individual Display Item
 * Would definitely create custom HMTL element for the template literal
 */
class Item {
  constructor() {
    this._id = "";
    this._img = "";
    this._streamDisplayName = "";
    this._gameName = "";
    this._viewerCount = "";
    this._description = "";
    this._channelName = "";
    this._channelMature = false;
    //force browser to download image early - it's smart, and will use cache copy.
    this._image = new Image();
  }

  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }

  get img() {
    return this._img;
  }
  set img(img) {
    this._img = img;
    this.image.src = img;
  }
  //image cache
  get image() {
    return this._image;
  }
  set image(img) {
    this._image.src = img;
  }
  get streamDisplayName() {
    return this._streamDisplayName;
  }
  set streamDisplayName(streamDisplayName) {
    this._streamDisplayName = streamDisplayName;
  }

  get gameName() {
    return this._gameName;
  }
  set gameName(gameName) {
    this._gameName = gameName;
  }

  get viewerCount() {
    return this._viewerCount;
  }
  set viewerCount(viewerCount) {
    this._viewerCount = viewerCount;
  }

  get description() {
    return this._description;
  }
  set description(description) {
    this._description = description;
  }

  get channelName() {
    return this._channelName;
  }
  set channelName(channelName) {
    this._channelName = channelName;
  }

  get channelMature() {
    return this._channelMature;
  }
  set channelMature(channelMature) {
    this._channelMature = channelMature;
  }

  /* template literals are awesome */
  toDiv() {
    let htmlTemplate = `
        <div class="item">
          <div>
            <div class="img-container">
              <span></span>
              <img class="stream-image" alt="...Still Loading ${this.img}"
                   id="${this.id}" src="${this.img}" onClick="launchVideo('${this.channelName}', ${this.channelMature});"/>
            </div>
          </div>

          <div class="txt-container">
            <div class="streamDisplayName">
              ${this.streamDisplayName}
            </div>
            <div class="game">
              ${this.gameName} - ${this.viewerCount} Viewers
            </div>
            <div class="description">
              <span class="field-name">Stream Description:</span>
              ${this.description}
            </div>
          </div>
          <div></div>
        </div>
      `;
    return htmlTemplate;
  };
};
