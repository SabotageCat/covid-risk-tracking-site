// object array for search history
var historyArr = [];

// temp flag, waiting for flag api
var countryFlag = "https://www.flags.co.uk/client/uploads/HVYYZFxB25xBnATl9zjmfEakGu9w6pBVAKo4iXfx.jpeg";

// retrieve dataset from outworldindata.org
function covidDataSet(event) {
    event.preventDefault();

    var apiUrl = "https://covid.ourworldindata.org/data/latest/owid-covid-latest.json";
    // fetch JSON data
    fetch(apiUrl).then(function(response) {
        return response.json()
    }).then(function(data) {
        // if (initial search) else (compare)
        if (!document.getElementById("country-1")) {

            // select user country option
            var countryOption = document.getElementById("country-option");
            var countrySelected = countryOption.options[countryOption.selectedIndex].value;
            console.log(countrySelected);

            // Issue user warning if no country is selected
            if (countrySelected == false) {
                return userWarning();
            } else {
                document.getElementById("current-search-info").innerHTML = "";
            }

            // Send data request to displayCovidStats function
            displayCovidStatsPrimary(data[countrySelected]);

            // Create search history
            searchHistory(data[countrySelected].location, countrySelected);

            // Enable country comparison
            createCompareOption();

        } else {
            // select user country option
            var countryOption1 = document.getElementById("country-option");
            var countrySelected1 = countryOption1.options[countryOption1.selectedIndex].value;

            // select user country option 2
            var countryOption2 = document.getElementById("country-option-2");
            var countrySelected2 = countryOption2.options[countryOption2.selectedIndex].value;

            // Issue user warning if no country is selected
            if (countrySelected2 == "Please Select a Country") {
                displayCovidStatsPrimary(data[countrySelected1]);
                return userWarning();
            }

            // Send data request to displayCovidStatsPrimary function
            displayCovidStatsPrimary(data[countrySelected1]);

            // Send data request to displayCovidStatsSecondary
            displayCovidStatsSecondary(data[countrySelected2]);

            // Create search history
            searchHistory(data[countrySelected1].location, countrySelected1, data[countrySelected2].location, countrySelected2);
        }
        
    }).catch(function() {
        alert("Err!");
    });
};

function displayCovidStatsPrimary(country) {

    // get fully vaxxed percentage
    if (!country.people_fully_vaccinated_per_hundred) {
        var countryVax = "Unavailable Data!";
    } else {
        var countryVax = country.people_fully_vaccinated_per_hundred + "%";
    }

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
        var riskRating = ["severe", "SEVERE!"];
    }

    // construct display outputs
    var currentSearchContainer = document.getElementById("current-search-info");
    var divEl = document.createElement("div");
    divEl.id = "country-1";

    // if comparing then display sise-by-side
    if (document.getElementById("country-1")) {
        divEl.className = "one-half column first-country-div country-div";
    } else {
        divEl.className = "column first-country-div country-div";
    }

    var pEl = document.createElement("p");
    pEl.textContent = "Current Statistics for:";

    // Add Country
    var countryHeaderEl = document.createElement("h5");
    countryHeaderEl.innerText = country.location;
    pEl.appendChild(countryHeaderEl);

    // Add flag
    var countryOption = document.getElementById("country-option");
    var countrySelected = countryOption.options[countryOption.selectedIndex].value;
    var countryFlag = "https://www.countryflagsapi.com/png/"  + countrySelected;
    var imgEl = document.createElement("img");
    imgEl.id = "first-flag";
    imgEl.src = countryFlag;
    imgEl.alt = "flag of " + country.location;
    pEl.appendChild(imgEl);

    // Add Covid Cases
    var covidCasesEl = document.createElement("p");
    covidCasesEl.id = "first-covid-cases";
    covidCasesEl.innerText = "New Weekly COVID-19 Cases: " + Math.floor(country.new_cases_smoothed);
    pEl.appendChild(covidCasesEl);

    // Add Vaccination Rates
    var vaxRateEl = document.createElement("p");
    vaxRateEl.id = "first-vax-rate";
    vaxRateEl.innerText = "Current Vaccination Rate: " + countryVax;
    pEl.appendChild(vaxRateEl);
    
    // Add Risk Rating
    var riskRatingEl = document.createElement("p");
    riskRatingEl.id = "first-risk-rating";
    riskRatingEl.innerHTML = "<span id='" + riskRating[0] + "'> Risk Assessment Rating: " + riskRating[1] + "</span>";
    pEl.appendChild(riskRatingEl);

    // remove user warning
    if (document.getElementById("user-warning") == true) {
        currentSearchContainer.innerHTML = "";
    }

    // DO NOT clear if comparing
    if (document.getElementById("country-1")) {
        currentSearchContainer.innerHTML = "";
    } else if (document.getElementById("country-1") && document.getElementById("country-2")) {
        currentSearchContainer.innerHTML = "";
    } 

    // Display outputs
    divEl.appendChild(pEl);
    currentSearchContainer.appendChild(divEl);

};

function displayCovidStatsSecondary(country) {

    // get fully vaxxed rate
    if (!country.people_fully_vaccinated_per_hundred) {
        var countryVax = "Data unavailable!";
    } else {
        var countryVax = country.people_fully_vaccinated_per_hundred + "%";
    }

    // Calculate infection rate
    if (!country.positive_rate) {
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
        var riskRating = ["severe", "SEVERE!"];
    }

    // construct display outputs
    var currentSearchContainer = document.getElementById("current-search-info");
    var divEl = document.createElement("div");
    divEl.id = "country-2";
    divEl.className = "one-half column second-country-div country-div";

    var pEl = document.createElement("p");
    pEl.textContent = "Current Statistics for:";

    // Add Country
    var countryHeaderEl = document.createElement("h5");
    countryHeaderEl.innerText = country.location;
    pEl.appendChild(countryHeaderEl);

    // Add flag
    var countryOption = document.getElementById("country-option-2");
    var countrySelected = countryOption.options[countryOption.selectedIndex].value;
    var countryFlag = "https://www.countryflagsapi.com/png/"  + countrySelected;
    var imgEl = document.createElement("img");
    imgEl.id = "second-flag";
    imgEl.src = countryFlag;
    imgEl.alt = "flag of " + country.location;
    pEl.appendChild(imgEl);

    // Add Covid Cases
    var covidCasesEl = document.createElement("p");
    covidCasesEl.id = "second-covid-cases";
    covidCasesEl.innerText = "New Weekly COVID-19 Cases: " + Math.floor(country.new_cases_smoothed);
    pEl.appendChild(covidCasesEl);

    // Add Vaccination Rates
    var vaxRateEl = document.createElement("p");
    vaxRateEl.id = "second-vax-rate";
    vaxRateEl.innerText = "Current Vaccination Rate: " + countryVax;
    pEl.appendChild(vaxRateEl);
    
    // Add Risk Rating
    var riskRatingEl = document.createElement("p");
    riskRatingEl.id = "second-risk-rating";
    riskRatingEl.innerHTML = "<span id='" + riskRating[0] + "'> Risk Assessment Rating: " + riskRating[1] + "</span>";
    pEl.appendChild(riskRatingEl);

    // Display outputs
    divEl.appendChild(pEl);
    currentSearchContainer.appendChild(divEl);

};

function searchHistory(country1, country1Value, country2, country2Value) {
    console.log(country1);
    // If no second country selected
    if (!country2) {
        var countryToPush = {"name": country1, "id0": country1Value};
        historyArr.push(countryToPush);
        console.log(historyArr);
    } else {
        var countriesToPush = {"name": country1 + " & " + country2, "id0": country1Value, "id1": country2Value};
        historyArr.push(countriesToPush);
    }

    // set localStorage
    // localStorage.setItem("covid-country-search-items", historyArr);
    
    // clear search btns
    document.getElementById("search-history-buttons").innerHTML = "";

    // create search history btns
    for (var i = 0; i < historyArr.length; i++) {
        var searchHistoryBtn = document.createElement("button");
        searchHistoryBtn.textContent = historyArr[i].name;
        searchHistoryBtn.className = "search-history-btn one-third";
        searchHistoryBtn.id = historyArr[i].name;
        document.getElementById("search-history-buttons").appendChild(searchHistoryBtn);
    }
    document.getElementById("search-history-buttons").addEventListener("click", returnSearchHistoryResult);
};

function returnSearchHistoryResult(event) {

    if (event.target.id.trim().search('<>') > 1) {
        // split compared countries into 2 array strings
        var names = event.target.id.split("<>");

        // trim each country name
        names = names.map(function(element) {
            return element.trim();
        });

        console.log("finalNames: ", names[0], names[1]);

        // search again
    }

    // get id of search btn
    var historyItem = event.target.id;

}

function createCompareOption() {
        // get existing elements
        var formEl = document.querySelector("form");
        var compareBtn = document.getElementById("search-button");
    
        // change search to compare compare button and listener
        compareBtn.value = "<< Compare >>";
        compareBtn.id = "compare-btn";
    
        // create select element
        var compareSelectEl = document.createElement("select");
        compareSelectEl.name = "country-2";
        compareSelectEl.id = "country-option-2";
    
        // create option element
        var compareOptionEl = document.createElement("option");
        compareOptionEl.textContent = "Please Select a Country";
        compareOptionEl.selected = true;
        compareOptionEl.disabled = true; 
    
        // add <option> to <select> to <form>
        compareSelectEl.appendChild(compareOptionEl);
        formEl.appendChild(compareSelectEl);
    
        // dynamically create country <option>
        getCountryOptions(document.getElementById("country-option-2"));
};

function getCountryOptions(countryOption) {
    // covid json data
    var apiUrl = "https://covid.ourworldindata.org/data/latest/owid-covid-latest.json";

    // fetch json data
    fetch(apiUrl).then(function(response) {
        return response.json()
    }).then(function(data) {

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
                countryOption.appendChild(optionEl);
            }
        };
        
    }).catch(function() {
        alert("Err!");
    });
};

// Display warning for user if no country selected
function userWarning() {

    var currentSearchContainer = document.getElementById("current-search-info");

    if (!document.getElementById("country-1")) {
        currentSearchContainer.innerHTML = "";
    } 

    // Add user warning
    var userWarning = document.createElement("h3");
    var styleEl = document.querySelector("style");
    styleEl.textContent = styleEl.textContent + "@keyframes warning {100% {opacity: 0;}";
    userWarning.id = "user-warning";
    userWarning.style.color = "red";
    userWarning.style.animation = "warning 0.25s 3 reverse";
    userWarning.textContent = "Please select a country!";

    // display user warning
    currentSearchContainer.appendChild(userWarning);
};

// Event listener for user search
document.getElementById("search-button").addEventListener("click", covidDataSet);

// dynamically create country <option> on page load

getCountryOptions(document.getElementById("country-option"));