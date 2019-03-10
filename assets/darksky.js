//TODO Update this time to run on the next 5 days

var CORS = "https://cors-anywhere.herokuapp.com/";

// Array for getting current day and next 6 days

//array for getting current date and next 6 dates
const dayNum = [
    moment().date(),
    moment().add(1, `days`).date(),
    moment().add(2, `days`).date(),
    moment().add(3, `days`).date(),
    moment().add(4, `days`).date(),
];

var weatherTime = eventfulStartTime;
weatherTime = eventfulStartTime
    .split(" - ")
    .map(function (date) {
        return Date.parse(date + "-0500") / 1000;
    })
    .join(" - ");

//Set Lat and Long for venue as variables for weather API calls


//Dark Sky Api Format
//Needs to be lat , long , Unix time (this includes both date and time in its value)
// https://cors-anywhere.herokuapp.com/
const apiKey = `1408b38a9701141fa75c8f041fca27e8`;
const latitude = 41.88287;
const longitude = -87.64355;
const unixTime = weatherTime;
const dark_Sky_api_call = `${CORS}https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude},${unixTime}`;

//Run the Weather Api
$.ajax({
    type: "GET",
    url: dark_Sky_api_call
}).then(function (response) {
    //log the queryURL

    //log the result and specific paramters
    var temp = response.currently.temperature + "°F";

    var weatherSummary = response.currently.summary;

    var precipProbability =
        response.currently.precipProbability * 100 + "%";

    // create span to append weather summary value to from array
    var summaryspan = $("<div>");
    summaryspan.addClass("col-md-12");
    summaryspan.html("The Weather Will Be " + weatherSummary);
    // append name to row
    $(divRowSummary).append(summaryspan);

    // create span to append Temperature value to from array
    var tempspan = $("<div>");
    tempspan.addClass("col-md-12");
    tempspan.text("Temperature: " + temp);
    // append name to row
    $(divRowTemp).append(tempspan);

    // create span to append chance of rain value to from array
    var rainspan = $("<div>");
    rainspan.addClass("col-md-12");
    rainspan.text("There is a " + precipProbability + " chance of rain");
    // append name to row
    $(divRowPrecip).append(rainspan);


});