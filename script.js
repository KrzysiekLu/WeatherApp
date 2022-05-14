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
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.key}&units=metric`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        this._setTemp(Math.round(data.main.temp));
        this._setImage();
        this._setDate();
        this._setImage(data.weather[0].icon);
        this._setCity(lat, lon);
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
  _setImage(img) {
    this.weatherImg.src = `https://openweathermap.org/img/wn/${img}@2x.png`;
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
}

const app = new App();
