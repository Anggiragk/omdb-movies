const url = "HTTPS://www.omdbapi.com/?apikey=7e04b8ca&";
// const url = "HTTPS://asd.m/?apikey=7e04b8ca&";
const movieContainer = document.querySelector('.movie-container');
const modalBody = document.querySelector('.modal-body');
const inputKeyword = document.querySelector('.inputKeyword');
const searchButton = document.querySelector('.searchButton');

//event for search button
searchButton.addEventListener('click', async function () {
  try {
    const movies = await getMovies(inputKeyword.value);
    showMovieCards(movies)

  } catch (error) {
    console.log(error)
  }
});

if (!inputKeyword.value) {
  const movies = getMovies(inputKeyword.value);
  movies.then(movies => showMovieCards(movies))
    .catch(response => console.log(`(${response.status}) ${response.statusText}`));
}

// event binding for show detail button
document.addEventListener('click', async function (e) {
  if (e.target.dataset.imdbid) {
    const movieDetail = await getMovieDetail(e.target.dataset.imdbid);
    showMovieDetail(movieDetail);
  }
})

/**
 * get movies from omdb API
 * @param {String} keyword 
 * @returns
 */
function getMovies(keyword) {
  if (!keyword) {
    keyword = "harry potter";
  }
  return fetch(`${url}s=${keyword}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`(${response.status}) ${response.statusText}`)
      }
      return response.json()
    })

    .then(response => {
      if (response.Response == "False") {
        throw new Error(response.Error)
      }
      return response.Search
    })
}

/**
 * generate and show cards of movie
 * @param {Array} movies 
 */
function showMovieCards(movies) {
  let cards = '';
  for (const movie of movies) {
    cards += `
      <div class="col-md-4 my-4">
      <div class="card">
          <img src="${movie.Poster}" class="card-img-top gambar" alt="">
          <div class="card-body">
            <h5 class="card-title">${movie.Title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
            <a href="#" class="btn btn-primary modalDetailButton"  data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${movie.imdbID}">Details</a>
          </div>
        </div>
      </div>`;
  }
  movieContainer.innerHTML = cards;
}

/**
 * get movies from omdb API
 * @param {String} keyword 
 * @returns
 */
function getMovieDetail(imdbID) {
  return fetch(`${url}i=${imdbID}`)
    .then(response => response.json())
    .then(response => response)
}

/**
 * generate and showing modal of movie detail
 * @param {Object} movies 
 * @returns 
 */
function showMovieDetail(movieDetail) {
  modalBody.innerHTML = '';
  let modalMovieDetail = `
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <img src="${movieDetail.Poster}" class="img-fluid" alt="poster ${movieDetail.Title}">
      </div>
      <div class="col-md">
        <ul class="list-group">
          <li class="list-group-item">${movieDetail.Title} (${movieDetail.Year})</h4></li>
          <li class="list-group-item"><strong>Genre: ${movieDetail.Genre} </strong></li>
          <li class="list-group-item"><strong>Runtime: ${movieDetail.Runtime} </strong></li>
          <li class="list-group-item"><strong>Director: ${movieDetail.Director} </strong></li>
          <li class="list-group-item"><strong>Actors: ${movieDetail.Actors}</strong></li>
          <li class="list-group-item"><strong>Plot: ${movieDetail.Plot} </strong></li>
        </ul>
      </div>
    </div>
  </div>
    `;
  modalBody.innerHTML = modalMovieDetail;
}
