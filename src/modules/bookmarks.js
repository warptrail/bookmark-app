/* eslint-disable eqeqeq */
// import jquery and cuid
import $ from 'jquery';
import cuid from 'cuid';

// import the store and api modules
import store from './store';
import api from './api'; 
import logo from '../img/icon-default.ico';

// HTML generators that the render function will use
// generate the title for a bookmark

const bookmarkHeader = `
      <div class="logo">
        <img src="${logo}" alt="warptrail logo" class="logo-ico" />
      </div>
    <h1>Bookmark collection</h1>
  `;



const generateBookmarkElement = function (bookmark) {
  // console.log(bookmark, 'is passed in from the map');

  let bookmarkTitle = `<h2 class="bookmark-title">${bookmark.title}</h2>`;
  let bookmarkUrl = `<a href="${bookmark.url}" target="_blank">Visit this site</a>`;
  let bookmarkRating = '';
  let bookmarkDesc = `<p>${bookmark.desc}</p>`;

  switch(bookmark.rating) {
  case bookmark.rating = 1:
    bookmarkRating = '<p>★</p>';
    break;
  case bookmark.rating = 2:
    bookmarkRating = '<p>★★</p>';
    break;
  case bookmark.rating = 3:
    bookmarkRating = '<p>★★★</p>';
    break;
  case bookmark.rating = 4:
    bookmarkRating = '<p>★★★★</p>';
    break;
  case bookmark.rating = 5:
    bookmarkRating = '<p>★★★★★</p>';
    break;
  }

  let bookmarkElement = `
    <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
      <div class="bookmark-bubble">
        ${bookmarkTitle}
        ${bookmarkRating}
      </div>
      <div class="bookmark-expand hidden">
        <div class="bookmark-link">
        ${bookmarkUrl}
        </div>
      ${bookmarkDesc}
      <button class="delete-bookmark">Delete</button>
      </div>
    </li>
  `;

  console.log(typeof bookmarkElement);
  return bookmarkElement;
};



const generateBookmarkListString = function (bookmarkList) {
  const bookmarks = bookmarkList.map(bookmark => generateBookmarkElement(bookmark));
  let filter = store.filter;

  let allResults = '<p class="display-notification">Displaying all ratings</p>';
  let filterResults = `<p class="display-notification">Displaying ${filter} stars and above</p>`;
  
  return `
  <form class="bookmark-controls">
      <div class="add-bm-btn">
      <button id="showAddBookmarkForm">Add Bookmark</button>
      </div>
      
      <div class="filter-by-rating"e>
      <label for="stars">Filter by label</label>
        <select name="stars" id="stars">
          <option value = "0"> All </option>
          <option value = "1"> ★ </option>
          <option value = "2"> ★★ </option>
          <option value = "3"> ★★★ </option>
          <option value = "4"> ★★★★ </option>
          <option value = "5"> ★★★★★ </option>
        </select>
      </div>
  </form>

  ${filter == 0 ? allResults : filterResults}
  <ul>
    ${bookmarks.join('')}
  </ul>
  `;
};

const generateAddNewBookmarkString = function () {
  return `
    <form class="add-bm-form">
    <div class="error-message"></div>
      <div class="add-bm">
        <label for="bookmark-title">Title</label>
        <input type="text" name="bookmark-title" id="title" required />
      </div>
      
      <div class="add-bm">
        <label for="url">URL</label>
        <input type="text" id="url" name="bookmark-url" required />
      </div>

    <div class="add-bm">
    <label for="rating">Rating</label>
      <select id="rating">
        <option value = "1"> ★ </option>
        <option value = "2"> ★★ </option>
        <option value = "3" selected> ★★★ </option>
        <option value = "4"> ★★★★ </option>
        <option value = "5"> ★★★★★ </option>
      </select>
    </div>

    <div class="add-bm">
      <label for="bookmark-description">Description</label>
      <textarea id="desc" name="bookmark-description"></textarea>
    </div>
    
    <div class="add-bm form-btns">
      <input type="submit" id="addBookmark" value="add bookmark"/>
      <button type="button" id="backToList">Back to List</button>
    </div>
     

    </form>

    
    `;
};

// Controller functions
const addingNewBookmark = function () {
  store.adding = true;
};

const backToBookmarkList = function () {
  store.adding = false;
};



// Render the page dependent on what's in the store

const render = function () {
  let visibleString = '';
  let bookmarks = [...store.bookmarks];

  if(store.filter !== 0) {
    bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filter);

  }

  // render the bookmark list in the DOM
  const bookmarkListString = generateBookmarkListString(bookmarks);
  const addNewBookmarkString = generateAddNewBookmarkString();

  
  if (store.adding === false) {
    visibleString = bookmarkListString;
  } else {
    visibleString = addNewBookmarkString;
  }

  

  // insert that HTML into the DOM
  $('header').html(bookmarkHeader);
  $('main').html(visibleString);

};

// Handler functions

const handleAddBookmarkButton = function () {
  $('main').on('click', '#showAddBookmarkForm', (event) => {
    event.preventDefault();
    addingNewBookmark();
    render();
  });
};


const handleBackToListButton = function () {
  $('main').on('click', '#backToList', (event) => {
    event.preventDefault();
    backToBookmarkList();
    render();
  });
};

const handleAddNewBookmarkSubmit = function () {
  // The event of clicking the submit button
  $('main').on('submit', 'form', (event) => {
    event.preventDefault();
    console.log(event.target);

    // storing the input fields as variables
    const newBookmarkTitle = $('#title').val();
    $('#title').val('');

    const newBookmarkUrl = $('#url').val();
    $('#url').val('');

    const newBookmarkRating = $('#rating').val();
    $('#rating').val('');

    const newBookmarkDesc = $('#desc').val();
    $('#desc').val('');

    api.createBookmark(newBookmarkTitle, newBookmarkUrl, newBookmarkRating, newBookmarkDesc)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.adding = false;
        render();
      })
      .catch((error) => {
        store.adding = true;
        $('.error-message').html('An error occured. It is likely you entered an invalid URL. Please check your bookmark link and try again.');
        console.log(error);
      });

  });
};

// Handle the click the delete button event
// but first need to link each delete button to its respected bookmark id!

const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark)
    .closest('.js-bookmark-element')
    .data('bookmark-id');
};

const handleDeleteBookmarkButton = function () {
  $('main').on('click', '.delete-bookmark', (event) => {
    event.preventDefault();
    console.log('delete!');
    console.log(event.target);

    const id = getBookmarkIdFromElement(event.currentTarget);
    console.log(id);

    api.deleteBookmark(id)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new TypeError('error: unable to delete item');
      })
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        console.log(error.message);
      });
  });
};

// handle the changing of the select menu to filter by rating
const handleFilterBookmarksByStars = function () {
  $('main').on('change', '#stars', (event) => {
    
    store.filter = event.target.value;
    
    render();
  });
};

// handle toggling the expanded view of each bookmark
const handleExpandBookmarkBubble = function () {
  $('main').on('click', '.bookmark-bubble', (event) => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    console.log('you have clicked ' + id + ' bubble!');

    $(`li[data-bookmark-id=${id}] .bookmark-expand`).toggleClass('hidden');
  });
};

// bind all the event listeners to export

const bindEventListeners = function () {
  handleAddBookmarkButton();
  handleBackToListButton();
  handleAddNewBookmarkSubmit();
  handleDeleteBookmarkButton();
  handleFilterBookmarksByStars();
  handleExpandBookmarkBubble();
};

export default {
  render,
  bindEventListeners
};