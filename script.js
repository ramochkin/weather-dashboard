var key = "03dda441b63ee2e43cb008498228f9ce";
var searchForm = document.getElementById("searchForm");
var currentWeatherContainer = document.getElementById('currentWeather')
var weatherCardsContainer = document.getElementById('weatherCards')
var sideBar = document.getElementById('sideBar')

// step 1. user types in a city, they hit search and it fetches the API data.
function searchForCity(event) {
    event.preventDefault()
    var userInput = document.querySelector('.form-input').value;
    // console.log(userInput)

    
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + userInput + '&appid=' + key).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data)
        var latLon = data.coord
        var cityName = data.name
        // console.log(latLon)
        getWeather(latLon, cityName)
    })
}

function storeCities(event) {
    var userInput = document.querySelector('.form-input').value;
    
    var userCities = JSON.parse(localStorage.getItem('city')) || []

    userCities.push(userInput)

    localStorage.setItem('city', JSON.stringify(userCities));

    var btnDiv = document.createElement('div')
    btnDiv.setAttribute('id', 'btnContainer')
    sideBar.appendChild(btnDiv)

    //btnDiv.innerHTML = '';

    for (let index = 0; index < userCities.length; index++) {

        btnDiv.innerHTML = '';

        var cityBtn = document.createElement('button')
        var cityBtnContent = userCities[index]
        cityBtn.textContent = cityBtnContent
        btnDiv.append(cityBtn)
        
    }
    
    sideBar.append(cityBtn)

    

    


}

function getWeather(coord, cityName) {

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + coord.lat + '&lon=' + coord.lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + key).then(function (finalResponse) {
        return finalResponse.json();
    }).then(function (veryFinalResponse) {
        console.log(veryFinalResponse)
        renderCurrentWeather(veryFinalResponse.current, cityName)
        renderFiveDay(veryFinalResponse.daily)
    })
}

function renderCurrentWeather(currentWeather, city) {


    // console.log(currentWeather)
    // console.log(city);
    var newh1 = document.createElement('h3');
    var newh1Content = document.createTextNode(city);
    newh1.appendChild(newh1Content)
    // document.getElementById("currentWeather").appendChild(newh1)

    var newp = document.createElement("p")
    var newpContent = document.createTextNode("Temp: " + currentWeather.temp + " °F");
    newp.appendChild(newpContent)
    // document.getElementById("currentWeather").appendChild(newp)

    var newWindP = document.createElement("p")
    var newWindPContent = document.createTextNode("Wind: " + currentWeather.wind_speed + " MPH");
    newWindP.appendChild(newWindPContent)
    // document.getElementById("currentWeather").appendChild(newWindP)

    var newHumidityP = document.createElement("p")
    var newHumidityPContent = document.createTextNode("Humidity: " + currentWeather.humidity + " %");
    newHumidityP.appendChild(newHumidityPContent)
    // document.getElementById("currentWeather").appendChild(newHumidityP)

    var newUVP = document.createElement("p")
    var newUVPContent = document.createTextNode("UV Index: " + currentWeather.uvi);
    newUVP.appendChild(newUVPContent)

    currentWeatherContainer.innerHTML = "";

    currentWeatherContainer.append(newh1, newp, newWindP, newHumidityP, newUVP)



}

function renderFiveDay(forcast) {
    console.log(forcast)
    var titleDiv = document.createElement('div')
    var newTitile = document.createElement("h3")
    titleDiv.setAttribute('class', 'col-md-12')
    newTitile.textContent = '5-Day Forecast:'
    titleDiv.append(newTitile)
    weatherCardsContainer.appendChild(titleDiv)

    weatherCardsContainer.textContent = ''

    for (let index = 1; index < 6; index++) {
        let unix_timestamp = forcast[index].dt;
        var a = new Date(unix_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = month + ' ' + date + ' ' + year;

        console.log(time)

        // create a card with an h4 heading, followed by an icon, followed by p tags including temp wind and humidity

        var cardDiv = document.createElement('div')
        var cardBody = document.createElement('div')
        var date = document.createElement('h4')
        var icon = document.createElement('img')
        var tempPTag = document.createElement('p')
        var windPTag = document.createElement('p')
        var humidityPTag = document.createElement('p')

        var iconValue = forcast[index].weather[0].icon

        cardDiv.setAttribute('class', 'card')
        cardBody.setAttribute('class', 'card-body')
        date.setAttribute('class', 'card-title')
        icon.setAttribute('src', './openweathermap-api-icons/icons/' + iconValue + '.png')
        tempPTag.setAttribute('class', 'card-text')
        windPTag.setAttribute('class', 'card-text')
        humidityPTag.setAttribute('class', 'card-text')

        date.textContent = time
        tempPTag.textContent = "Temp: " + forcast[index].temp.max + " °F"
        windPTag.textContent = "Wind: " + forcast[index].wind_speed + " MPH"
        humidityPTag.textContent = "Humidity: " + forcast[index].humidity

        

        cardBody.append(date,icon,tempPTag,windPTag,humidityPTag)
        cardDiv.append(cardBody)
        weatherCardsContainer.append(cardDiv)

        // console.log(iconValue);



        // weatherCardsContainer.append(date)
    }
}



searchForm.addEventListener("submit", searchForCity)
searchForm.addEventListener("submit", storeCities)