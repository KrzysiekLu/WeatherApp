import Swiper from "https://unpkg.com/swiper@8/swiper-bundle.esm.browser.min.js";

class App {
  mounths = [
    "January ",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  days = ["Mon.", "Tu.", "Wed.", "Thu.", "Fri", "Sat", "Sun."];

  key = "f8d0779a0fd8a627c49b8be4881c5107";
  city = document.querySelector(".app_location_city");
  tempPlace = document.querySelector(".app_weather-now_temp");
  weatherImg = document.querySelector(".app_weather-now_icon");
  detailsFeelsLike = document.querySelector(
    ".app_weather-now_details_feels_like"
  );
  detailsWind = document.querySelector(".app_weather-now_details_wind");
  detailsPresure = document.querySelector(".app_weather-now_details_pressure");
  date = document.querySelector(".app_date");
  swiperWrapper = document.querySelector(".swiper-wrapper");
  dailyWeather = document.querySelector(".app_weather_daily");

  constructor() {
    navigator.geolocation.getCurrentPosition(
      this.success.bind(this),
      this.error
    );
  }
  success(data) {
    const lat = data.coords.latitude;
    const lon = data.coords.longitude;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude="daily"&appid=${this.key}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        this._setTemp(Math.round(data.current.temp));
        this._setDate();
        this._setImage(this.weatherImg, data.current.weather[0].icon);
        this._setCity(lat, lon);
        this._weatherPerHour(data);
        this._weatherPerDay(data);
        this._currentWeatherDetails(data);

        console.log(data);
      });
  }

  error(error) {
    console.log(error);
  }
  _setCity(lat, lon) {
    fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${this.key}`
    )
      .then((resp) => resp.json())
      .then((data) => (this.city.textContent = `${data[0].name}`));
    console.log();
  }
  _setTemp(temp) {
    this.tempPlace.textContent = temp;
  }
  _setImage(imgElement, weatherCode) {
    imgElement.src = `https://openweathermap.org/img/wn/${weatherCode}@2x.png`;
  }
  _setDate() {
    const date = new Date();
    const dayStr = date.getDay();
    const dayNum = date.getUTCDate();
    const mounth = date.getUTCMonth();
    const year = date.getUTCFullYear();
    console.log(dayStr);

    this.date.textContent = `${this.days[dayStr]} ${dayNum} ${
      this.mounths[mounth + 1]
    } ${year}`;
  }
  _weatherPerHour(data) {
    data.hourly.slice(0, 24).forEach((hourData, index) => {
      const time = data.hourly[index].dt * 1000;
      const timeConvert = new Date(time).getHours();
      const temp = data.hourly[index].temp;
      const iconCode = data.hourly[index].weather[0].icon;

      let hour = 0;
      if (timeConvert < 10) {
        hour = `0${timeConvert}:00`;
      } else {
        hour = `${timeConvert}:00`;
      }

      const hourBox = `<div class="swiper-slide" data-index = '1'>
      <div class="swiper-slide-hour">${hour}</div>
      <img class="swiper-slide-icon" src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="">
      <div class="swiper-slide-temp">${Math.round(
        temp
      )}<img class="swiper-slide-unit-icon" src="assets/celsius.png" alt="celcius"></div>
    </div>`;
      this.swiperWrapper.insertAdjacentHTML("beforeend", hourBox);
    });
  }
  _weatherPerDay(data) {
    data.daily.forEach((el) => {
      const dayName = new Date(el.dt * 1000).getDay();
      const iconCode = el.weather[0].icon;
      const tempMax = Math.round(el.temp.max);
      const tempMin = Math.round(el.temp.min);
      const html = `<div class="app_weather_daily_day">
      <div class="app_weather_daily_day_name">${this.days[dayName]}</div>
      <img class="app_weather_daily_day_weather-icon" src="https://openweathermap.org/img/wn/${iconCode}@2x.png"></img>
      <div class="app_weather_daily_day_temp">
      <div class="app_weather_daily_day_temp_max">${tempMax}/</div>
      <div class="app_weather_daily_day_temp_min">${tempMin}</div>
      </div>
      <div class="app_weather_daily_day_pop"></div>
    </div>`;
      this.dailyWeather.insertAdjacentHTML("beforeend", html);
    });
  }
  _currentWeatherDetails(data) {
    this.detailsFeelsLike.textContent = `Feals-like: ${Math.round(
      data.current.feels_like
    )} C`;
    this.detailsPresure.textContent = `Preasure: ${data.current.pressure} hPa`;
    this.detailsWind.textContent = `Wind: ${data.current.wind_speed} m/s`;
  }
}

const app = new App();

const swiper = new Swiper(".swiper", {
  slidesPerView: 6,
  spaceBetween: 3,
  freeMode: {
    enabled: true,
    sticky: true,
  },
  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
  },

  controller: {
    inverse: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  grid: {
    fill: "column",
    rows: 1,
  },
});

const x = new Date(1652695200);
console.log(x.getDay());
