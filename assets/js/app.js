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


// FIXES FOR NEW HTML

    //fix number of (prevs)
    // fix rendering of sources

// variables for API URLs

const movieListURL = 'https://imdb-api.com/en/API/Top250Movies/k_kxd0m127'

let sessionFavourites = [];

// Test container - will change
const movieContainer = document.getElementById('movie-container'); //
const sourceContainer = document.getElementById('movie-sources-container'); //
const randomMovieButton = document.getElementById('random-movie-button'); //
const searchInputEl = document.getElementById('search-input'); //
const searchButton = document.getElementById('search-submit-button');//
const renderFavButton = document.getElementById('render-favourites-button') //
const clearFavButton = document.getElementById('clear-favourites-button') //
const sourcesHeader = document.getElementById('sources-header')


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
    if (favourites.length != 0) {
        renderMovies(favourites)
        clearFavButton.classList.remove('is-hidden')
        // renderDeleteButton();
    } else {
        renderFavButton.textContent = "Pick a favourite movie first!"
        console.log('No favourites')
    }
    $('.favourite-button').hide();
   
})

clearFavButton.addEventListener('click', function (event) {
    event.preventDefault();
    sessionFavourites = [];
    localStorage.setItem('movie', JSON.stringify(sessionFavourites));
    movieContainer.innerHTML = ''
    sourceContainer.innerHTML = ''
    clearFavButton.classList.add('is-hidden')
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
            for (let i = 0; i < searchResults.length; i++) {
                finalResults[i] = {
                    title: searchResults[i].title,
                    rating: "Rating: " + searchResults[i].vote_average,
                    year: "Year: " + searchResults[i].release_date,
                    posterURL: 'https://image.tmdb.org/t/p/w500/' + searchResults[i].poster_path,
                    imdbID: searchResults[i].id
                };
                
            }
        console.log(finalResults)
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
    console.log(movieArray)
    
    // For loop that creates elements for each movie and adds them to DOM
    for (let i = 0; i < movieArray.length; i++) {

        const movieID = movieArray[i].imdbID

        const movieCardDiv = document.createElement('div');
        movieCardDiv.classList.add('card','column','is-4','movie-card');


        const imageDiv = document.createElement('div');
        imageDiv.classList.add('card-image');
            
        const figureDiv = document.createElement('figure');
        figureDiv.classList.add('image', 'is-1by1');

        const movieImg = document.createElement('img');
        movieImg.setAttribute("src", movieArray[i].posterURL);
        movieImg.classList.add('movie-poster')

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('card-content');

        const mediaDiv = document.createElement('div');
        mediaDiv.classList.add('media');
            
        const mediaContentDiv = document.createElement('div');
        mediaContentDiv.classList.add('media-content');

        const movieTitle = document.createElement('p');
        movieTitle.textContent = movieArray[i].title;
        movieTitle.classList.add('title','is-4')

        const innerContentDiv = document.createElement('div')
        innerContentDiv.classList.add('content','has-text-centered')
                
        const movieRating = document.createElement('p');
        movieRating.classList.add('movie-rating')
        movieRating.textContent = movieArray[i].rating

        const releaseYear = document.createElement('p');
        releaseYear.classList.add('release-year')
        releaseYear.textContent = movieArray[i].year;

        const favouriteMovieButton = document.createElement('button')
        favouriteMovieButton.classList.add('button','text-center', "is-small","is-responsive","favourite-button")
        favouriteMovieButton.textContent = "Favourite💗"
        favouriteMovieButton.setAttribute('data-imdb', movieID);

        const findSourcesButton = document.createElement('button')
        findSourcesButton.classList.add('button', "is-small","is-responsive","sources-button")
        findSourcesButton.textContent = "Find Sources"

        const lineBreak = document.createElement('br')

        movieCardDiv.appendChild(imageDiv)
        movieCardDiv.appendChild(contentDiv)
        imageDiv.appendChild(figureDiv)
        figureDiv.appendChild(movieImg)
        contentDiv.appendChild(mediaDiv)
        contentDiv.appendChild(innerContentDiv)
        mediaDiv.appendChild(mediaContentDiv)
        mediaContentDiv.appendChild(movieTitle)
        innerContentDiv.appendChild(movieRating)
        innerContentDiv.appendChild(releaseYear)
        innerContentDiv.appendChild(favouriteMovieButton)
        innerContentDiv.appendChild(findSourcesButton)
        innerContentDiv.appendChild(lineBreak)
     
        movieContainer.appendChild(movieCardDiv)                        

    }

    return movieArray;
}

function renderDeleteButton () {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Remove this movie";
    deleteButton.classList.add('button', "is-small","is-responsive","favourite-button", "delete-button");

    const movieCards = $('.movie-card')
    $('.movie-card').each(function(i) {
        movieCards.eq(i).append($(deleteButton.cloneNode(true)));
    })


  

}



// FUNCTION ON CLICK OF DIV
// TODO: Figure out how I can target the divs created by renderMovies() to make them clickable & know which movie was clicked

$(document).on('click', '.sources-button', function () {
   
    const movieID = $(this).prev().attr('data-imdb');


    renderMovieSources(movieID);
    
    sourcesHeader.scrollIntoView({block:'center', behavior:'smooth'});
});

$(document).on('click', '.favourite-button', function () {

    renderFavButton.textContent = "See your favourite movies!"

    const movieSave = {
        imdbID: $(this).attr('data-imdb'),
        title: $(this).parent().parent().find('.title').text(),
        rating: $(this).parent().find('.movie-rating').text(),
        year: $(this).parent().find('.release-year').text(),
        posterURL: $(this).parent().parent().prev().find('.movie-poster').attr('src')
    }

    

    if (sessionFavourites.includes(movieSave)) {
        return;
    } else {  
        const pastFavourites = JSON.parse(localStorage.getItem('movie'))

        pastFavourites.push(movieSave);
        // console.log(sessionFavourites)

        // // const newSessionFavourites = sessionFavourites.concat(movieSave);

        // const newSave = pastFavourites.concat(pastFavourites, sessionFavourites)
        // console.log(newSave)

        // // ERROR HERE: SETTING ITEM RATHER THAN PSUHING OLD

        localStorage.setItem('movie', JSON.stringify(pastFavourites));

    }
    


});

$(document).on('click', '.delete-button', function () {

    const movieTitle = $(this).parent().find('.title').text()
    console.log(movieTitle)
    const oldFavourites = JSON.parse(localStorage.getItem('movie'))
    console.log(oldFavourites)

    // oldFavourites.splice(oldFavourites.findIndex(function(i){
    //     return i.title === movieTitle;
    // }), 1);

    oldFavourites.splice(oldFavourites.findIndex(function(i){
        return i.title === movieTitle
    }), 1)

    console.log(oldFavourites)

    // localStorage.setItem('movie', JSON.stringify(oldFavourites));

    $(this).parent().remove();

})






$(document).on('click', '.source-card', function () {
    const company = $(this).attr('data-company');
    console.log(company)
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
        sourcesHeader.textContent = "Sorry, we could not find any sources for this movie."
    }

    for (let i = 0; i < sourceList?.length; i++) {
        sourcesHeader.textContent = "Click one of the links to be directed to their website"

        const sourceCompany = sourceList[i].company;
        const sourceType = sourceList[i].type;
        const sourceLogo = 'https://image.tmdb.org/t/p/original/' + sourceList[i].logo;

        const sourceCardDiv = document.createElement('div');
        sourceCardDiv.classList.add('card','column','mx-2', 'is-three-quarters-mobile','is-one-third-desktop','source-card','mx-1','my-1');
        sourceCardDiv.setAttribute('data-company',sourceCompany)

        const cardImageContainer = document.createElement('div');
        cardImageContainer.classList.add('card-image');

        const imageFigure = document.createElement('figure');
        imageFigure.classList.add('image','is-4by3');

        const sourceImage = document.createElement('img');
        sourceImage.setAttribute('src',sourceLogo);

        const cardContentContainer = document.createElement('div');
        cardContentContainer.classList.add('card-content');

        const cardMediaDiv = document.createElement('div');
        cardMediaDiv.classList.add('media');

        const mediaContentDiv = document.createElement('div');
        mediaContentDiv.classList.add('media-content');

        const companyName = document.createElement('p')
        companyName.textContent = sourceCompany;

        const purchaseType = document.createElement('p');
        purchaseType.textContent = 'Type: ' + sourceType;

        sourceCardDiv.appendChild(cardImageContainer);
        cardImageContainer.appendChild(imageFigure);
        imageFigure.appendChild(sourceImage);
        sourceCardDiv.appendChild(cardContentContainer);
        cardContentContainer.appendChild(cardMediaDiv);
        cardMediaDiv.appendChild(mediaContentDiv);
        mediaContentDiv.appendChild(companyName);
        mediaContentDiv.appendChild(purchaseType);

        sourceContainer.appendChild(sourceCardDiv);




        // CARD
            // DIV CARD IMAGE
                // FIGURE IMAGE
                    // IMG
            // DIV CARD CONTENT
                // DIV MEDIA
                    // DIV MEDIA-CONTENT
                        // P
                        // p


        // const sourceCard = document.createElement('div');
        // sourceCard.setAttribute('data-company',sourceCompany);
        // sourceCard.setAttribute('class', 'source-card');

        // const sourceTitleEl = document.createElement('h3');
        // const sourceTypeEl = document.createElement('p');
        // const sourceLogoEl = document.createElement('img');

        // sourceTitleEl.textContent = sourceCompany;
        // sourceTypeEl.textContent = sourceType;
        // sourceLogoEl.setAttribute("src", sourceLogo)

        // sourceCard.appendChild(sourceTitleEl);
        // sourceCard.appendChild(sourceTypeEl);
        // sourceCard.appendChild(sourceLogoEl);

        // sourceContainer.appendChild(sourceCard);


    }
}

$('form input').keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        return false;
    }
});

//TODO: SOME SORT OF ERROR IF THERE ARE NO RESULTS
function getMovieSources(id) {

    const movieSourcesURL = 'https://api.themoviedb.org/3/movie/' + id + '/watch/providers?api_key=f2bec59cbb0f2bf3a17d6a7cc5d83a0d';

    return fetch(movieSourcesURL)
        .then(function (response) {
            return response.json();
    
        })
        .then(function (sources) {
            console.log(sources.results.AU?.buy)
            if(sources.results.AU?.buy === undefined){
                return;
            } else {
                
                let australianStreaming = [];
                let australianBuying = [];
                const streams = sources.results.AU.flatrate;
                const purchase = sources.results.AU.buy;
                for (let i = 0; i < streams?.length; i++) {
                    australianStreaming[i] = {
                        company: streams[i].provider_name,
                        logo: streams[i].logo_path, // later add the rest of the url here
                        type: "Streaming"
                    };
                };
    
                for (let i = 0; i < purchase?.length; i++) {
                    australianBuying[i] = {
                        company: purchase[i].provider_name,
                        logo: purchase[i].logo_path, // later add the rest of the url here
                        type: "Purchase"
                    };
                };
    
                Array.prototype.push.apply(australianBuying, australianStreaming);
                return australianBuying;
            }
        });

}

// BUG
    // ITEMS SAVED TO LOCAL STORAGE ARE ERASED WHEN NEW ITEMS ARE SAVED IN NEW SESSION
    // PROBABLY RELATED TO RE-SETTING THE LOCAL STORAGE

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

