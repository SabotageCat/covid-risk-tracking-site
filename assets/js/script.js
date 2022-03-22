// temp flag, waiting for flag api
var countryFlag = "https://www.flags.co.uk/client/uploads/HVYYZFxB25xBnATl9zjmfEakGu9w6pBVAKo4iXfx.jpeg";

// retrieve dataset from outworldindata.org
function covidDataSet(event) {
    // debugger;
    event.preventDefault();
    // select user country option
    var countryOption = document.getElementById("country-option");
    var countrySelected = countryOption.options[countryOption.selectedIndex].value;

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

function displayCovidStats(country) {

    // 
    if (!country.people_fully_vaccinated_per_hundred) {
        var countryVax = "Unavailable Data!";
    } else {
        var countryVax = country.people_fully_vaccinated_per_hundred + "%";
    }

    console.log("Country: " + country.location, "Vaccination Rates: " + countryVax);

    // Calculate infection rate
    if (!country.positive_rate) {
        console.log("No positive rate!");
        var infectionRate = (country.new_cases_smoothed / 25000) * 100 + "%";
    } else {
        var infectionRate = country.positive_rate;
    }
    
    // determine risk rating
    if (infectionRate < 0.05) {
        console.log("Low!");
        var riskRating = "LOW!";
    } else if (infectionRate <= 0.099) {
        console.log("Moderate!");
        var riskRating = "MODERATE!";
    } else if (infectionRate <= 0.5) { 
        console.log("High!");
        var riskRating = "HIGH!";
    } else {
        console.log("Severe!");
        var riskRating = "SEVERE!";
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
    riskRatingEl.innerText = "Risk Assessment Rating: " + riskRating;
    pEl.appendChild(riskRatingEl);

    // Display outputs
    currentSearchContainer.innerHTML = "";
    divEl.appendChild(pEl);
    currentSearchContainer.appendChild(divEl);

};

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

// Event listener for user search
document.getElementById("search-button").addEventListener("click", covidDataSet);

// dynamically create country <option> on page load
getCountryOptions();