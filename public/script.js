const apiCountry = 'https://countryflagsapi.netlify.app/flag/xx.svg';

const cityIpt = document.querySelector('#search-ipt');
const cityBtn = document.querySelector('#search-btn');

const homePage = document.querySelector('.home-page');
const suggestionBtn = document.querySelectorAll('.suggestions button');

const resultPage = document.querySelector('.result-page');
const cityElement = document.querySelector('#city');
const countryElement = document.querySelector('#country');
const tempElement = document.querySelector('#temperature span');
const iconElement = document.querySelector('#weather-icon');
const descElement = document.querySelector('#description');
const humidityElement = document.querySelector('#humidity span');
const windElement = document.querySelector('#wind span');

const errorContainer = document.querySelector('#error-message');
const loader = document.querySelector('#loader');

// Search-Bar Events
cityIpt.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const city = cityIpt.value.trim();
        showWeatherData(city);
    }
});

cityBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const city = cityIpt.value.trim();
    showWeatherData(city);
});

// Suggestions Event
suggestionBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        const city = btn.getAttribute('data-city');
        showWeatherData(city);
    });
});

// Weather Result-Page
const getWeatherData = async (city) => {
    try {
        toggleLoader();

        const res = await fetch(`http://localhost:3000/weather?city=${city}`);
        
        if (!res.ok) {
            throw new Error(`Erro na requisição: ${res.status} - ${res.statusText}`);
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

const showWeatherData = async (city) => {
    hiddenInformation();

    const data = await getWeatherData(city);
    if (!data || data.cod === "404") {
        showErrorMessage();
        return;
    }

    cityElement.innerText = data.name;
    countryElement.setAttribute('src', apiCountry.replace('xx', data.sys.country));
    tempElement.innerText = parseInt(data.main.temp);
    iconElement.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    descElement.innerText = data.weather[0].description;
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed} km/h`;
};

// Error Handling
const showErrorMessage = () => {
    errorContainer.classList.remove('hidden');
};

const hiddenInformation = () => {
    errorContainer.classList.add('hidden');
    homePage.classList.add('hidden');
    resultPage.classList.remove('hidden');
};

// Loader
const toggleLoader = () => {
    loader.classList.toggle('hidden');
};
