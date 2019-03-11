//TODO Update this time to run on the next 5 days

var CORS = "https://cors-anywhere.herokuapp.com/";

// Array for getting current day and next 6 days

//Set Lat and Long for venue as variables for weather API calls
const getWeather = (chosenTime) => {

    $(`.event-time`).html(chosenTime.slice(0, 10))

    var momentTime = moment(chosenTime, `M/D/YYYY H:MM`);
    var unixTime = moment().unix(momentTime);
    //Dark Sky Api Format
    //Needs to be lat , long , Unix time (this includes both date and time in its value)
    // https://cors-anywhere.herokuapp.com/
    const apiKey = `1408b38a9701141fa75c8f041fca27e8`;
    const latitude = 41.88287;
    const longitude = -87.64355;
    const dark_Sky_api_call = `${CORS}https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude},${unixTime}`;

    //Run the Weather Api
    $.ajax({
        type: "GET",
        url: dark_Sky_api_call
    }).then(function (response) {
        //log the queryURL
        //log the result and specific paramters

        const hourlyWeather = [7, 12, 18]

        for (let i = 0; i < hourlyWeather.length; i++) {
            const summaryRow = $(`<div>`);
            summaryRow.addClass([`row`])

            const summaryDiv = $(`<div>`);
            summaryDiv.addClass(`col-md-12`);
            summaryDiv.html(`${response.hourly.data[i].summary}`);

            const tempDiv = $(`<div>`);
            tempDiv.addClass(`col-md-12`);
            tempDiv.html(`Temperature: ${response.hourly.data[i].temperature}°F`);

            const rainDiv = $(`<div>`);
            rainDiv.addClass(`col-md-12`);
            rainDiv.html(`Chance of Rain: ${Math.floor(response.hourly.data[i].precipProbability * 100)}%`)

            if (i === 0) {
                $(`.morning-weather`).append(summaryDiv);
                $(`.morning-weather`).append(tempDiv);
                $(`.morning-weather`).append(rainDiv);
            } else if (i === 1) {
                $(`.afternoon-weather`).append(summaryDiv);
                $(`.afternoon-weather`).append(tempDiv);
                $(`.afternoon-weather`).append(rainDiv);
            } else {
                $(`.evening-weather`).append(summaryDiv);
                $(`.evening-weather`).append(tempDiv);
                $(`.evening-weather`).append(rainDiv);
            };
        };
    });

};