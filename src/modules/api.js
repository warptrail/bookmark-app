const BASE_URL = 'https://thinkful-list-api.herokuapp.com/warptrail';

const getBookmarks = function () {
  return fetch(`${BASE_URL}/bookmarks/`);
};


//{"title": "Space Jam","url": "https://www.spacejam.com/","desc": "Suffering succotash! What's wrong with all of ya? I say... we get a ladder","rating": 5}


// Add a new bookmark by POST to api
const createBookmark = function (title, url, rating, desc) {
  let newBookmark = {
    'title': title,
    'url': url,
    'rating': rating,
    'desc': desc
  };

  return fetch(`${BASE_URL}/bookmarks/`, 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: `${JSON.stringify(newBookmark)}`
    }
  );

};

// Delete a bookmark in the api
const deleteBookmark = function(id) {
  return fetch (`${BASE_URL}/bookmarks/${id}`,
    {
      method: 'DELETE'
    }
  );
};

export default {
  getBookmarks,
  createBookmark,
  deleteBookmark
};