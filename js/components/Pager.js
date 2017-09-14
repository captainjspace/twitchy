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
  }

  get items() {
    return this._items;
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
  get currentPage() {
    return this._currentPage;
  }
  set currentPage(currentPage) {
    this._currentPage = currentPage;
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
   * can be optimized further...
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
            <span class="small">(limit 100 - retrieved ${this.items.length} - default offset: 0)</span>
          </div>
          <div id="navButtons">
            <input value="<<" type="button" onclick="app.first()" />
            <input value="<" type="button" onclick="app.prev();" />
            (page)${this.currentPage} of ${this.pageCount}
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
