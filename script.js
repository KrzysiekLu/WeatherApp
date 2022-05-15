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

  key = "2ba13641637744eba712b6cb02fae64a";
  city = document.querySelector(".app_location_city");
  tempPlace = document.querySelector(".app_weather-now_temp");
  weatherImg = document.querySelector(".app_weather-now_icon");
  date = document.querySelector(".app_date");
  swiperWrapper = document.querySelector(".swiper-wrapper");

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
        console.log(hour);
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
}

const app = new App();

const swiper = new Swiper(".swiper", {
  slidesPerView: 5,
  spaceBetween: 3,
  freeMode: {
    enabled: true,
    sticky: true,
  },

  controller: {
    inverse: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  hiddenClass: "swiper-button-hidden",
  grid: {
    fill: "column",
    rows: 1,
  },
});

fetch(
  `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat={lat}&lon={lon}&appid={API key}`
);
