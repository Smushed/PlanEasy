$(`body`).on(`click`, `.SimilarFreeTime`, function () {
    $(`.eventDisplay`).empty();
    const eventChosen = $(this).val();
    const eventYear = eventChosen.slice(0, 4);
    const eventMonth = eventChosen.slice(5, 7);
    const eventDay = eventChosen.slice(8, 10);
    eventfulDateString = `${eventYear}${eventMonth}${eventDay}00-${eventYear}${eventMonth}${eventDay}00`;
    getEventfulEvents();

    //Gets TicketMaster Data as well
    tmDateString = `${eventChosen}:00Z`;
    tmDateString2 = eventChosen.slice(0, 11) + `23:59:59Z`;
    getTicketMasterEvents();
});