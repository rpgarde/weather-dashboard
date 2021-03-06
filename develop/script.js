// define variables 
let today = moment()
let currentCity = "Sydney"
// if local storage has a stored city, use that instead of Sydney
if (localStorage.getItem("storedCurrentCity")){
    currentCity = localStorage.getItem("storedCurrentCity")
}
let cityEl = $('#city');
let todayEl = $('#date');
let cardsEl = $('#cards-here');
let iconEl = $('#icon');
let tempEl = $('#temp-today');
let windEl = $('#wind-today');
let humidEl = $('#humidity-today');
let uvEl = $('#uv-today');
let pastEl = $('#past-searches')
let pulledCities = JSON.parse(localStorage.getItem("storedCities"))
let cityArr = [];
// if there is anything in local storage, update values in cityArr to build the lefthand side
if (pulledCities !== null) {
     cityArr = pulledCities;
}

// init builds the body (right hand side) and list 
function init (){
    todayEl.text(today.format("DD-MMM-YYYY"));
    buildBody();
    buildList();
}

// builds past searches
function buildList(){
    for (i=0;i<cityArr.length;i++){
    let cityList = $('<li>')
    cityList.text(cityArr[i])
    cityList.addClass('list-group-item list-group-item-action')
    cityList.css("cursor","pointer")
    pastEl.append(cityList)
    }
}

// builds cards for 5 day forecast
function buildCards(dataOc){
    // for loop to build card elemnts 5 times, we start with 1 and array[0] represents today
    for(i=1;i<6;i++){
        // create card bootstrap component
        let card = $('<div>')
        card.addClass('card text-white bg-dark mb-3 px-0 col-8 col-lg-2')
        cardsEl.append(card)
        // add card header
        let cardHead = $('<div>')
        cardHead.addClass('card-header fw-bold text-center')
        let dateCard = moment(dataOc.daily[i].dt,"X").format("DD-MMM-YYYY")
        cardHead.text(dateCard)
        card.append(cardHead)
        // add card body
        let cardBody = $('<div>')
        cardBody.addClass('card-body')
        // add each datapoint and append to body
        let cardIcon = $('<div>')
        cardIcon.addClass('card-text text-center')
        cardIcon.html('<img class="icon" src="https://openweathermap.org/img/wn/'+dataOc.daily[i].weather[0].icon+'.png"></img>')
        cardBody.append(cardIcon)
        let cardMinTemp = $('<div>')
        cardMinTemp.addClass('card-text')
        cardMinTemp.text("Min Temp: "+Math.round(dataOc.daily[i].temp.min)+'??C')
        cardBody.append(cardMinTemp)
        let cardMaxTemp = $('<div>')
        cardMaxTemp.addClass('card-text')
        cardMaxTemp.text("Max Temp: "+Math.round(dataOc.daily[i].temp.max)+'??C')
        cardBody.append(cardMaxTemp)
        let cardWind = $('<div>')
        cardWind.addClass('card-text')
        cardWind.text("Wind: "+dataOc.daily[i].wind_speed+" kph")
        cardBody.append(cardWind)
        let cardHumid = $('<div>')
        cardHumid.addClass('card-text')
        cardHumid.text("Humidity: "+dataOc.daily[i].humidity+"%")
        cardBody.append(cardHumid)
        card.append(cardBody)
    }
}

// builds the single-day body
function buildBody(){
    let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+currentCity+'&appid=a2d6cfed0daac40477a3d34da9061d66&units=metric'
    fetch(apiUrl)
    .then(function (response){
        console.log(response)
        return response.json();
    })
    .then(function (data){
        console.log(data)
            if(data.name){
            // only clears info if data.name has a value
            clearInfo()
            // adds successful search into a current city local storage, so it can be preloaded later 
            localStorage.setItem("storedCurrentCity",data.name);
            // adds successful search into array for later storage, plus to the city lists if it is not already there
            if(!cityArr.includes(data.name)){
                cityArr.push(data.name);
                localStorage.setItem("storedCities",JSON.stringify(cityArr));
                let cityList = $('<li>');
                cityList.text(data.name);
                cityList.addClass('list-group-item');
                pastEl.append(cityList);
                }
            cityEl.text(data.name);
            iconEl.html('<img class="icon" src="https://openweathermap.org/img/wn/'+data.weather[0].icon+'@2x.png"></img>');
            tempEl.text(data.main.temp+'??C');
            windEl.text(data.wind.speed+' kph');
            humidEl.text(data.main.humidity+'%');
            // Get Lat/Long to use for onecall API - to get uv index + forecast
            let cityLon = data.coord.lon
            let cityLat = data.coord.lat 
            let apiUrlOc = 'https://api.openweathermap.org/data/2.5/onecall?lat='+cityLat+'&lon='+cityLon+'&exclude=minutely,hourly,alerts&units=metric&appid=a2d6cfed0daac40477a3d34da9061d66'

            fetch(apiUrlOc)
            .then(function (response){
                console.log(response)
                return response.json();
            })
            .then(function (dataOc){
                console.log(dataOc)
                uvEl.text(dataOc.daily[0].uvi)
                //adds a different class depending on UV severity. 0-2.99 = green, 3-5.99 = yellow, 6+ = red
                if(dataOc.daily[0].uvi>=6){
                    uvEl.addClass('badge bg-danger')
                }
                else if(dataOc.daily[0].uvi>=3){
                    uvEl.addClass('badge bg-warning')
                }
                else{
                    uvEl.addClass('badge bg-success')
                }
                buildCards(dataOc)
            })
        }
        else(
            alert("No city found. Please try again.")
        )
    })
}

// clears info
function clearInfo(){
    cardsEl.empty();
    cityEl.text('');
    iconEl.html('');
    tempEl.text('');
    windEl.text('');
    humidEl.text('');
}

// event delegation + event listener so that each of the past cities work
pastEl.on("click",'.list-group-item', function (event) {
    console.log("you clicked the LI")
    let btnClicked = $(event.target)
    clearInfo();
    currentCity = btnClicked.text();
    buildBody();
  })


$("#submit").on("click", function (event) {
    event.preventDefault();
    if($('#input-city').val()){
        console.log($('#input-city').val());
        currentCity = $('#input-city').val();
        buildBody();
    }
    else{
        console.log("It didn't work")
        alert('You did not add a city. Please try again.')
    }
  })

init()