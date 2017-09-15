/*
 * Manages positioning, navigation through items
 * Could build this out to expand with repeated service requests using offset
 */
class Pager {
  constructor(itemArray, total, pageSize) {
    this._items = itemArray;
    this._total = total;
    this._currentPage = 1;
    this._length = itemArray.length;
    this._pageSize = pageSize;
    this._pageCount = Math.ceil(this._length / this.pageSize);
    this._pagerState = true;
    this._lastOffset = 0;
  }

  get items() {
    return this._items;
  }
  set items(items) {
    this._items = items;
  }
  get total() {
    return this._total;
  }
  get pageSize() {
    return this._pageSize;
  }
  get pageCount() {
    return this._pageCount;
  }
  set pageCount(pageCount) {
    this._pageCount = pageCount;
  }
  get currentPage() {
    return this._currentPage;
  }
  set currentPage(currentPage) {
    this._currentPage = currentPage;
  }
  get pagerState() {
    return this._pagerState;
  }
  set pagerState(pagerState) {
    this._pagerState = pagerState;
  }
  get lastOffset() {
    return this._lastOffset;
  }
  set lastOffset(lastOffset) {
    this._lastOffset = lastOffset;
  }

  /* takes array of items adds to existing and updates pageCount */
  addItems(items) {
    items.forEach((i) => {this._items.push(i)});
    this.pageCount = Math.ceil(this.items.length / this.pageSize);
  }

  getItemById(id) {
    for (let i of this.items) {
      if (i.raw._id == id) return i;
    }
    return -1;
  }

  /* force reverse sort by viewer count after fully loaded */
  sort() {
    this._items.sort( (a,b) => { return b.viewerCount - a.viewerCount });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this._currentPage--;
    }
  }
  nextPage() {
    if (this.currentPage < this.pageCount) {
      this._currentPage++;
    }
  }

  /*
   * Rebuild the pager body html
   * optimize further by making smaller objects
   * (i.e., avoid click event re-attachment)
   */
  toDiv() {
    let pagerHtml = "";
    let start = (this.pageSize * this.currentPage - this.pageSize)
    for (let i = start; i < Math.min((start + this.pageSize), this.items.length); i++) {
      pagerHtml += this.items[i].toDiv();
    }
    let pageContainerHTML = `
      <div class="container">
        <div class="pager">
          <div id="total">Total Results: ${this.total}
            <span class="small">
              (retrieved <span id="retrieved">${this.items.length}</span> - last offset:
                <span id="lastOffset">${this.lastOffset}</span> - variance:
                <span id="variance">${this.total-this.items.length}</span>)
            </span>
          </div>
          <div id="navButtons">
            <span class="small"> ${this.pageSize} items per page </span>
            <input value="<<" type="button" onclick="app.first()" />
            <input value="<" type="button" onclick="app.prev();" />
            Page ${this.currentPage} of <span id="currentPageCount">${this.pageCount}</span> pages
            <input value=">" type="button" onclick="app.next()" />
            <input value=">>" type="button" onclick="app.last()" />
          </div>
        </div>
        <div id="itemDisplay">
           ${pagerHtml}
        </div>
      </div>
    `;
    return pageContainerHTML;
  }
}
