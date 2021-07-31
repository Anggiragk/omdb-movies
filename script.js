// $('.searchButton').on('click', function() {
    
//     $.ajax({
//         url: `http://www.omdbapi.com/?apikey=7e04b8ca&s=`+ $('.inputKeyword').val(),
//         success: result =>{
//             const movies = result.Search;
//             let cards = ``;
//             movies.forEach(movie => {
//                 cards += showCards(movie);
//             });
    
//             $('.movie-container').html(cards);
    
    
    
    
//             // ketika tombol detail diklick
//             $('.modalDetailButton').on('click', function() {
//                 $.ajax({
//                     url: `http://www.omdbapi.com/?apikey=7e04b8ca&i=`+ $(this).data("imdbid"),
//                     success: m =>{
//                         const movieDetail = showMovieDetail(m);
    
//                         $('.modal-body').html(movieDetail);
//                     },
//                     error: (e) =>{
//                         // jika error
//                         console.log(e.responseText);
//                     }
//                 })
//             })
//         },
//         error: (e) =>{
//             // jika error
//             console.log(e.responseText);
//         }
//     });
// });
const urlAPI = "http://www.omdbapi.com/?apikey=7e04b8ca&";
const movieContainer = document.querySelector('.movie-container');
const modalBody =  document.querySelector('.modal-body');
const inputKeyword = document.querySelector('.inputKeyword');
const searchButton = document.querySelector('.searchButton');

searchButton.addEventListener('click', function() {
  fetch(`${urlAPI}s=`+inputKeyword.value)
  .then( response => {
    if ( !response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(responseJson => {
    if ( responseJson.Response === "False") {
      throw new Error(responseJson.Error);
    }
    const movies = responseJson.Search;
    let cards = ``;
    movies.forEach( movie => cards+= showCards(movie));
    movieContainer.innerHTML = cards;

    // ketika tombol detail di-klick
    const modalDetailButton = document.querySelectorAll('.modalDetailButton');
    modalDetailButton.forEach(btn => {
      btn.addEventListener('click', function() {
        const imdbid = this.dataset.imdbid;
        fetch(`${urlAPI}i=${imdbid}`)
        .then(response => response.json())
        .then( m => {
          
          modalBody.innerHTML = showMovieDetail(m);

        })
      });
    })
  })
  .catch(err => alert(err));
});




function showCards(movie) {
    return `
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


function showMovieDetail(m) {
    return `
                    <div class="container-fluid">
          <div class="row">
            <div class="col-md-3">
              <img src="${m.Poster}" class="img-fluid" alt="poster ${m.Title}">
            </div>
            <div class="col-md">
              <ul class="list-group">
                <li class="list-group-item">${m.Title} (${m.Year})</h4></li>
                <li class="list-group-item"><strong>Genre: ${m.Genre} </strong></li>
                <li class="list-group-item"><strong>Runtime: ${m.Runtime} </strong></li>
                <li class="list-group-item"><strong>Director: ${m.Director} </strong></li>
                <li class="list-group-item"><strong>Actors: ${m.Actors}</strong></li>
                <li class="list-group-item"><strong>Plot: ${m.Plot} </strong></li>
              </ul>
            </div>
          </div>
        </div>`;
}