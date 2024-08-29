const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");
const userContainer = document.querySelector(".weather-container");
const grantAccess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");
const userInfo = document.querySelector(".user-info-container");
const errormsg = document.querySelector("[data-errormsg]");
const grantAccessbtn = document.querySelector("[data-grantAccess]");
const API_KEY = "654cd30093114506d6cad5e660d77dd1"; 
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfo.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //mai pehle search vale tab pr tha or ab your weather tab visible krna h
            searchForm.classList.remove("active");
            userInfo.classList.remove("active");
            // ab mjhe local storage check krni h pehle
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', ()=>{
    switchTab(userTab);
})
searchTab.addEventListener('click', ()=>{
    switchTab(searchTab);
})

//check if coordinates is already present in local storage.
function getfromSessionStorage(){
    const localcoors = sessionStorage.getItem("user-coordinates");
    if(!localcoors){
        // agr nahi mile
        grantAccess.classList.add("active");
    }
    else{
        // agr local coordinates pade hai to ye kro
        const coordinates = JSON.parse(localcoors);
        fetchuserWeatherInfo(coordinates);
    }
}

async function fetchuserWeatherInfo(coordinates){
    const {lat, long} = coordinates;
    // make grant container invisible
    grantAccess.classList.remove("active");
    userInfo.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
        errormsg.classList.add("active");
        loadingScreen.classList.remove("active");
        userInfo.classList.remove("active");
    }
}

function renderWeatherInfo(data){
    if(data?.message === "city not found"){
        loadingScreen.classList.remove("active");
        userInfo.classList.remove("active");
        errormsg.classList.add("active");
        
    }
    else{
        loadingScreen.classList.remove("active");
        errormsg.classList.remove("active");
        const cityname = document.querySelector("[data-cityname]");
        const countryicon = document.querySelector("[data-countryicon]");
        const desc = document.querySelector("[data-weatherdescription]");
        const weathericon = document.querySelector("[data-weathericon]");
        const temp = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudyness = document.querySelector("[data-cloudyness]");
        
        //fetch values from weather info object and put in UI Elements
        cityname.innerText = data?.name;
        countryicon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
        desc.innerText = data?.weather?.[0]?.description;
        weathericon.src = `https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`
        temp.innerText = `${data?.main?.temp} °C`;
        windspeed.innerText = `${data?.wind?.speed}m/s`;
        humidity.innerText = `${data?.main?.humidity}%`;
        cloudyness.innerText = `${data?.clouds?.all}%`;
    }
}

grantAccessbtn.addEventListener('click', getLocation)

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        window.alert("No Geolocation Support Available");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchuserWeatherInfo(userCoordinates);
}

let searchinput = document.querySelector("[data-searchinput]");
searchForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    if(searchinput.value === "") return ;
    errormsg.classList.remove("active");
    fetchSearchWeatherInfo(searchinput.value);
    
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfo.classList.remove("active");
    grantAccess.classList.remove("active");
    searchinput.value = "";
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        const data = await res.json();
        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
        loadingScreen.classList.remove("active");
        userInfo.classList.remove("active");
        errormsg.classList.add("active");
    }
}



