'use strict';
// eslint-disable-next-line no-unused-vars
const store = (function(){
  const setMessageError = function(messageError) {
    this.messageError = messageError;
  };

  const setAdding = function(adding) {
    this.adding = adding;
  };

  const setEditing = function(editing) {
    this.editing = editing;
  };

  const addBookmark = function(bookmark) {
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const findAndUpdate = function(id, newData) {
    const bookmark = this.findById(id);
    Object.assign(bookmark, newData);
  };

  const setBookmarkIsEditing = function(id, isEditing) {
    const bookmark = this.findById(id);
    bookmark.isEditing = isEditing;
  };

  const setSearchTerm = function(term) {
    this.searchTerm = term;
  };

  const setBookmarkIsExpanded = function(id, isExpanded) {
    const bookmark = this.findById(id);
    bookmark.isExpanded = isExpanded;
  };

  const setBookmarkMsgError = function(id, msgError) {
    const bookmark = this.findById(id);
    bookmark.msgError = msgError;
  };

  return {
    bookmarks: [],
    messageError: '',
    adding: false,
    editing: false,
    searchTerm: 0,

    addBookmark,
    setMessageError,
    setAdding,
    setEditing,
    findById,
    findAndDelete,
    findAndUpdate,
    setSearchTerm,
    setBookmarkIsEditing,
    setBookmarkIsExpanded,
    setBookmarkMsgError,
  };
  
}());