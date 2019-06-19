const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');


function apiSearch(event) {

    event.preventDefault();                                     //не обновлять страницу при нажатии энтер в строке
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=6aab1502d97ac3acab566ecf831eae0d&language=ru&query=' + searchText;
    const urlPoster = 'https://image.tmdb.org/t/p/original';
    movie.innerHTML = 'Загрузка';

    fetch(server)
        .then(function (value) {
            if (value.status !== 200){
                return Promise.reject(value);
            }
           return value.json();
        })
        .then(function (output) {
            let inner = '';

            output.results.forEach(function (item) {
                //console.log(item);
                let nameItem = item.name || item.title;
                let releaseDate = item.first_air_date || item.release_date;
                let picPath = item.poster_path;
                let genre = item.media_type;
                let description = item.overview;
                let vote = item.vote_average;

                inner += `<h4 class='text-uppercase h4 mx-auto'>${nameItem}</h4>`;
                inner += `
             <table class="table table-borderless">
                 <tbody>
                     <tr>
                         <td>Дата выхода: ${releaseDate}</td>

                     </tr>
                     <tr>
                         <td>Жанр: ${genre}</td>
                     </tr>
                     <tr>
                          <td><img src="${urlPoster  + picPath}" width="300px"></td>
                          <td class="align-middle">${description}</td>
                     </tr>
                     <tr>
                          <td>Рейтинг: ${vote} из 10</td>
                     </tr>
                 </tbody>
             </table>`;
            });

            movie.innerHTML = inner;
        })
        .catch(function (reason) {
            movie.innerHTML = 'Ой, что-то пошло не так :('
            console.error('error: ' + reason);
        });
}

searchForm.addEventListener('submit', apiSearch);
