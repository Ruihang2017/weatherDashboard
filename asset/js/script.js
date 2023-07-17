const appid = "0f6b26473e144361f9f4478387b457f2";

let searchForm = document.getElementById('searchForm');
let currentLocation = document.getElementById("currentLocation");
let currentDate = document.getElementById("currentDate");
let currentTemp = document.getElementById("currentTemp");
let currentWind = document.getElementById("currentWind");
let currentHumid = document.getElementById("currentHumid");
let forecastDays = document.getElementById("forecastDays");
let currentIcon = document.getElementById("currentIcon");
let btnGroup = document.getElementById("btnGroup");

// let searchHistory = [];

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

    // on clear
    // clear the button list and the searchHistory inside localstorage 
    if (event.submitter.getAttribute("type") === "clear") {
        // searchHistory = [];
        // localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        // loadSearchHistory();
        clearSearchHistory();
        return;
    }

    // on search
    // fire the weather api search function
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
                    // console.log(weatherData.currentWeather.date);
                    weatherData.currentWeather.temp = `Temp: ${Math.floor(data.list[0].main.temp - 273.15)} &#8451;`;
                    weatherData.currentWeather.wind = `Wind: ${data.list[0].wind.speed} m/s;`;
                    weatherData.currentWeather.humid = `Humidity: ${data.list[0].main.humidity} %;`;
                    weatherData.currentWeather.icon = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;

                    // console.log(data);
                    // console.log(data.list[0].weather[0].icon);
                    data.list.forEach(element => {
                        let date = new Date(element.dt * 1000)
                        let dateString = `${date.getDate()} - ${date.getMonth()}`;

                        // push the forecast data into the array
                        if (currentDate.getDate() !== date.getDate()) {

                            let overlap = weatherData.forecastWeather.some(forecast => {
                                return forecast.date === dateString;
                            })
                            if (!overlap) {
                                let forecast = {
                                    date: dateString,
                                    icon: `http://openweathermap.org/img/wn/${element.weather[0].icon}.png`,
                                    temp: `Temp: ${Math.floor(element.main.temp - 273.15)} &#8451;`,
                                    wind: `Wind: ${element.wind.speed} m/s;`,
                                    humid: `Humidity: ${element.main.humidity} %;`
                                }
                                weatherData.forecastWeather.push(forecast);
                            }
                        }

                    });
                    // console.log(searchHistory);

                    // searchHistory.push(weatherData);
                    addSearchHistory(weatherData);
                    // console.log(searchHistory);

                    // localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

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
    currentIcon.setAttribute("src", weatherData.currentWeather.icon);
    forecastDays.innerHTML = [];

    weatherData.forecastWeather.forEach(forecast => {
        forecastDays.innerHTML += `
            <div class="col-sm-4 col-md-3 col-lg-2">
            <h4>${forecast.date}</h4>
            <img src="${forecast.icon}" alt="Weather Icon">
            <div>${forecast.temp}</div>
            <div>${forecast.wind}</div>
            <div>${forecast.humid}</div>
            </div>`;
    })

    loadSearchHistory();
}


const loadSearchHistory = () => {
    btnGroup.innerHTML = "";
    let searchHistory = localStorage.getItem("searchHistory");
    if (!searchHistory) {
        searchHistory = [];
    }
    searchHistory = JSON.parse(searchHistory);
    searchHistory.forEach(data => {
        btnGroup.innerHTML += `<button type="button" class="btn btn-primary">${data.location}</button>`
    });
}

const addSearchHistory = (data) => {
    let searchHistory = localStorage.getItem("searchHistory");
    if (!searchHistory) {
        searchHistory = [];
    }
    searchHistory = JSON.parse(searchHistory);

    // avoid repeat destination data in the localStorage
    let isDuplicate = searchHistory.some((history) => {
        return history.location === data.location;
    });
    if (isDuplicate) {
        return;
    }

    // add new data to the searchHistory 
    searchHistory.push(data);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    loadSearchHistory();
}

const clearSearchHistory = () => {
    let searchHistory = [];
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    loadSearchHistory();
}


//---------------- init -----------------
let siteLocation = "";
const init = () => {

    // // get the local search history
    // searchHistory = localStorage.getItem("searchHistory");

    // if (!searchHistory) {
    //     searchHistory = [];
    // } else {
    //     searchHistory = JSON.parse(searchHistory);
    //     loadSearchHistory();

    // }

    // getWeatherAPI();
    getWeatherAPIFromSearch("Sydney");

}


init();
