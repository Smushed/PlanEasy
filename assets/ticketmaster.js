// need to adjust and add location

const zip = 60614;
var tmDateString = "";
var tmDateString2 = "";
var apiEvents = [];
var apiVenueLocation = [];
var CORS = "https://cors-anywhere.herokuapp.com/";
// Api url - includes zip and date. date is set as a range to then get time of day we need to leverage the data in the pull.heroku allows us to bypass CORS permission

//create an Ajax call
function getEvents() {
  const tmApiCall = `${CORS}https://app.ticketmaster.com/discovery/v2/events.json?apikey=aw1x9XltYOH5uHXUYANmxJszqWA77OZR&postalCode=${zip}&startDateTime=${tmDateString}&endDateTime=${tmDateString2}`;

  //create an Ajax call
  $.ajax({
    type: "GET",
    url: tmApiCall
  }).then(function (response) {
    apiEvents = response._embedded.events;

    //Loop populates document with events
    for (let i = 0; i < apiEvents.length; i++) {
      // variable holds the time event takes place (24hr format HH:MM:SS)
      const time = apiEvents[i].dates.start.localTime;

      //variable holds the date event takes place (YYYY-MM-DD)
      const date = apiEvents[i].dates.start.localDate;

      //variable holds the book now link
      const bookUrl = apiEvents[i].url;

      //Set Lat and Long for venue as variables for weather API calls
      const latitude =
        response._embedded.events[i]._embedded.venues[0].location.latitude;

      const longitude =
        response._embedded.events[i]._embedded.venues[0].location.longitude;

      //get date and time of venue 1 and convert to unix for weather API call
      const weatherLocal = apiEvents[i].dates.start.localTime;
      const weatherDate = apiEvents[i].dates.start.localDate;
      const weatherCombined = weatherDate + " " + weatherLocal;
      //convert to Unix
      const weatherTime = weatherCombined
        .split(" - ")
        .map(function (date) {
          return Date.parse(date + "-0500") / 1000;
        })
        .join(" - ");

      //Dark Sky Api Format
      //Needs to be lat , long , Unix time (this includes both date and time in its value)
      // https://cors-anywhere.herokuapp.com/
      const apiKey = "1408b38a9701141fa75c8f041fca27e8";
      const url = "https://api.darksky.net/forecast/";
      const lati = latitude;
      const longi = longitude;
      const unixTime = weatherTime;
      const dark_Sky_api_call = CORS + url + apiKey + "/" + lati + "," + longi + "," + unixTime;

      //Run the Weather Api

      $.ajax({
        type: "GET",
        url: dark_Sky_api_call
      }).then(function (response) {
        //log the queryURL
        //log the result and specific paramters

        const temp = response.currently.temperature + "°F";

        const weatherSummary = response.currently.summary;

        const precipProbability =
          response.currently.precipProbability * 100 + "%";

        // creates div to append all info of event along with needed attributes
        const parentEvent = $("<div>");
        parentEvent.attr({ id: "event #" + (i + 1) });
        parentEvent.addClass(["eventDiv", "row"]);

        //creates an img element along with needed attributes
        const imgEvent = $("<img>");
        imgEvent.attr({
          id: "eventImg",
          src: apiEvents[i].images[0].url,
          class: "col-md-4"
        });

        //creating a div for the remaining 8 columns needed per bootstrap
        const divColumn = $("<div>");
        divColumn.addClass(["col-md-8", "info"]);

        //creaing a new row to insert Name of event
        const divRowName = $("<div>");
        divRowName.addClass(["row", "info"]);
        divColumn.append(divRowName);

        //creating a new row to insert time and date
        const divRowTime = $("<div>");
        divRowTime.addClass(["row", "info"]);
        divColumn.append(divRowTime);

        //creating a new row to insert book url
        const divRowBook = $("<div>");
        divRowBook.addClass(["row", "info"]);
        divColumn.append(divRowBook);

        //creating a new row to insert Weather Summary
        const divRowSummary = $("<div>");
        divRowSummary.addClass(["row", "info"]);
        divColumn.append(divRowSummary);

        //creating a new row to insert temp
        const divRowTemp = $("<div>");
        divRowTemp.addClass(["row", "info"]);
        divColumn.append(divRowTemp);

        //creating a new row to insert Chance of Rain
        const divRowPrecip = $("<div>");
        divRowPrecip.addClass(["row", "info"]);
        divColumn.append(divRowPrecip);

        //adding picture plus a new div to insert all other info
        parentEvent.append([imgEvent, divColumn]);

        // create span to append event name to from array
        const namespan = $("<div>");
        namespan.addClass("col-md-12");
        namespan.text("Event: " + apiEvents[i].name);
        // append name to row
        $(divRowName).append(namespan);

        // create span to append book value to from array

        const bookspan = $("<a>");
        bookspan.addClass("col-md-12");
        const bookBtn = $("<button>");
        bookspan.attr({
          href: bookUrl,
          target: "_blank"
        });
        bookBtn.html("Click here to buy tickets");
        bookspan.append(bookBtn);
        // append name to row
        $(divRowBook).append(bookspan);

        // create span to append weather summary value to from array
        const summaryspan = $("<div>");
        summaryspan.addClass("col-md-12");
        summaryspan.html("The Weather Will Be " + weatherSummary);
        // append name to row
        $(divRowSummary).append(summaryspan);

        // create span to append Temperature value to from array
        const tempspan = $("<div>");
        tempspan.addClass("col-md-12");
        tempspan.text("Temperature: " + temp);
        // append name to row
        $(divRowTemp).append(tempspan);

        // create span to append chance of rain value to from array
        const rainspan = $("<div>");
        rainspan.addClass("col-md-12");
        rainspan.text("There is a " + precipProbability + " chance of rain");
        // append name to row
        $(divRowPrecip).append(rainspan);

        // span for date and time
        const timespan = $("<div>");
        timespan.addClass("col-md-12");

        //set the text to date and time of event (needs work still to modify data)
        // timespan.text("When: " + apiEvents[i].dates.start.localTime + " " + apiEvents[i].dates.start.localDate);
        timespan.text("When: " + getTimeAndDate(time, date));

        //append to row
        $(divRowTime).append(timespan);

        //append event to document
        $(".eventDisplay").append(parentEvent);
      });
    }
  });

  const getTimeAndDate = (eventTime, eventDate) => {
    const eventYear = eventDate.slice(0, 4);
    const eventMonth = eventDate.slice(5, 7);
    const eventDay = eventDate.slice(8, 10);

    //New date with US format
    eventDate = eventMonth + "/" + eventDay + "/" + eventYear;

    // this will get our hour the event takes place
    let sliceNum = eventTime.slice(0, 2);

    //variable to represent Am or Pm
    let am_pm = "";

    if (+eventTime.slice(0, 2) < 12) {
      am_pm = "am";
    } else {
      // reassign variable to 12hr format for hour
      sliceNum = +eventTime.slice(0, 2) - 12;
      am_pm = "pm";
    }

    // get the correct time format HH:MM
    var correctTimeFormat = sliceNum + eventTime.slice(2, 5);

    //Variable for correct date format MM/DD/YYYY at HH:MM
    var correctDateFormat = eventDate + " at " + correctTimeFormat + am_pm;
    return correctDateFormat;
  }
}

$("body").on("click", ".SimilarFreeTime", function () {
  $(".eventDisplay").empty();
  var eventChosen = $(this).val();
  var eventYear = eventChosen.slice(0, 4);
  var eventMonth = eventChosen.slice(5, 7);
  var eventDay = eventChosen.slice(8, 10);
  eventfulDateString = `${eventYear}${eventMonth}${eventDay}00-${eventYear}${eventMonth}${eventDay}00`;
  getEventfulEvents();

  //Gets TicketMaster Data as well
  tmDateString = eventChosen + ":00Z";
  tmDateString2 = eventChosen.slice(0, 11) + "23:59:59Z";
  getEvents();
});