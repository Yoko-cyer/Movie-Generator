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

// Plan for favourites button

// dynamically generate button with love heart
// on click of love heart
// save the movie's object


// TO DO: Test the API's for finding movie locations
// I want to
// Show the movie providers name
// Show their logo
// Have a URL to their website (and potentially directly to the movie)
// Will make this clickable to whole card later in project


// NOTE FOR TOMORROW
    // seperate function to render delete buttons after rendering the movies

// variables for API URLs

const movieListURL = 'https://imdb-api.com/en/API/Top250Movies/k_kxd0m127'

let sessionFavourites = [];

// Test container - will change
const movieContainer = document.getElementById('movie-container');
const sourceContainer = document.getElementById('movie-sources-container');
const randomMovieButton = document.getElementById('random-movie-button');
const searchInputEl = document.getElementById('search-input');
const searchButton = document.getElementById('search-submit-button');
const renderFavButton = document.getElementById('render-favourites-button')
const clearFavButton = document.getElementById('clear-favourites-button')


randomMovieButton.addEventListener('click', function () {
    movieContainer.innerHTML = '';
    sourceContainer.innerHTML = '';
    getMovieList();
})

searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    movieContainer.innerHTML = '';
    sourceContainer.innerHTML = '';
    const userInput = searchInputEl.value;
    getSearchResults(userInput);
})

renderFavButton.addEventListener('click', function (event) {
    event.preventDefault();
    sourceContainer.innerHTML = '';
    const favourites = JSON.parse(localStorage.getItem('movie'))
    console.log(favourites)
    renderMovies(favourites)
    renderDeleteButton();
})

clearFavButton.addEventListener('click', function (event) {
    event.preventDefault();
    sessionFavourites = [];
    localStorage.setItem('movie', JSON.stringify(sessionFavourites));
    movieContainer.innerHTML = ''
    sourceContainer.innerHTML = ''
})

function getSearchResults(userInput) {
    const encodedInput = encodeURI(userInput);
    const movieSearchURL = "https://api.themoviedb.org/3/search/movie?api_key=f2bec59cbb0f2bf3a17d6a7cc5d83a0d&language=en-US&query="+ encodedInput +"&page=1&include_adult=false";
    return fetch (movieSearchURL)
        .then(function(response) {
            return response.json();
        })
        .then (function(results){
            const searchResults = results.results
            let finalResults = [];
            for (let i = 0; i < 4; i++) {
                finalResults[i] = {
                    title: searchResults[i].title,
                    rating: searchResults[i].vote_average,
                    year: searchResults[i].release_date,
                    posterURL: 'https://image.tmdb.org/t/p/w500/' + searchResults[i].poster_path,
                    imdbID: searchResults[i].id
                };
                
            }
        renderMovies(finalResults);
        })
}

// async function (why?)
function getMovieList() {
    // placeholder array for the movies

    // fetching top 250 movies data from IMDB API
    return fetch(movieListURL)
        .then(function (response) {

            return response.json();
        })
        // Loop through list 3 times, randomly picking a movie
        .then(function (movies) {
            let movieList = [];
            for (let i = 0; i < 3; i++) {
                const randomMovie = movies.items[Math.floor(Math.random() * movies.items.length)];
                // create object in movieList array for each movie
                movieList[i] = {
                    title: randomMovie.title,
                    rating: 'Rating: ' + randomMovie.imDbRating,
                    year: 'Release: ' + randomMovie.year,
                    primaryCast: randomMovie.crew,
                    posterURL: randomMovie.image,
                    imdbID: randomMovie.id
                };
            };
            renderMovies(movieList);
        });
}


async function renderMovies(movieArray) {

    movieContainer.innerHTML = ''
    
    // For loop that creates elements for each movie and adds them to DOM
    for (let i = 0; i < movieArray.length; i++) {
        const movieID = movieArray[i].imdbID;
        const movieCard = document.createElement('div');
        movieCard.setAttribute('data-imdb', movieID);
        movieCard.setAttribute('id', 'movie-card');
        movieCard.setAttribute('class','movie-card');
        movieCard.setAttribute('id', i);
        movieCard.classList.add('border')

        const movieTitle = document.createElement('h3');
        const movieRating = document.createElement('p');
        const movieYear = document.createElement('p');
        const moviePoster = document.createElement('img');
        const favouriteMovieButton = document.createElement('button')
        const sourcesButton = document.createElement ('button')

        movieTitle.textContent = movieArray[i].title;
        movieRating.textContent =  movieArray[i].rating;
        movieYear.textContent = movieArray[i].year;
        moviePoster.setAttribute("src", movieArray[i].posterURL);

        favouriteMovieButton.textContent = '<3'
        favouriteMovieButton.setAttribute('class','favourite-button')
        sourcesButton.textContent = "Get sources"
        sourcesButton.setAttribute ('class','sources-button')

        movieCard.appendChild(movieTitle);
        movieCard.appendChild(movieRating);
        movieCard.appendChild(movieYear);
        movieCard.appendChild(moviePoster);
        movieCard.appendChild(favouriteMovieButton);
        movieCard.appendChild(sourcesButton)

        movieContainer.appendChild(movieCard);
    }

    return movieArray;
}

function renderDeleteButton () {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Remove this movie";
    deleteButton.setAttribute('class', 'delete-button');

    const movieCards = $('.movie-card')
    console.log(movieCards.length)
    $('.movie-card').each(function(i) {
        movieCards.eq(i).append($(deleteButton.cloneNode(true)));
    })


  

}



// FUNCTION ON CLICK OF DIV
// TODO: Figure out how I can target the divs created by renderMovies() to make them clickable & know which movie was clicked

$(document).on('click', '.sources-button', function () {
   
    const movieID = $(this).parent().attr('data-imdb');

    renderMovieSources(movieID);

});

$(document).on('click', '.favourite-button', function () {

    const saveKey = $(this).parent().attr('') 

    const movieSave = {
        id: $(this).parent().attr('data-imdb'),
        title: $(this).prev().prev().prev().prev().text(),
        rating: $(this).prev().prev().prev().text(),
        year: $(this).prev().prev().text(),
        posterURL: $(this).prev().attr('src')
    }

    

    if (sessionFavourites.includes(movieSave)) {
        return;
    } else {  
        sessionFavourites.push(movieSave);
    }
    
    localStorage.setItem('movie', JSON.stringify(sessionFavourites));


});

$(document).on('click', '.delete-button', function () {

    const movieTitle = $(this).prev().prev().prev().prev().prev().prev().text()
    const oldFavourites = JSON.parse(localStorage.getItem('movie'))

    const removieMovie = oldFavourites.splice(oldFavourites.findIndex(function(i){
        return i.title === movieTitle;
    }), 1);

    localStorage.setItem('movie', JSON.stringify(oldFavourites));

    $(this).parent().remove();

})






$(document).on('click', '.source-card', function () {
    const company = $(this).attr('data-company');
    if (company == 'Google Play Movies') {window.open ('https://play.google.com/store/movies/')}
    if (company == 'Fetch TV') {window.open ('https://www.fetchtv.com.au/')}
    if (company == 'Apple iTunes') {window.open ('https://itunes.apple.com/')}
    if (company == 'Amazon Video') {window.open ('https://www.primevideo.com/')}
    if (company == 'Microsoft Store') {window.open ('https://www.microsoft.com/en-au/store/movies-and-tv')}
    if (company == 'Stan') {window.open ('https://www.stan.com.au/')}
    if (company == 'BINGE') {window.open ('https://binge.com.au/')}
    if (company == 'Foxtel Now') {window.open ('https://www.foxtel.com.au/now/index.html')}
    if (company == 'Netflix') {window.open ('https://www.netflix.com/')}
})

async function renderMovieSources(id) {
    console.log(id)

    const sourceList = await getMovieSources(id);
    sourceContainer.innerHTML = '';

    // This doesn't work, fix later
    if (sourceList === undefined) {
        console.error("Can't find this movie :(");
    }

    for (let i = 0; i < sourceList?.length; i++) {
        const sourceCompany = sourceList[i].company;
        const sourceType = sourceList[i].type;
        const sourceLogo = 'https://image.tmdb.org/t/p/original/' + sourceList[i].logo;

        const sourceCard = document.createElement('div');
        sourceCard.setAttribute('data-company',sourceCompany);
        sourceCard.setAttribute('class', 'source-card');

        const sourceTitleEl = document.createElement('h3');
        const sourceTypeEl = document.createElement('p');
        const sourceLogoEl = document.createElement('img');

        sourceTitleEl.textContent = sourceCompany;
        sourceTypeEl.textContent = sourceType;
        sourceLogoEl.setAttribute("src", sourceLogo)

        sourceCard.appendChild(sourceTitleEl);
        sourceCard.appendChild(sourceTypeEl);
        sourceCard.appendChild(sourceLogoEl);

        sourceContainer.appendChild(sourceCard);


    }
}


//TODO: SOME SORT OF ERROR IF THERE ARE NO RESULTS
function getMovieSources(id) {

    console.log(id)
    const movieSourcesURL = 'https://api.themoviedb.org/3/movie/' + id + '/watch/providers?api_key=f2bec59cbb0f2bf3a17d6a7cc5d83a0d';

    return fetch(movieSourcesURL)
        .then(function (response) {
            return response.json();
    
        })
        .then(function (sources) {
            console.log(movieSourcesURL)
            console.log(sources)
            let australianStreaming = [];
            let australianBuying = [];
            const streams = sources.results.AU.flatrate;
            const purchase = sources.results.AU.buy;
            for (let i = 0; i < streams?.length; i++) {
                australianStreaming[i] = {
                    company: streams[i].provider_name,
                    logo: streams[i].logo_path, // later add the rest of the url here
                    type: "streaming"
                };
            };

            for (let i = 0; i < purchase?.length; i++) {
                australianBuying[i] = {
                    company: purchase[i].provider_name,
                    logo: purchase[i].logo_path, // later add the rest of the url here
                    type: "purchase"
                };
            };

            Array.prototype.push.apply(australianBuying, australianStreaming);
            return australianBuying;
        });

}

// Search planning

// target the dom input element
// target the input itself
// encode input in URL format
// fetch from the api with the given input url
// Loop to get top 5 results, create objects for them
// Render search results
// Give each result a data attribute with the imdb url
// On click of the div
// Send the ID back to the getmoviesources



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

