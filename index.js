

const FILMS_URL = 'http://localhost:3000/films';
const listElement = document.getElementById('film-list');
const detailsElement = document.getElementById('film-details-container');

let allFilms = [];

function renderFilmList(films){
    const filmList = document.getElementById("film-list");
    filmList.innerHtml = '';

    films.forEach(film => {
        const li= document.createElement("li");
        li.innerHTML = `
        <span class = "film-title">${film.title}</span>
        <button class = "delete-btn"data-id = "${film.title}">Delete</button>
        `;
        filmList.appendChild(li);

        li.querySelector(".film-title").addEventListener("click",() =>{
            showFilmDetails(film.id);
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            deleteFilm(film.id, li);
        })
    })
}

function loadFilms() {
    fetch('http://localhost:3000/films')
    .then(res => res.json())
    .then (films => {
        renderFilmList(films);
    })
    .catch(error => console.error("Error loading films",error));
}
loadFilms();

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
            let remainingTickets = film.capacity - film.tickets_sold
            detailsElement.innerHTML = `
             <div class= "posters">
                <img src="${film.poster}" alt="Poster for ${film.title}">
            </div>
            <div class= "details">
                <h3>${film.title}</h3>
                <p><strong>Runtime:</strong> ${film.runtime} minutes</p>
                <p>${film.description}</p>
                <p class= "showtime">Showtime: ${film.showtime}</p>
                <p id= "tickets"> Remaining tickets: ${remainingTickets}</p>
                <button id= "buy-tickets">Buy Tickets</button>
            </div>
            `;
            const ticketsElement = document.getElementById("tickets")
            const button = document.getElementById("buy-tickets")

               button.addEventListener("click",() =>{
                   if (remainingTickets > 0){
                    remainingTickets--;
                    ticketsElement.textContent = `Remaining tickets: ${remainingTickets}`;
                   } 

                   if (remainingTickets === 0){
                    button.textContent = "Sold Out";
                    button.disabled = true;
                    button.style.cursor = "not-allowed"
                   }
            
        });
    
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


