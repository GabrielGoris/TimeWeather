const key = config.OPENWEATHERMAP_API_KEY;
const googleApiKey = config.GOOGLE_API_KEY;


let intervalId;

function showData(data){
    document.querySelector(".city").innerHTML = "Tempo em " + data.name
    document.querySelector(".temperature").innerHTML = Math.floor(data.main.temp) +"°C"
    document.querySelector(".time-info").innerHTML = data.weather[0].description
    document.querySelector(".moisture").innerHTML = "Umidade " + data.main.humidity + "%"
    document.querySelector(".img-time").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
}

async function searchCity(city){

    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`).then(response => response.json())
    showData(data)
}

async function getCoordinates(city) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${googleApiKey}`);
    const data = await response.json();
    (data.results.length > 0) 
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
}

async function getTimezone(city) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${googleApiKey}`);
    const data = await response.json();
    const { lat, lng } = data.results[0].geometry.location;
    const timezoneResponse = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${googleApiKey}`);
    const timezoneData = await timezoneResponse.json();
    return timezoneData;
}

async function showHour(city) {
    const timezoneData = await getTimezone(city);
    const { timeZoneId } = timezoneData;
    const timeElement = document.querySelector(".time");
    
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        const formattedTime = new Date().toLocaleTimeString('pt-BR', { timeZone: timeZoneId });
        timeElement.innerHTML = `Horário local em ${city}: ${formattedTime}`;
    }, 1000); // Atualiza a cada segundo
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".input-city").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            clickOnButton();
        }
    });
});

function clickOnButton() {
    const city = document.querySelector(".input-city").value
    
    searchCity(city)
    showHour(city)
}

