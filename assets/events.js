$(`body`).on(`click`, `.SimilarFreeTime`, function () {
    $(`.eventDisplay`).empty();
    $(`.no-event-chosen`).hide();
    $(`.event-chosen`).show();


    const eventChosen = $(this).val();
    const eventYear = eventChosen.slice(0, 4);
    const eventMonth = eventChosen.slice(5, 7);
    const eventDay = eventChosen.slice(8, 10);
    const dateString = `${eventYear}${eventMonth}${eventDay}00-${eventYear}${eventMonth}${eventDay}00`;
    const weatherDate = `${eventMonth}/${eventDay}/${eventYear} 00:00`

    getWeather(weatherDate);

    getEventfulEvents(dateString);

    //Gets TicketMaster Data as well
    tmDateString = `${eventChosen}:00Z`;
    tmDateString2 = eventChosen.slice(0, 11) + `23:59:59Z`;
    getTicketMasterEvents();
});

$(`.go-to-calendar`).on(`click`, function () {
    $(`.eventDisplay`).empty();
    $(`.no-event-chosen`).show();
    $(`.event-chosen`).hide();

    $(`.morning-weather`).html(``);
    $(`.afternoon-weather`).html(``);
    $(`.evening-weather`).html(``);
});