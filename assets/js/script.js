
// retrieve dataset from outworldindata.org
function covidDataSet () {
    var apiUrl = "https://covid.ourworldindata.org/data/latest/owid-covid-latest.json";

    fetch(apiUrl).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
    }).catch(function(error) {
        console.error("Something went wrong with retrieving the data!");
    });
};