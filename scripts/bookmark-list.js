'use strict';
/* global store, api, $ */

// eslint-disable-next-line no-unused-vars
const bookmarkList = (function(){

  function generateError(message) {
    return `
      <section class="error-content">
        <button type="button" class="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateErrorBookmark(id, message) {
    return `
      <section class="error-content">
        <button type="button" class="cancel-error-bookmark" data-bookmark-id="${id}">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateBookmarkElement(bookmark) {
      let stars = "";
      for (let i = 0; i < 5; i++){
        stars += `<span class="fa fa-star ${i<bookmark.rating?'checked':''}"></span>`;
      }

      let bookmarkTitle = `${bookmark.title}<span class="fa ${bookmark.isExpanded?'fa-caret-square-o-up':'fa-caret-square-o-down'}"></span>`;
      let bookmarkBody = `${stars}`;
      let bookmarkFooter = "";
      if (bookmark.isExpanded){
        bookmarkBody = `<p>${bookmark.desc}</p><a type="button" href"${bookmark.url}">${bookmark.url}</a>` + bookmarkBody; 
        bookmarkFooter = `<div class="panel bookmark-panel-footer">
          <button class="js-button-delete">Delete</button>
          <button class="js-button-edit">Edit</button>
        </div>`
      }

      return `<div class="bookmark-panel" data-bookmark-id="${bookmark.id}">
        <div class="panel bookmark-panel-header js-expand-collapse">
          ${bookmarkTitle}
        </div>
        <div class="panel bookmark-panel-body">
          ${bookmarkBody}
        </div>
        ${bookmarkFooter}
      </div>`;
  }

  function generateNewBookmarkString(){
    return `<div class="bookmark-panel">
        <div class="panel bookmark-panel-header">
          Add New Bookmark
        </div>
        <div class="panel bookmark-panel-body">
          <form class="js-new-bookmark-form">
            <label>Title:</label>
            <input type="text" name="title" id="title" required />
            <label>Url Link:</label>
            <input type="text" name="url" id="url" required/>
            <label>Description:</label>
            <textarea rows="4" name="desc" id="desc" required></textarea>
            <label>Rating:</label>
            <label>1</label>
            <input type="radio" name="rating" value="1" required>
            <label>2</label>
            <input type="radio" name="rating" value="2" required>
            <label>3</label>
            <input type="radio" name="rating" value="3" required>
            <label>4</label>
            <input type="radio" name="rating" value="4" required>
            <label>5</label>
            <input type="radio" name="rating" value="5" required>
            <div class="error-container"></div>
            <button type="button" class="js-button-cancel">Cancel</button>
            <button type="submit" class="js-button-save">Save</button>
          </form>
        </div>
        <div class="bookmark-panel-footer">
        </div>
      </div>`;
  }

  function generateEditBookmarkString(bookmark){
    return `<div class="bookmark-panel" data-bookmark-id="${bookmark.id}">
        <div class="panel bookmark-panel-header">
          ${bookmark.title}
        </div>
        <div class="panel bookmark-panel-body">
          <form class="js-edit-bookmark-form">
            <label>Description:</label>
            <textarea rows="4" name="desc" id="desc">${bookmark.desc}</textarea>
            <label>Rating:</label>
            <label>1</label>
            <input type="radio" name="rating" value="1" ${bookmark.rating===1?'checked':''} required>
            <label>2</label>
            <input type="radio" name="rating" value="2" ${bookmark.rating===2?'checked':''} required>
            <label>3</label>
            <input type="radio" name="rating" value="3" ${bookmark.rating===3?'checked':''} required>
            <label>4</label>
            <input type="radio" name="rating" value="4" ${bookmark.rating===4?'checked':''} required>
            <label>5</label>
            <input type="radio" name="rating" value="5" ${bookmark.rating===5?'checked':''} required>
            <div class="bm-err-cont-${bookmark.id}"></div>
            <button type="button" class="js-button-edit-cancel">Cancel</button>
            <button type="submit" class="js-button-edit-save">Save</button>
          </form>
        </div>
        <div class="bookmark-panel-footer">
        </div>
      </div>`;
  }
  
  
  function generateShoppingBookmarksString(bookmarksList) {
    const bookmarks = bookmarksList.map((bookmark) => {
      if (bookmark.isEditing){
        return generateEditBookmarkString(bookmark);
      }
      return generateBookmarkElement(bookmark)
    });
    return bookmarks.join('');
  }
  
  function renderError() {
    if (store.messageError) {
      const el = generateError(store.messageError);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }
  }

  function renderErrorBookmark(bookmark) {
    if (bookmark.msgError) {
      const el = generateErrorBookmark(bookmark.id, bookmark.msgError);
      $('.bm-err-cont-'+bookmark.id).html(el);
    } else {
      $('.bm-err-cont-'+bookmark.id).empty();
    }
  }
  
  function render() {
    // Filter bookmark list if store prop is true by bookmark.checked === false
    let bookmarks = [ ...store.bookmarks ];
  
    // Filter bookmark list if store prop `searchTerm` is not empty
    if (store.searchTerm > 1) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.searchTerm);
    }
  
    // render the shopping list in the DOM
    const listBookmarksString = generateShoppingBookmarksString(bookmarks);
  
    // insert that HTML into the DOM
    $('.bookmark-new').html('');
    if (store.adding){
      $('.bookmark-new').html(generateNewBookmarkString());
    }
    $('.bookmarks-list').html(listBookmarksString);
    renderError();
  }

  function loadHeader(){
    const html = `<button class="js-button-add">+</button>
      <label for="select-rating">Filter by minimum rating</label>
      <select id="select-rating" class="js-select-rating">
        <option value="0">All</option>
        <option value="1">1 Star</option>
        <option value="2">2 Stars</option>
        <option value="3">3 Stars</option>
        <option value="4">4 Stars</option>
        <option value="5">5 Stars</option>
      </select>`;
    $('.bookmark-header').html(html);
  }

  function handleExpandCollapse(){
    $('.bookmarks-list').on('click', '.js-expand-collapse', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      store.setBookmarkIsExpanded(id, !store.findById(id).isExpanded);
      render();
    });
  }

  function handleChangeRating(){
    $('.bookmark-header').on('change', '.js-select-rating', event => {
      store.searchTerm = parseInt($(event.currentTarget).find(':selected').val());
      render();
    });
  }

  function handleDeleteBookmark(){
    $('.bookmarks-list').on('click', '.js-button-delete', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id)
        .then((bookmark) => {
          store.findAndDelete(id);
          render();
        })
        .catch(err => console.log(err.message));
    });
  }

  function handleEditBookmark(){
    $('.bookmarks-list').on('click', '.js-button-edit', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      store.setBookmarkIsEditing(id, true);
      render();
    });
  }

  function handleNewBookmark(){
    $('.bookmark-header').on('click', '.js-button-add', event => {
        store.adding = true;
        render();
    });
  }

  function handleCancelNewBookmark(){
    $('.bookmark-new').on('click', '.js-button-cancel', event => {
        store.adding = false;
        render();
    });
  }

  function handleCancelEditBookmark(){
    $('.bookmarks-list').on('click', '.js-button-edit-cancel', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      store.setBookmarkIsEditing(id, false);
      render();
    });
  }

  function handleSubmitNewBookmark(){
    $('.bookmark-new').on('submit', '.js-new-bookmark-form', event => {
      event.preventDefault();
      api.createBookmark(Object.fromEntries(new FormData(event.target)))
        .then((bookmark) => {
          store.addBookmark(bookmark);
          store.adding = false;
          render();
        })
        .catch(err => {
          store.setMessageError(err.message);
          renderError();
        });
    });
  }

  function handleSubmitEditBookmark(){
    $('.bookmarks-list').on('submit', '.js-edit-bookmark-form', event => {
      event.preventDefault();
      const bookmarkEdited = Object.fromEntries(new FormData(event.target));
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.updateBookmark(id, bookmarkEdited)
        .then((bookmark) => {
          store.findAndUpdate(id, bookmarkEdited);
          store.setBookmarkIsEditing(id, false);
          render();
        })
        .catch(err => {
          store.setBookmarkMsgError(id, err.message);
          renderErrorBookmark(store.findById(id));
        });
    });
  }
  
  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.bookmark-panel')
      .data('bookmark-id');
  }

  function handleCloseError() {
    $('.bookmark-new').on('click', '.cancel-error', () => {
      store.setMessageError('');
      renderError();
    });
  }

  function handleCloseErrorBookmark() {
    $('.bookmarks-list').on('click', '.cancel-error-bookmark', event => {
      const id = $(event.currentTarget).data('bookmark-id');
      store.setBookmarkMsgError(id, '');
      renderErrorBookmark(store.findById(id));
    });
  }
  
  function bindEventListeners() {
    /*handleNewBookmarkSubmit();
    handleBookmarkCheckClicked();
    handleDeleteBookmarkClicked();
    handleEditShoppingBookmarkSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
    handleBookmarkStartEditing();
    */
    
    handleNewBookmark();
    handleChangeRating();
    handleCancelNewBookmark();
    handleSubmitNewBookmark();
    handleExpandCollapse();
    handleEditBookmark();
    handleCancelEditBookmark();
    handleSubmitEditBookmark();
    handleCloseErrorBookmark();
    handleDeleteBookmark();
    handleCloseError();
    loadHeader();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());