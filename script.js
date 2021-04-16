const cityForm = document.querySelector("form");
const card = document.querySelector(".card");
const details = document.querySelector(".details");
const time = document.querySelector("img.time");
const icon = document.querySelector(".icon img");

const updateUI = (data) => {
  // destructure properties
  const { cityDets, weather } = data;

  // update details template
  details.innerHTML = 
  `
    <h5 class="my-3">${cityDets.EnglishName}</h5>
    <div class="my-3">${weather.WeatherText}</div>
    <div class="display-4 my-4">
      <span>${weather.Temperature.Metric.Value}</span>
      <span>&deg;C</span>
    </div>
  `;

//update icons
const iconSrc = `img/icons/${weather.WeatherIcon}.svg`
icon.setAttribute("src", iconSrc);

//update image
let timeSrc = weather.IsDayTime ? "./img/fireday.gif" : "./img/firenight.gif"; ;

time.setAttribute('src',timeSrc);

//
if(card.classList.contains('d-none')){
  card.classList.remove('d-none');
}
 
};

const updateCity = async (city) => {
  const cityDets = await getCity(city);
  const weather = await getWeather(cityDets.Key);
  //destructered
  return { cityDets, weather };
};

cityForm.addEventListener("submit", (e) => {
  // prevent default action
  e.preventDefault();

  // get city value
  const city = cityForm.city.value.trim();
  cityForm.reset();

  // update the ui with new city
  updateCity(city)
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));

  //local storage
  localStorage.setItem("city", city);
});


//forecast api
const key = "RpEuZh5DzEaXzvJAVflQaZyyARww0NwG";

// get weather information
const getWeather = async (id) => {
  const base =
    "https://dataservice.accuweather.com/currentconditions/v1/";
  const query = `${id}?apikey=${key}`;

  const response = await fetch(base + query);
  const data = await response.json();

  return data[0];
};

// get city information
const getCity = async (city) => {
  const base =
    "https://dataservice.accuweather.com/locations/v1/cities/search";
  const query = `?apikey=${key}&q=${city}`;

  const response = await fetch(base + query);
  const data = await response.json();

  return data[0];
};
// getcity('delhi')
//     .then(data =>{return getWeather(data.Key);}).then(data =>{console.log(data);})
//     .catch(err=>console.log(err));


if (localStorage.getItem("city")) {
  updateCity(localStorage.getItem("city"))
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
}


 