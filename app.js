let currentUnit = 'C';  // Default unit is Celsius
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

async function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = "2b62e4d2e7f84a15ac845703250402"; // Your API key
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            alert(data.error.message);
            return;
        }

        const { current, location } = data;

        // Convert temperature based on selected unit
        let temp = current.temp_c;
        if (currentUnit === 'F') {
            temp = (temp * 9/5) + 32;  // Convert to Fahrenheit
        }

        // Update weather info display
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.style.display = "block";

        document.getElementById('weather-info').innerHTML = `
            <h2>${location.name}, ${location.country}</h2>
            <img src="http:${current.condition.icon}" alt="${current.condition.text}" />
            <p><strong>Temperature:</strong> ${temp.toFixed(1)}°${currentUnit}</p>
            <p><strong>Condition:</strong> ${current.condition.text}</p>
            <p><strong>Humidity:</strong> ${current.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${current.wind_kph} km/h</p>
        `;

        // Update background based on weather condition
        document.body.style.backgroundImage = `url('https://www.weatherapi.com/docs/weather_icons/${current.condition.code}.png')`;

        // Add search history
        addToSearchHistory(city);

    } catch (error) {
        console.error(error);
        alert("There was an error fetching the weather data.");
    }
}

// Function to toggle between Celsius and Fahrenheit
function toggleUnits(unit) {
    currentUnit = unit;
    const tempElement = document.querySelector('#weather-info p');
    if (tempElement) {
        getWeather(); // Re-fetch weather data with updated unit
    }
}

// Save to search history
function addToSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    updateSearchHistory();
}

// Display search history
function updateSearchHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.onclick = () => {
            document.getElementById('city').value = city;
            getWeather();
        };
        historyList.appendChild(li);
    });
}

// Initialize the app with existing search history
updateSearchHistory();
