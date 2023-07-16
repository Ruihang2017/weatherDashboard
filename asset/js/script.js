const appid = "0f6b26473e144361f9f4478387b457f2";

let searchForm = document.getElementById('searchForm');
let currentLocation = document.getElementById("currentLocation");
let currentDate = document.getElementById("currentDate");
let currentTemp = document.getElementById("currentTemp");
let currentWind = document.getElementById("currentWind");
let currentHumid = document.getElementById("currentHumid");
let forecastDays = document.getElementById("forecastDays");

let weatherData = {
    location: "location",
    currentWeather: {
        date: "date",
        icon: "icon",
        temp: "temp",
        wind: "wind",
        humid: "humid"
    },
    forecastWeather: []
};

// get the location based on the search input
const getWeatherAPIFromSearch = (searchData) => {
    const limit = 5;
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchData}&limit=${limit}&appid=${appid}`;
    fetch(url).then(response => {
        if (response.ok) {
            response.json().then(data => {
                getWeatherAPI(data[0].lat, data[0].lon);
            })
        } else {
            alert('Error: ', response.statusText);
        }
    }).catch(err => {
        alert(`Unable to connect: ${err}`)
    });
}

// add the event listener
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const input = searchForm.querySelector('input[type="search"]');
    const searchValue = input.value;

    getWeatherAPIFromSearch(searchValue);
});


// get weather data based on the search coordinate
const getWeatherAPI = (lat, lon) => {

    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${appid}`;
    const forecastNum = 5;

    fetch(url)
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    const currentDate = new Date();
                    weatherData.location = data.city.name;
                    weatherData.currentWeather.date = `(${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()})`;
                    console.log(weatherData.currentWeather.date);
                    weatherData.currentWeather.temp = `Temp: ${Math.floor(data.list[0].main.temp - 273.15)} &#8451;`;
                    weatherData.currentWeather.wind = `Wind: ${data.list[0].wind.speed} m/s;`;
                    weatherData.currentWeather.humid = `Humidity: ${data.list[0].main.humidity} %;`;

                    console.log(data);

                    data.list.forEach(element => {
                        let date = new Date(element.dt * 1000)
                        let dateString = `${date.getDate()} - ${date.getMonth()}`;
                        console.log(dateString);

                        // push the forecast data into the array
                        if (currentDate.getDate() !== date.getDate()) {

                            let overlap = weatherData.forecastWeather.some(forecast => {
                                return forecast.date === dateString;
                            })
                            if (!overlap) {
                                let forecast = {
                                    date: dateString,
                                    icon: "icon",
                                    temp: `Temp: ${Math.floor(element.main.temp - 273.15)} &#8451;`,
                                    wind: `Wind: ${element.wind.speed} m/s;`,
                                    humid: `Humidity: ${element.main.humidity} %;`
                                }
                                weatherData.forecastWeather.push(forecast);
                            }
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


// display weather data
const displayWeatherAPIData = () => {
    currentLocation.innerHTML = weatherData.location;
    currentDate.innerHTML = weatherData.currentWeather.date;
    currentTemp.innerHTML = weatherData.currentWeather.temp;
    currentWind.innerHTML = weatherData.currentWeather.wind;
    currentHumid.innerHTML = weatherData.currentWeather.humid;
    forecastDays.innerHTML = [];
    weatherData.forecastWeather.forEach(forecast => {
        forecastDays.innerHTML += `
            <div class="col-sm-4 col-md-3 col-lg-2">
            <h4>${forecast.date}</h4>
            <i class="bi bi-brightness-high text-warning"></i>
            <div>${forecast.temp}</div>
            <div>${forecast.wind}</div>
            <div>${forecast.humid}</div>
            </div>`;
    })
}


// getWeatherAPI();
getWeatherAPIFromSearch("Sydney");
