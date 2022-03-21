
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
        countryOption.selectedIndex = 0;
    }).catch(function() {
        alert("Err!")
    });
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
            debugger;
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

document.getElementById("search-button").addEventListener("click", covidDataSet);
getCountryOptions();