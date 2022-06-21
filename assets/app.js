// When the user visits the web page


function getMovieList () {
    const movieListURL = 'https://k2maan-moviehut.herokuapp.com/api/movies?page=5&limit=100'

    let movieList = [];

    fetch (movieListURL) 
        .then(function(response) {
            return response.json();
        })
        .then (function (movie){
            for (let i = 0; i < 3; i++) {     
                const randomMovie = movie.data [Math.floor(Math.random()*movie.data.length)]
                movieList.push(randomMovie);
            }
        });
    
  console.log(movieList);  
}


getMovieList();

// We wait for them to click the generate button

// when the user clicks the generate button

// For loop x3
// randomly select a movie from the catalogue
// Create variables for movie name, metaScore, and overview
// Display each movie in its card
    // Movie title
    // Movie metaScore
    // Movie overview

// When the user clicks on a movie
// The movie title is sent to to watchmode api
// Links for each video provider are retrieved

// Create a clickable card for each provider
    // provider name
    // provider logo

