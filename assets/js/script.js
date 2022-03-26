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
        // if (initial search) else (compare countries)
        if (!document.getElementById("country-1")) {

            // select user country option
            var countryOption = document.getElementById("country-option");
            var countrySelected = countryOption.options[countryOption.selectedIndex].value;

            // if no country is selected
            if (countrySelected == false) {
                // alert user to select an additional country
                return userWarning() ;
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
                // display stats of the primary country
                displayCovidStatsPrimary(data[countrySelected1]);
                // add to search history
                searchHistory(data[countrySelected1].location, countrySelected1);
                // alert user to select an additional country
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
        var infectionRate = (country.new_cases_smoothed / 25000) * 100 + "%";
    } else {
        var infectionRate = country.positive_rate;
    }
    
    // determine risk rating
    if (infectionRate < 0.05) {
        var riskRating = ["low", "LOW!"];
    } else if (infectionRate <= 0.099) {
        var riskRating = ["moderate", "MODERATE!"];
    } else if (infectionRate <= 0.5) { 
        var riskRating = ["high", "HIGH!"];
    } else {
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
        // gave id name-of-country
    countryHeaderEl.id = ('name-of-country-1');
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

    // Add Save Button
    var saveCardEl = document.createElement("button");
    saveCardEl.id = "save-button";
    saveCardEl.classList = "save-button-class-1";
    saveCardEl.innerHTML = "Save";
    pEl.appendChild(saveCardEl);

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
        var riskRating = ["low", "LOW!"];
    } else if (infectionRate <= 0.099) {
        var riskRating = ["moderate", "MODERATE!"];
    } else if (infectionRate <= 0.5) { 
        var riskRating = ["high", "HIGH!"];
    } else {
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
    countryHeaderEl.id = ('name-of-country-2');
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

    // Add Save Button
    var saveCardEl = document.createElement("button");
    saveCardEl.id = "save-button";
    saveCardEl.classList = "save-button-class-2";
    saveCardEl.innerHTML = "Save";
    pEl.appendChild(saveCardEl);

    // Display outputs
    divEl.appendChild(pEl);
    currentSearchContainer.appendChild(divEl);

};

function searchHistory(country1, country1Value, country2, country2Value) {

    // If no second country selected
    if (!country2) {
        var countryObj = {"name": country1, "id0": country1Value};
    } else {
        var countryObj = {"name": country1 + " & " + country2, "id0": country1Value, "id1": country2Value};
    }

    // remove duplicate countryObj in historyArr
    removeDuplicates(countryObj);

    // unshift new countryObj to front of historyArr
    historyArr.unshift(countryObj);

    // set localStorage
    // localStorage.setItem("covid-country-search-items", historyArr);
    
    // clear search btns
    document.getElementById("search-history-buttons").innerHTML = "";

    // create search history btns
    for (var i = 0; i < historyArr.length; i++) {
        var searchHistoryBtn = document.createElement("button");
        searchHistoryBtn.textContent = historyArr[i].name;
        searchHistoryBtn.className = "search-history-btn";

        // if there is a second country
        if ("id1" in historyArr[i] == true) {
            searchHistoryBtn.id = historyArr[i].id0 + "&" + historyArr[i].id1;
        } else {
            searchHistoryBtn.id = historyArr[i].id0;
        }
        
        document.getElementById("search-history-buttons").appendChild(searchHistoryBtn);
    }
    document.getElementById("search-history-buttons").addEventListener("click", returnSearchHistoryResult);
};

function removeDuplicates(countryObj) { debugger;
    // return nothing if historyArr is empty
    if (historyArr.length === 0) {
        return
    }

    // find splice number of any duplicate searchHistoryBtn
    var spliceNumber = historyArr.findIndex(function(objVal, objIndex) {
        console.log(objVal.name, objIndex);
        console.log(historyArr);
        return objVal.name == countryObj.name;
    });

    // if no match found in splice, return nothing
    if (spliceNumber < 0) {
        return
    }

    // splice historyArr and remove duplicate countryObj
    historyArr.splice(spliceNumber, 1);
}

function returnSearchHistoryResult(event) {

    // get <select> for both first and seconds country list
    var selectElFirst = document.getElementById("country-option");
    var selectElSecond = document.getElementById("country-option-2");

    // if there are 2 coountries
    if (event.target.id.trim().search('&') > 0) {
        // split compared countries into 2 array strings
        var names = event.target.id.split("&");

        // trim each country name and push to names array
        names = names.map(function(element) {
            return element.trim();
        });

        // set <select> to respective <option> and search again
        selectElFirst.value = names[0];
        selectElSecond.value = names[1];
        covidDataSet(event);
    } else {
        selectElFirst.value = event.target.id;
        selectElSecond.value = "Please Select a Country";
        covidDataSet(event);
    }

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

function saveCountry1(event) {
    if (event.target.classList.contains('save-button-class-1')) {

        var getTheLocation = document.getElementById('name-of-country-1');
        locationLs = getTheLocation.innerHTML;
        localStorage.setItem('Name of country1', locationLs);

        var getTheFlag = document.getElementById('first-flag')
        flagLs = getTheFlag.src;
        localStorage.setItem('Flag URL country1', flagLs);

        var getTheCovRate = document.getElementById('first-covid-cases')
        covRateLs = getTheCovRate.innerText;
        localStorage.setItem('Weekly Covid Rate country1', covRateLs);

        var getTheVaxRate = document.getElementById('first-vax-rate');
        vaxRateLs = getTheVaxRate.innerText;
        localStorage.setItem('Vaccination Rate country1', vaxRateLs);

        var getTheRisk = document.getElementById('first-risk-rating');
        riskLs = getTheRisk.innerHTML;
        localStorage.setItem('Risk Level country1', riskLs);

        putInSearch()
    }
}

function saveCountry2(event) {
    if (event.target.classList.contains('save-button-class-2')) {

        var getTheLocation = document.getElementById('name-of-country-2');
        locationLs2 = getTheLocation.innerHTML;
        localStorage.setItem('Name of country country2', locationLs2);

        var getTheFlag = document.getElementById('second-flag')
        flagLs2 = getTheFlag.src;
        localStorage.setItem('Flag URL country2', flagLs2);

        var getTheCovRate = document.getElementById('second-covid-cases')
        covRateLs2 = getTheCovRate.innerText;
        localStorage.setItem('Weekly Covid Rate country2', covRateLs2);

        var getTheVaxRate = document.getElementById('second-vax-rate');
        vaxRateLs2 = getTheVaxRate.innerText;
        localStorage.setItem('Vaccination Rate country2', vaxRateLs2);

        var getTheRisk = document.getElementById('second-risk-rating');
        riskLs2 = getTheRisk.innerHTML;
        localStorage.setItem('Risk Level country2', riskLs2);

        putInSearch2()
    }
}

function putInSearch() {
    
    var searchHistory = document.getElementById("search-history-container");
    var divEl = document.createElement("div");
    divEl.id = "Country-History"
    divEl.className = "one-half column second-country-div country-div"

    var pEl = document.createElement("p");
    pEl.textContent = "Current Statistics for:";

    var countryHeaderEl = document.createElement("h5");
    countryHeaderEl.innerHTML = window.localStorage.getItem('Name of country1')
    pEl.appendChild(countryHeaderEl)

    var flagEl = document.createElement("img");
    var flagUrlLs = window.localStorage.getItem('Flag URL country1');
    flagEl.id = "first-flag";
    flagEl.src = flagUrlLs;
    flagEl.alt = "flag of " + countryHeaderEl.innerHTML;
    pEl.appendChild(flagEl);

    var covidCasesEl = document.createElement("p");
    covidCasesEl.id = "first-covid-cases";
    covidCasesEl.innerText = window.localStorage.getItem('Weekly Covid Rate country1');
    pEl.appendChild(covidCasesEl);

    var vaxRateEl = document.createElement("p");
    vaxRateEl.id = "first-vax-rate";
    vaxRateEl.innerText = window.localStorage.getItem('Vaccination Rate country1');
    pEl.appendChild(vaxRateEl);

    var riskRatingEl = document.createElement("p");
    riskRatingEl.id = "first-risk-rating";
    riskRatingEl.innerHTML = window.localStorage.getItem("Risk Level country1");
    pEl.appendChild(riskRatingEl);

    divEl.appendChild(pEl)
    searchHistory.appendChild(divEl)
}


function putInSearch2() {
    
    var searchHistory = document.getElementById("search-history-container");
    var divEl = document.createElement("div");
    divEl.id = "Country-History"
    divEl.className = "one-half column second-country-div country-div"

    var pEl = document.createElement("p");
    pEl.textContent = "Current Statistics for:";

    var countryHeaderEl = document.createElement("h5");
    countryHeaderEl.innerHTML = window.localStorage.getItem('Name of country2')
    pEl.appendChild(countryHeaderEl)

    var flagEl = document.createElement("img");
    var flagUrlLs = window.localStorage.getItem('Flag URL country2');
    flagEl.id = "first-flag";
    flagEl.src = flagUrlLs;
    flagEl.alt = "flag of " + countryHeaderEl.innerHTML;
    pEl.appendChild(flagEl);

    var covidCasesEl = document.createElement("p");
    covidCasesEl.id = "first-covid-cases";
    covidCasesEl.innerText = window.localStorage.getItem('Weekly Covid Rate country2');
    pEl.appendChild(covidCasesEl);

    var vaxRateEl = document.createElement("p");
    vaxRateEl.id = "first-vax-rate";
    vaxRateEl.innerText = window.localStorage.getItem('Vaccination Rate country2');
    pEl.appendChild(vaxRateEl);

    var riskRatingEl = document.createElement("p");
    riskRatingEl.id = "first-risk-rating";
    riskRatingEl.innerHTML = window.localStorage.getItem("Risk Level country2");
    pEl.appendChild(riskRatingEl);

    divEl.appendChild(pEl)
    searchHistory.appendChild(divEl)
}


// Event listener for user search
document.getElementById("search-button").addEventListener("click", covidDataSet);

// dynamically create country <option> on page load
getCountryOptions(document.getElementById("country-option"));

document.getElementById("current-search-container").addEventListener("click",saveCountry1);
document.getElementById("current-search-container").addEventListener("click",saveCountry2);

putInSearch()
putInSearch2()
