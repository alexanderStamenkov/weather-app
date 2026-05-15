import { API_KEY } from "./config.js";

/* ── Init ─────────────────────────────────────────────────────── */
window.addEventListener("load", () => {
  getUserLocation();
});

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const cityInput = document.getElementById("city-input");

  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  });

  cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const city = cityInput.value.trim();
      if (city) getWeather(city);
    }
  });
});

/* ── Geolocation ─────────────────────────────────────────────── */
function getUserLocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    (err) => console.error("Геолокация недостъпна:", err),
  );
}

/* ── Theme switcher ──────────────────────────────────────────── */
const WEATHER_THEMES = [
  "clear",
  "clouds",
  "rain",
  "drizzle",
  "snow",
  "thunderstorm",
  "mist",
  "fog",
  "haze",
];

function setWeatherTheme(weatherMain) {
  WEATHER_THEMES.forEach((t) => document.body.classList.remove(`weather-${t}`));
  document.body.classList.add(`weather-${weatherMain.toLowerCase()}`);
}

/* ── Render ──────────────────────────────────────────────────── */
function renderWeather(data) {
  const card = document.querySelector(".weather-card");

  document.getElementById("city-name").innerText =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temperature").innerHTML =
    `${Math.round(data.main.temp)}<span class="unit">°C</span>`;

  document.getElementById("description").innerText =
    data.weather[0].description;

  document.getElementById("weather-icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("humidity").innerText = `${data.main.humidity}%`;

  document.getElementById("wind-speed").innerText =
    `${Math.round(data.wind.speed)} m/s`;

  document.getElementById("feels-like").innerText =
    `${Math.round(data.main.feels_like)}°C`;

  setWeatherTheme(data.weather[0].main);

  // Re-trigger animation on each update
  card.classList.remove("show", "error");
  void card.offsetWidth; // force reflow
  card.classList.add("show");
}

/* ── Fetch by city name ──────────────────────────────────────── */
async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=bg`,
    );
    if (!res.ok) throw new Error("Градът не е намерен");
    renderWeather(await res.json());
  } catch (err) {
    showError(err.message);
  }
}

/* ── Fetch by coordinates ────────────────────────────────────── */
async function getWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=bg`,
    );
    if (!res.ok) throw new Error("Грешка при заявката");
    renderWeather(await res.json());
  } catch (err) {
    console.error(err);
  }
}

/* ── Error display ───────────────────────────────────────────── */
function showError(message) {
  const card = document.querySelector(".weather-card");

  document.getElementById("city-name").innerText = "Грешка";
  document.getElementById("temperature").innerHTML =
    `--<span class="unit">°C</span>`;
  document.getElementById("description").innerText = message;
  document.getElementById("weather-icon").src = "";
  document.getElementById("humidity").innerText = "--";
  document.getElementById("wind-speed").innerText = "--";
  document.getElementById("feels-like").innerText = "--";

  card.classList.remove("show");
  void card.offsetWidth;
  card.classList.add("show", "error");
}
