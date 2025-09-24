

const FILMS_URL = 'http://localhost:3000/films';
const listElement = document.getElementById('film-list');
const detailsElement = document.getElementById('film-details-container');

let allFilms = [];

// Function to fetch the film list from the local server
function fetchAndDisplayFilms() {
    fetch('http://localhost:3000/films')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(films => {
            if (films && films.length > 0){
            films.forEach(film => {
                const listItem = document.createElement('li');
                listItem.textContent = film.title;
                listItem.dataset.filmId = film.id; 
                listElement.appendChild(listItem);
            });

            const firstFilmId = films[0].id; 
            showFilmDetails(firstFilmId);

            } else {
                listElement.innerHTML = '<li>No films found.</li>';
                detailsElement.innerHTML = '<p>No films to display details for.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching film list:', error);
            listElement.innerHTML = '<li>Failed to load films.</li>';
        });
}

// Function to fetch and display details for a specific film
function showFilmDetails(filmId) {
    const DETAILS_URL = `${FILMS_URL}/${filmId}`;
    
    detailsElement.innerHTML = '<p>Loading details...</p>';
    
    fetch(DETAILS_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(film => {
            const remainingTickets = film.capacity - film.tickets_sold
            detailsElement.innerHTML = `
             <div class= "posters">
                <img src="${film.poster}" alt="Poster for ${film.title}">
            </div>
            <div class= "details">
                <h3>${film.title}</h3>
                <p><strong>Runtime:</strong> ${film.runtime} minutes</p>
                <p>${film.description}</p>
                <p class= "showtime">Showtime: ${film.showtime}</p>
                <p class= "tickets"> Remaining tickets: ${remainingTickets}</p>
                <button>Buy Tickets</button>
            </div>
            `;
    
        })
        .catch(error => {
            console.error('Error fetching film details:', error);
            detailsElement.innerHTML = '<p>Failed to load film details.</p>';
        });
}


listElement.addEventListener('click', event => {
    if (event.target.tagName === 'LI') {
        const filmId = event.target.dataset.filmId;
        if (filmId) {
            showFilmDetails(filmId);
        }
    }
});


fetchAndDisplayFilms();

