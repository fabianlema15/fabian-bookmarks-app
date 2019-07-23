'use strict';
/* global shoppingList, store, api */

$(document).ready(function() {
  bookmarkList.bindEventListeners();

  // On initial load, fetch Shopping Items and render
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => {
      	store.addBookmark(bookmark);
      });
      bookmarkList.render();
    })
    .catch(err => console.log(err.message));
});


