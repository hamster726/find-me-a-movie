const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');


function apiSearch(event) {

    event.preventDefault();                                     //не обновлять страницу при нажатии энтер в строке
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=6aab1502d97ac3acab566ecf831eae0d&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка';

    requestApi('GET', server)
        .then(function (result) {
            const output = JSON.parse(result);
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
                         <td>Жанр : ${genre}</td>
                     </tr>
                     <tr>
                          <td><img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/${picPath}" width="300px"></td>
                          <td>${description}</td>
                     </tr>
                     <tr>
                          <td>Рейтинг: ${vote} из 10</td>
                     </tr>
                 </tbody>
             </table>`;
                // inner += `<div class ='col-12 font-weight-mono'>Дата выхода: ${releaseDate}</div>`;
            });

            movie.innerHTML = inner;
        })
        .catch(function (reason) {
            movie.innerHTML = 'Ой, что-то пошло не так :('
            console.log('error' + reason.status);
        })
}

searchForm.addEventListener('submit', apiSearch);


function requestApi(method, url) {                              // запрос на сервер
    return new Promise(function (resolve, reject) { // Promis возвращается когда ответит сервер. Остальной код дальше работает
        const request = new XMLHttpRequest();
        request.open(method, url);
        request.addEventListener("load", function () {
            if (request.status !== 200){
                reject({status: request.status});
                return;
            }
            resolve(request.response);
        });
        request.addEventListener("error", function () {
            reject({status: request.status});
        });
        request.send();
    });
}


    // request.addEventListener('readystatechange', function () {
    //     if (request.readyState !== 4){
    //         movie.innerHTML = 'Загрузка';
    //         return;}
    //
    //
    //     if (request.status !== 200) {
    //         movie.innerHTML = 'Ой, что-то пошло не так :(';
    //         console.log('error: ' + request.status);
    //         return;
    //     }
    //
    //     const output = JSON.parse(request.responseText);
    //
    //     let inner = '';
    //
    //
    //     output.results.forEach(function (item) {
    //         console.log(item);
    //         let nameItem = item.name || item.title;
    //         let releaseDate = item.first_air_date || item.release_date;
    //         let picPath = item.poster_path;
    //         let genre = item.media_type;
    //         let description = item.overview;
    //         let vote = item.vote_average;
    //
    //         inner += `<h4 class='text-uppercase h4 mx-auto'>${nameItem}</h4>`;
    //         inner += `
    //          <table class="table table-borderless">
    //              <tbody>
    //                  <tr>
    //                      <td>Дата выхода: ${releaseDate}</td>
    //
    //                  </tr>
    //                  <tr>
    //                      <td>Жанр : ${genre}</td>
    //                  </tr>
    //                  <tr>
    //                       <td><img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/${picPath}" width="300px"></td>
    //                       <td>${description}</td>
    //                  </tr>
    //                  <tr>
    //                       <td>Рейтинг: ${vote} из 10</td>
    //                  </tr>
    //              </tbody>
    //          </table>`;
    //         // inner += `<div class ='col-12 font-weight-mono'>Дата выхода: ${releaseDate}</div>`;
    //     });
    //
    //     movie.innerHTML = inner;
    //
    // });