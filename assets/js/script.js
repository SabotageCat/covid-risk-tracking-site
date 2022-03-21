
// retrieve dataset from outworldindata.org
function covidDataSet(event) {
    // debugger;
    event.preventDefault();
    // select countryoption in the DOM
    var userCountryOption = document.getElementById("country-option");

    var apiUrl = "https://covid.ourworldindata.org/data/latest/owid-covid-latest.json";
    // fetch JSON data
    fetch(apiUrl).then(function(response) {
        return response.json()
    }).then(function(data) {
        console.log(data);
    }).catch(function() {
        alert("Err!")
    });
};

function getCountryOptions(event) {
    // prevent page refresh
    event.preventDefault();
    // covid json data
    var apiUrl = "https://covid.ourworldindata.org/data/latest/owid-covid-latest.json";
    // fetch json data
    fetch(apiUrl).then(function(response) {
        return response.json()
    }).then(function(data) {
        console.log(Object.values(data)[0].continent);
        // select country-option <select> in the DOM
        var userCountryOption = document.getElementById("country-option");
        userCountryOption.innerHTML = '';
        // dynamically create country option selections for user
        for (var i = 0; i < Object.keys(data).length; i++) {
            debugger;
            if (Object.values(data)[i].continent === "Africa"||"Asia"||"Europe"||"North America"||"South America"||"Oceania") {
                // create <option> for country in <select>
                var optionEl = document.createElement("option");
                optionEl.value = Object.keys(data)[i];
                optionEl.text = Object.values(data)[i].location;
                // append <option> to <select>
                userCountryOption.appendChild(optionEl);
            } else {
                // If not a country in json file then skip 
                i++;
            }

        };
    }).catch(function() {
        alert("Err!");
    });
};

document.getElementById("search-button").addEventListener("click", covidDataSet);
document.getElementById("country-option").addEventListener("click", getCountryOptions);