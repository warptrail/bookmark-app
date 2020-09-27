let bookmarks = [

];

let adding = false;

let error = null;

let filter = 0;

// methods

const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
};

const findAndDelete = function (id) {
  // This mutates the bookmarks array with a filtered array 
  // of all bookmarks in the list that are not equal to the id we want to delete
  this.bookmarks = this.bookmarks.filter(selectedBookmark => selectedBookmark.id !== id);
  console.log(this.bookmarks);
};



// exports

export default {
  bookmarks,
  adding,
  error,
  filter,
  addBookmark,
  findAndDelete
};


