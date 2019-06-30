const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');


function apiSearch(event) {

    event.preventDefault();                                     //не обновлять страницу при нажатии энтер в строке
    const searchText = document.querySelector('.form-control').value;
    if (searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Введите запрос</h2>';
        return;
    }
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=6aab1502d97ac3acab566ecf831eae0d&language=ru&query=' + searchText;
    const urlPoster = 'https://image.tmdb.org/t/p/original';

    movie.innerHTML = '<div class="spinner"></div>';

    fetch(server)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function (output) {
            let inner = '';
            if (output.results.length === 0) {
                inner += '<h2 class="col-12 text-center text-info">Ничего не найдено</h2>';
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let releaseDate = item.first_air_date || item.release_date;
                let picPath = item.poster_path; //urlPoster + picPath
                const poster = picPath ? urlPoster + picPath : './img/no-poster.jpg';
                let genre = item.media_type;
                let description = item.overview;
                let votes = item.vote_average;

                let dataInfo = '';

                if (item.media_type !== 'person') {
                    dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                }

                inner += `
<div class="col-12 col-md-4 col-xl-3 text-center item">
    <img src= "${poster}" alt="${nameItem}" ${dataInfo} class="mw-100 poster">
    <h5>${nameItem}</h5>
</div>`;
            });
            movie.innerHTML = inner;

            addEveneMedia();
        })
        .catch(function (reason) {
            movie.innerHTML = '<h2 class="col-12 text-center text-danger">Ой, что-то пошло не так :(</h2>';
            console.error('error: ' + reason);
        });

}

searchForm.addEventListener('submit', apiSearch);

function addEveneMedia() {
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function (elem) {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    });

}

function showFullInfo() {
    let url = '';
    if (this.dataset.type === 'movie') { // dataset обрабатывает бразуер, все атрибуты с data-* скидывает в обьекты
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=6aab1502d97ac3acab566ecf831eae0d&language=ru';
    } else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=6aab1502d97ac3acab566ecf831eae0d&language=ru';
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка, повторите позже</h2>';
    }

    fetch(url)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function (output) {
            const urlPoster = 'https://image.tmdb.org/t/p/original';
            let poster = output.poster_path ? urlPoster + output.poster_path : './img/no-poster.jpg';
            let name = output.name || output.title;
            let releaseDate = output.first_air_date || output.release_date;
            let type = output.media_type === 'movie' ? 'Фильм' : 'Сериал';
            let description = output.overview ? output.overview : 'Отсутствует';
            let votes = output.vote_average ? output.vote_average : 'Неизвестно';
            const background = document.querySelector('#container');
            background.style.backgroundImage = `url("${poster}")`;
            movie.innerHTML = `
<h4 class="col-12 text-center text-info">
${name}
</h4> 

<div class="col-4 text-center">

<img src="${poster}" alt="${name}" class="mw-100 poster">
${output.homepage ? `<p><a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
${output.imdb_id ? `<p><a href="https://www.imdb.com/title/${output.imdb_id}" target="_blank">Страница IMDb.com</a></p>` : ''}
</div>

<div class="col-8">
<p>Премьера: ${releaseDate}</p>
<p>Тип: ${type}</p>
<p>Рейтинг: ${votes}</p>
<hr>
<h6>Обзор</h6>
<p>${description}</p>
</div>`;
        })
        .catch(function (reason) {
            movie.innerHTML = '<h2 class="col-12 text-center text-danger">Ой, что-то пошло не так :(</h2>';
            console.error('error: ' + reason);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const urlPoster = 'https://image.tmdb.org/t/p/original';

    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=6aab1502d97ac3acab566ecf831eae0d&language=ru')
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then(function (output) {
            let inner = '<h4 class="col-12 text-center text-info">Тренды недели</h4>';
            if (output.results.length === 0) {
                inner += '<h2 class="col-12 text-center text-info">Ничего не найдено</h2> ';
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let mediaType = item.title ? 'movie' : 'tv'; //Некий костыль
                let picPath = item.poster_path; //urlPoster + picPath
                const poster = picPath ? urlPoster + picPath : './img/no-poster.jpg';

                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;

                inner += `
<div class="col-12 col-md-4 col-xl-3 text-center item">
    <img src= "${poster}" alt="${nameItem}" ${dataInfo} class="mw-100 poster">
    <h5>${nameItem}</h5>
</div>`;
            });
            movie.innerHTML = inner;

            addEveneMedia();
        })
        .catch(function (reason) {
            movie.innerHTML = '<h2 class="col-12 text-center text-danger">Ой, что-то пошло не так :(</h2>';
            console.error('error: ' + reason);
        });
});