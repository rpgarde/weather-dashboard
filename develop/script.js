// define variables 
let today = moment()
let currentCity = 'Sydney'
let cityEl = $('#city');
let todayEl = $('#date');
let cardsEl = $('#cards-here');
let iconEl = $('#icon');
let tempEl = $('#temp-today');
let windEl = $('#wind-today');
let humidEl = $('#humidity-today');
let uvEl = $('#uv-today');
let cityArr = [];

function init (){
    todayEl.text(today.format("DD-MMM-YYYY"));
    buildBody();
}

// pull from local storage OR use current city

// builds cards
function buildCards(dataOc){
    // for loop to build card elemnts 5 times
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
        cardMinTemp.text("Min Temp: "+Math.round(dataOc.daily[i].temp.min)+'°C')
        cardBody.append(cardMinTemp)
        let cardMaxTemp = $('<div>')
        cardMaxTemp.addClass('card-text')
        cardMaxTemp.text("Max Temp: "+Math.round(dataOc.daily[i].temp.max)+'°C')
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
        // adds successful search into array for later storage if it is not already there
        if(!cityArr.includes(data.name)){
            cityArr.push(data.name);
            }
        cityEl.text(data.name);
        iconEl.html('<img class="icon" src="https://openweathermap.org/img/wn/'+data.weather[0].icon+'@2x.png"></img>');
        tempEl.text(data.main.temp+'°C');
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
            buildCards(dataOc)
        })
    })
}

// function that changes currentCity, clears buildCards function, and reruns it. 
// function changeCity(){

// }





$("#submit").on("click", function (event) {
    event.preventDefault();
    cardsEl.empty();
    cityEl.text('');
    iconEl.html('');
    tempEl.text('');
    windEl.text('');
    humidEl.text('');
    console.log($('#input-city').val());
    currentCity = $('#input-city').val();
    buildBody();
    // index = $(this).parent().attr("index");
    // storedText = $(this).prev().val()
  
    // planTextArr[index] = storedText;
  
    // localStorage.setItem("storedPlans", JSON.stringify(planTextArr));
  
  })

init()

