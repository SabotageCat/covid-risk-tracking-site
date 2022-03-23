// temp flag, waiting for flag api
var countryFlag = "https://www.flags.co.uk/client/uploads/HVYYZFxB25xBnATl9zjmfEakGu9w6pBVAKo4iXfx.jpeg";

// retrieve dataset from outworldindata.org
function covidDataSet(event) {
    // prevent page refresh on click
    event.preventDefault();

    // select user country option
    var countryOption = document.getElementById("country-option");
    var countrySelected = countryOption.options[countryOption.selectedIndex].value;

    // notify user they must select a country
    if (countrySelected == false) {
        return userWarning();
    }

    var apiUrl = "https://covid.ourworldindata.org/data/latest/owid-covid-latest.json";
    // fetch JSON data
    fetch(apiUrl).then(function(response) {
        return response.json()
    }).then(function(data) {
        console.log(data[countrySelected]);
        // Send data request to displayCovidStats function
        displayCovidStats(data[countrySelected]);
        // reset default <option> to index 0 in <select>;
        countryOption.selectedIndex = 0;
    }).catch(function() {
        alert("Err!");
    });
};

// display COVID-19 stats for user selected country
function displayCovidStats(country) {

    // get fully vaxxed percentage
    if (!country.people_fully_vaccinated_per_hundred) {
        var countryVax = "Unavailable Data!";
    } else {
        var countryVax = country.people_fully_vaccinated_per_hundred + "%";
    }

    console.log("Country: " + country.location, "Vaccination Rates: " + countryVax);

    // calculate infection rate
    if (!country.positive_rate) {
        console.log("No positive rate!");
        var infectionRate = (country.new_cases_smoothed / 25000) * 100 + "%";
    } else {
        var infectionRate = country.positive_rate;
    }
    
    // determine risk rating
    if (infectionRate < 0.05) {
        console.log("Low!");
        var riskRating = ["low", "LOW!"];
    } else if (infectionRate <= 0.099) {
        console.log("Moderate!");
        var riskRating = ["moderate", "MODERATE!"];
    } else if (infectionRate <= 0.5) { 
        console.log("High!");
        var riskRating = ["high", "HIGH!"];
    } else {
        console.log("Severe!");
        var riskRating = ["very-high", "SEVERE!"];
    }

    // construct display outputs
    var currentSearchContainer = document.getElementById("current-search-info");
    var divEl = document.createElement("div");

    var pEl = document.createElement("p");
    pEl.textContent = "Current Statistics for:";

    // Add Country
    var countryHeaderEl = document.createElement("h5");
    countryHeaderEl.innerText = country.location;
    pEl.appendChild(countryHeaderEl);

    // Add flag
    var countryOption = document.getElementById("country-option");
    var countrySelected = countryOption.options[countryOption.selectedIndex].value;
    var countryFlag = "https://www.countryflagsapi.com/png/"  + countrySelected
    var imgEl = document.createElement("img");
    imgEl.src = countryFlag;
    imgEl.alt = country.location;
    pEl.appendChild(imgEl);

    // Add Covid Cases
    var covidCasesEl = document.createElement("p");
    covidCasesEl.innerText = "New Weekly COVID-19 Cases: " + Math.floor(country.new_cases_smoothed);
    pEl.appendChild(covidCasesEl);

    // Add Vaccination Rates
    var vaxRateEl = document.createElement("p");
    vaxRateEl.innerText = "Current Vaccination Rate: " + countryVax;
    pEl.appendChild(vaxRateEl);
    
    // Add Risk Rating
    var riskRatingEl = document.createElement("p");
    riskRatingEl.innerHTML = "<span id='" + riskRating[0] + "'> Risk Assessment Rating: " + riskRating[1];
    pEl.appendChild(riskRatingEl);

    // Display outputs
    currentSearchContainer.innerHTML = "";
    divEl.appendChild(pEl);
    currentSearchContainer.appendChild(divEl);

};

// generate <option> countries in <select>

function getCountryOptions() {
    // covid json data
    var apiUrl = "https://covid.ourworldindata.org/data/latest/owid-covid-latest.json";

    // fetch json data
    fetch(apiUrl).then(function(response) {
        return response.json()
    }).then(function(data) {

        // select country-option <select> in the DOM
        var CountryOption = document.getElementById("country-option");

        // dynamically create country option selections for user
        for (var i = 0; i < Object.keys(data).length; i++) {
            if (!Object.values(data)[i].continent) {
                // If not a country in json file then skip 
                i++;
            } else {
                // create <option> for country in <select>
                var optionEl = document.createElement("option");
                optionEl.value = Object.keys(data)[i];
                optionEl.text = Object.values(data)[i].location;
                // append <option> to <select>
                CountryOption.appendChild(optionEl);
            }
        };
        
    }).catch(function() {
        alert("Err!");
    });
};

// Display warning for user if no country selected
function userWarning() {

    var currentSearchContainer = document.getElementById("current-search-info");

    // Add user warning
    var userWarning = document.createElement("h3");
    var styleEl = document.querySelector("style");
    styleEl.textContent = styleEl.textContent + "@keyframes warning {100% {opacity: 0;}";
    userWarning.style.color = "red";
    userWarning.style.animation = "warning 0.25s 3 reverse";
    userWarning.textContent = "Please select a country!";

    // display user warning
    currentSearchContainer.innerHTML = "";
    currentSearchContainer.appendChild(userWarning);
};

// Event listener for user search
document.getElementById("search-button").addEventListener("click", covidDataSet);

// dynamically create country <option> on page load

document.getElementById("search-button").addEventListener("click", covidDataSet);
document.getElementById("search-button").addEventListener("click", flagDataSet);
getCountryOptions();