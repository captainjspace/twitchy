'use strict';
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
    this._raw = {};
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
    // this code is rad but downloads 100s of MBs and clogs the queue
    // - better to offload to Worker thread or simply pull only necessary items
    //this.image.src = img;
    /* start upgrading to medium */
    // this._image.onload = () => {
    //   this._image.src = this._raw.preview.medium;
    //   this._image.onload = () => {
    //     this._img = this._image.src;
    //     let i = document.getElementById(this.id);
    //     if (i) {
    //       i.style.webkitAnimationName += ' flipReplaceX';
    //       i.classList.add('replaceX');
    //       i.src = this._image.src;
    //       i.addEventListener('animationend', () => {
    //         i.style.webkitAnimationName='';
    //         i.classList.remove('replaceX');
    //       });
    //     }
    /* then upgrade to large */
    //     this._image.src = this._raw.preview.large;
    //     this._image.onload = () => {
    //       this._img = this._image.src;
    //       let i = document.getElementById(this.id);
    //       if (i) {
    //         i.style.webkitAnimationName += ' flipReplaceY';
    //         i.classList.add('replaceY');
    //         i.src = this._image.src;
    //         i.addEventListener('animationend', () => {
    //           i.style.webkitAnimationName='';
    //           i.classList.remove('replaceY');
    //         });
    //       }
    //     }
    //   }
    // }
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

  get raw() {
    return this._raw;
  }
  set raw(raw) {
    this._raw = raw;
  }

  /* let GPU do flip.  replace image */
  animateAndReplaceImage(i, transition, className) {
    i.style.webkitAnimationName += ' ' + transition;
    i.classList.add(className);
    i.src = this._image.src;
    i.addEventListener('animationend', () => {
      i.style.webkitAnimationName = '';
      i.classList.remove(className);
    });
  }

  /*
   * start cascading update to get to large image
   * full pipe connecion will complete both downloads
   * during a single animation (fast 3g will show two flips)
   */
  activeContentImageUpgrade(img) {
    /* start upgrading to medium */
    let transition = 'flipReplaceX';
    let className = 'replaceY';

    if (img.src == this._raw.preview.small) {
      this._image.src = this._raw.preview.medium;
    } else if (img.src == this._raw.preview.medium) {
      transition = 'flipReplaceY';
      className = 'replaceY';
      this._image.src = this._raw.preview.large;
    } else
      return;

    this._image.onload = () => {
      this._img = this._image.src;
      if (img)
        this.animateAndReplaceImage(img, transition, className);
      }
    }

  /* raw json display div */
  displayRaw() {
    let divText = `
      <div id="itemRaw" class="raw">
        <pre><span class="small">${JSON.stringify(this.raw, null, 2)}</small></pre>
      </div>
    `;
    return divText;
  }
  /* template literals are awesome */
  toDiv() {
    let htmlTemplate = `
        <div class="item">
          <div class="img-container-spacer">
            <div class="img-container">
              <span></span>
              <img class="stream-image" alt="...Still Loading ${this.img}"
                   id="${this.id}" src="${this.img}"
                   onLoad="app.itemUpgrade(this);"
                   onClick="app.launchVideo('${this.channelName}', ${this.channelMature}, ${this.id});"/>
            </div>
          </div>

          <div class="txt-container">
            <div class="streamDisplayName">
              ${this.streamDisplayName}
            </div>
            <div class="game">
              ${this.gameName} - ${this.viewerCount} Viewers
            </div>
            ${this.displayRaw()}
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
