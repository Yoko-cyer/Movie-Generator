// When the user visits the web page

// watchmode api key OGybiEL34teukqCQLGYa1ofrAAmi6FcCoN7FyfRg

// OMDB api key a730161a

// TMDB Key f2bec59cbb0f2bf3a17d6a7cc5d83a0d

// IMDB Key: k_kxd0m127
// Backup IMDB key: k_alam86n1

// Stand-up notes
// So far today: Instead of outputting a messy array of movies, it now returns an array of objects containing the important features
// Issue i was facing today: I couldn't access the returned data
// Fixed issue by making the function asynchronous (ask sam for specification on exactly how i fixed the problem)



// TO DO: Test the API's for finding movie locations
// I want to
// Show the movie providers name
// Show their logo
// Have a URL to their website (and potentially directly to the movie)
// Will make this clickable to whole card later in project

// variables for API URLs

const movieListURL = 'https://imdb-api.com/en/API/Top250Movies/k_alam86n1'

// Test container - will change
const movieContainer = document.getElementById('movie-container');


// async function (why?)
function getMovieList () {
    // placeholder array for the movies
    
    // fetching top 250 movies data from IMDB API
    return fetch (movieListURL) 
    .then( function(response) {
        
        return  response.json();
    })
    // Loop through list 3 times, randomly picking a movie
    .then ( function (movie){
        let movieList = [];
        for (let i = 0; i < 3; i++) { 
            const randomMovie = movie.items [Math.floor(Math.random()*movie.items.length)];
            // create object in movieList array for each movie
            movieList[i] = {
                title: randomMovie.title,
                rating: randomMovie.imDbRating,
                year: randomMovie.year,
                primaryCast:randomMovie.crew,
                posterURL: randomMovie.image,
                imdbID: randomMovie.id
            };
        }; 
        return movieList; 
    });
}


async function renderMovies () {
    
    const movieArray = await getMovieList();
    const movieID = movieArray[i].imdbID;
    
    // For loop that creates elements for each movie and adds them to DOM
    for (let i = 0; i < movieArray.length; i++) {
        
        const movieCard = document.createElement ('div');
        movieCard.setAttribute('data-imdb', movieID);
        movieCard.setAttribute('id', i);
        movieCard.classList.add('border')
        
        const movieTitle = document.createElement ('p');
        const movieRating = document.createElement ('p');
        const movieYear = document.createElement ('p');
        const moviePoster = document.createElement ('img');
        
        movieTitle.textContent = "Title: " + movieArray[i].title;
        movieRating.textContent = "Rating: " + movieArray[i].rating;
        movieYear.textContent = "Release Year: " + movieArray[i].year;
        moviePoster.setAttribute("src", movieArray[i].posterURL);
        
        movieCard.appendChild(movieTitle);
        movieCard.appendChild(movieRating);
        movieCard.appendChild(movieYear);
        movieCard.appendChild(moviePoster);
        
        movieContainer.appendChild(movieCard);
        
    }

    return movieArray;
}

renderMovies();



// FUNCTION ON CLICK OF DIV
// TODO: Figure out how I can target the divs created by renderMovies() to make them clickable & know which movie was clicked

function findSources() {

    const movieID = movieCard.getAttribute('data-imdb')


    // TODO: FIGURE OUT HOW TO INPUT CUSTOM GET URL FOR EACH MOVIE
    const movieSourcesURL = 'https://api.themoviedb.org/3/movie/'+ +'/watch/providers?api_key=f2bec59cbb0f2bf3a17d6a7cc5d83a0d'

}

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

