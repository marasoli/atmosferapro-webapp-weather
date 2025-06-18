// Define API endpoints and manage loading and error states
const temperature = document.querySelector('#temperature span');
const humidity = document.querySelector('#humidity span');
const imgWeather = document.querySelector('#weather img');
const spanWeather = document.querySelector('#weather span');
const wind = document.querySelector('#wind span');
const cityName = document.querySelector('#city');

const loader = document.querySelector('#loader');
const msgError = document.querySelector('#error-msg');

const getWeather = async (city) => {
  try {
    toggleLoader();

    const res = await fetch (`http://localhost:3000/weather?city=${city}`);
    if (!res.ok) {
      throw new Error(`Erro na requisição: ${res.status} - ${res.statusText}`)
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    showErrorMessage();
  } finally {
    toggleLoader();
  }
};

const showWeather = async (city) => {
  const data = await getWeather(city);
  console.log("Dados API", data);
  if (!data || data.cod === "404") {
    showErrorMessage();
    return;
  }

  temperature.innerText = parseInt(data.main.temp);
  humidity.innerText = `${data.main.humidity}%`;
  imgWeather.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
  spanWeather.innerText = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
  wind.innerText = `${data.wind.speed} km/h`;
  cityName.innerText = data.name;
};

const toggleLoader = () => {
  loader.classList.toggle('hidden');
};

const showErrorMessage = () => {
  msgError.classList.remove('hidden')
};

// Event listeners and handlers for search bar functionality
const btnSearch = document.getElementById('search-btn');
const iptSearch = document.getElementById('search-ipt');

["mouseenter", "mouseleave"].forEach(event => {
  btnSearch.addEventListener(event, toggleSearchInput);
});

function toggleSearchInput(e) {
  if (e.type === "mouseenter") {
    iptSearch.classList.remove('hidden')
  } else if (e.type === "mouseleave") {
    setTimeout(() => {
      if (document.activeElement !== iptSearch) {
        iptSearch.classList.add('hidden')
      }
    }, 400);
  }
}

iptSearch.addEventListener("blur", () => {
  iptSearch.classList.remove('hidden')
});

iptSearch.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const search = iptSearch.value.trim();
    showWeather(search);
  }
});

// Initialization and update logic for clock and date display
const clock = document.getElementById('clock');
const currentDate = document.getElementById('date');
const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const spans = document.querySelectorAll('.days span');
const now = new Date();

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  clock.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);

function updateDate() {
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const formattedDate = now.toLocaleDateString('pt-br', options);
  currentDate.textContent = formattedDate;
}

function boldDays() {
  const dayWeek = days[now.getDay()];
  spans.forEach((span) => {
    if (span.textContent.toLowerCase() === dayWeek) {
      span.classList.add('active');
    } else {
      span.classList.remove('active');
    }
  });
}

updateClock();
updateDate();
boldDays();
