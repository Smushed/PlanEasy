// need to adjust and add location

const zip = 60614;
var tmDateString = "";
var tmDateString2 = "";
var apiEvents = [];
var apiVenueLocation = [];
var CORS = `https://cors-anywhere.herokuapp.com/`;
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

    //Loop populates document with events
    for (let i = 0; i < apiEvents.length; i++) {
      // variable holds the time event takes place (24hr format HH:MM:SS)
      const time = apiEvents[i].dates.start.localTime;

      //variable holds the date event takes place (YYYY-MM-DD)
      const date = apiEvents[i].dates.start.localDate;

      //variable holds the book now link
      const bookUrl = apiEvents[i].url;

      // creates div to append all info of event along with needed attributes
      const parentEvent = $(`<div>`);
      parentEvent.addClass([`eventDiv`, `col-md-5`]);

      //creates an img element along with needed attributes
      const imgEvent = $(`<img>`);
      imgEvent.attr({
        src: apiEvents[i].images[0].url,
        class: `col-md-4`
      });
      imgEvent.addClass(`eventImg`)

      //creating a div for the remaining 8 columns needed per bootstrap
      const divColumn = $(`<div>`);
      divColumn.addClass([`col-md-12`, `info`]);

      //creaing a new row to insert Name of event
      const divRowName = $(`<div>`);
      divRowName.addClass([`row`, `info`]);
      divColumn.append(divRowName);

      //creating a new row to insert time and date
      const divRowTime = $(`<div>`);
      divRowTime.addClass([`row`, `info`]);
      divColumn.append(divRowTime);

      //creating a new row to insert book url
      const divRowBook = $(`<div>`);
      divRowBook.addClass([`row`, `info`]);
      divColumn.append(divRowBook);

      //creating a new row to insert Weather Summary
      const divRowSummary = $(`<div>`);
      divRowSummary.addClass([`row`, `info`]);
      divColumn.append(divRowSummary);

      //creating a new row to insert temp
      const divRowTemp = $(`<div>`);
      divRowTemp.addClass([`row`, `info`]);
      divColumn.append(divRowTemp);

      //creating a new row to insert Chance of Rain
      const divRowPrecip = $(`<div>`);
      divRowPrecip.addClass([`row`, `info`]);
      divColumn.append(divRowPrecip);

      //adding picture plus a new div to insert all other info
      parentEvent.append([imgEvent, divColumn]);

      // create span to append event name to from array
      const namespan = $(`<div>`);
      namespan.addClass(`col-md-12`);
      namespan.text(`Event: ${apiEvents[i].name}`);
      // append name to row
      $(divRowName).append(namespan);

      // create span to append book value to from array

      const bookspan = $(`<a>`);
      bookspan.addClass(`col-md-12`);
      const bookBtn = $(`<button>`);
      bookspan.attr({
        href: bookUrl,
        target: `_blank`
      });
      bookBtn.html(`Click here to buy tickets`);
      bookBtn.addClass([`btn`, `btn-success`])
      bookspan.append(bookBtn);
      // append name to row
      $(divRowBook).append(bookspan);

      // span for date and time
      const timespan = $(`<div>`);
      timespan.addClass(`col-md-12`);

      //set the text to date and time of event (needs work still to modify data)
      timespan.text(`When: ` + getTimeAndDate(time, date));

      //append to row
      $(divRowTime).append(timespan);

      //append event to document
      $(`.eventDisplay`).append(parentEvent);
    }
  });
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