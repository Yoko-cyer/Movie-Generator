

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
const sourcesHeader = document.getElementById('sources-header');

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
        $('.favourite-button').hide();
        // renderDeleteButton();
    } else {
        renderFavButton.textContent = "Pick a favourite movie first!"
        console.log('No favourites')
    }
   
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

        const movieID = movieArray[i].imdbID

        const movieCardCol = document.createElement('div');
        movieCardCol.classList.add('column','is-4');

        const movieCardDiv = document.createElement('div');
        movieCardDiv.classList.add('card','movie-card');


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
        movieTitle.classList.add('title','is-5')

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
     
        movieCardCol.appendChild(movieCardDiv)   
        movieContainer.appendChild(movieCardCol)                     

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
   
    const movieID = $(this).prev().attr('data-imdb');

    renderMovieSources(movieID);

});

$(document).on('click', '.favourite-button', function () {

    const saveKey = $(this).prev().attr('') 

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

        localStorage.setItem('movie', JSON.stringify(pastFavourites));


    }

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
    if (company == 'YouTube') {window.open ('https://www.youtube.com/feed/storefront')}
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
       
        const sourceCardCol = document.createElement('div');
        sourceCardCol.classList.add('column', 'is-2');

        sourcesHeader.textContent = "Click one of the links to be directed to their website"

        const sourceCompany = sourceList[i].company;
        const sourceType = sourceList[i].type;
        const sourceLogo = 'https://image.tmdb.org/t/p/original/' + sourceList[i].logo;

        const sourceCardDiv = document.createElement('div');
        sourceCardDiv.classList.add('card','source-card','my-1');
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
        mediaContentDiv.classList.add('media-content','has-text-centered');

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


        sourceCardCol.appendChild(sourceCardDiv)

        sourceContainer.appendChild(sourceCardCol);


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

            if(sources.results.AU?.buy === undefined){
                return;
            } else {
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



