// Access all necessay HTML elements

const form = document.querySelector(".search-form");
const input = document.querySelector(".search-input");
const api_key = "66069e1d1c76bc2a9f211029b1cadc13";
const currTemp = document.querySelector("#curr-temp");
const description = document.querySelector(".description");
const currWeatherImg = document.querySelector(".weather-icon");
const weatherList = document.querySelector(".weather-list");

// Show initially loading
currTemp.textContent = "Loading...";
description.textContent = "";
weatherList.innerHTML = "";

// fetch data when form is submitted
form.addEventListener("submit", async (evt) => {
  evt.preventDefault(); // to prevent page reload
  const city = input.value.trim();
  await fetchDataByCity(city); // call function to fetch data
});

// Get location when click on location button
document.querySelector(".location-button").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    await fetchDataByLoc(lat, long); // fetch data based on location
  });
});

// Function to fetch data by city
async function fetchDataByCity(city) {
  if (!city) return;
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
  );
  let data = await res.json();
  if (data.cod !== 200) {
    currWeatherImg.setAttribute("src", "images/no-result.svg");
    currTemp.textContent = "Something went wrong";
    description.textContent = "Enter valid city name";
    weatherList.textContent = "";
    return;
  }
  showCurrData(data);
  await fetchHourlydataByCity(city);
}

// Function to fetch hourly data by city
async function fetchHourlydataByCity(city) {
  weatherList.innerHTML = "";
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`
  );
  let data = await res.json();
  showHourlyData(data);
}

// Function to fetch data by location
async function fetchDataByLoc(lat, long) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}&units=metric`
  );
  const data = await res.json();
  input.value = data.name;
  await showCurrData(data);

  await fetchHourlyDataByLoc(lat, long);
}

// Function to fetch hourly data by location
async function fetchHourlyDataByLoc(lat, long) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${api_key}&units=metric`
  );
  let data = await res.json();
  showHourlyData(data);
}

// Function to show current data
function showCurrData(data) {
  // Show current temprature
  currTemp.textContent = `${data.main.temp} °C`;

  // Show current weather icon
  const icon = data.weather[0].icon;
  currWeatherImg.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  // Show weather descreption
  description.textContent = data.weather[0].description;
}

// Function to show hourly data
function showHourlyData(data) {
  let hourlyData = data.list;

  const now = new Date();
  const filteredData = hourlyData.filter((val) => {
    return new Date(val.dt_txt) >= now;
  });

  // Show 24 hour data
  filteredData.slice(0, 8).forEach((val) => {
    const li = document.createElement("li");
    li.classList.add("weather-item");

    const p = document.createElement("p");
    p.classList.add("time");
    const time = new Date(val.dt_txt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    p.textContent = time;

    const img = document.createElement("img");
    const icon = val.weather[0].icon;
    img.classList.add("weather-icon");
    img.setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);

    const temp = document.createElement("p");
    temp.classList.add("temperature");
    temp.textContent = `${val.main.temp} °C`;

    li.append(p, img, temp);
    weatherList.append(li);
  });
}

// Initially shows data of Nadiad city
fetchDataByCity("Nadiad");
