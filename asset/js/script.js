const appid = "0f6b26473e144361f9f4478387b457f2";


let currentLocation = document.getElementById("currentLocation");
let currentTemp = document.getElementById("currentTemp");
let currentWind = document.getElementById("currentWind");
let currentHumid = document.getElementById("currentHumid");

let forecastDays = document.getElementById("forecastDays");


// let lat = 44.34;
// let lon = 10.99;
// let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}`;

let weatherData = {
    location: "location",
    currentWeather: {
        temp: "temp",
        wind: "wind",
        humid: "humid"
    },
    forecastWeather: []
};


// get the image urls and load to the carousel using unsplash API
const getWeatherAPI = () => {
    // let apiUrl = `https://api.unsplash.com/search/photos/?page=${page}&per_page=${per_page}&query=${destination}&client_id=${client_id}`;
    // let slides = document.getElementsByClassName('carousel-cell');
    // let titles = document.getElementsByClassName('title');

    let lat = 44.34;
    let lon = 10.99;
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}`;
    const forecastNum = 5;

    fetch(url)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    weatherData.location = data.city.name;
                    weatherData.currentWeather.temp = `Temp: ${data.list[0].main.temp} &#8451;`;
                    weatherData.currentWeather.wind = `Wind: ${data.list[0].wind.speed} mph;`;
                    weatherData.currentWeather.humid = `Humidity: ${data.list[0].main.humidity} %;`;

                    console.log(data);
                    const currentDate = new Date();

                    data.list.forEach(element => {
                        let date = new Date(element.dt * 1000)
                        let dateString = `${date.getDate()} - ${date.getMonth()}`;
                        console.log(dateString);

                        if (currentDate.getDate() !== date.getDate()) {

                            let forecast = {
                                date: dateString,
                                temp: `Temp: ${element.main.temp} &#8451;`,
                                wind: `Wind: ${element.wind.speed} mph;`,
                                humid: `Humidity: ${element.main.humidity} %;`
                            }
                            weatherData.forecastWeather.push(forecast);
                        }

                    });
                    console.log(weatherData);
                    displayWeatherAPIData();
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect');
        });
};

const displayWeatherAPIData = () => {
    currentLocation.innerHTML = weatherData.location;
    currentTemp.innerHTML = weatherData.currentWeather.temp;
    currentWind.innerHTML = weatherData.currentWeather.wind;
    currentHumid.innerHTML = weatherData.currentWeather.humid;

    weatherData.forecastWeather.forEach(forecast => {
        forecastDays.innerHTML += `
            <div class="col-sm-4 col-md-3 col-lg-2">
            <h4>${forecast.date}</h4>
            <i class="bi bi-brightness-high text-warning"></i>
            <div>Temp</div>
            <div>Wind</div>
            <div>Humidity</div>
            </div>`;
    })
}

getWeatherAPI();

