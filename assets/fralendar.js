//Object which holds everyone's freetime
let freetime = {};
let userFreeTime = {};

// Array for getting current day and next 6 days
const daysOfWeek = [
    moment().format("dddd"),
    moment().add(1, "days").format("dddd"),
    moment().add(2, "days").format("dddd"),
    moment().add(3, "days").format("dddd"),
    moment().add(4, "days").format("dddd"),
];

//array for getting current date and next 6 dates
const dayNum = [
    moment().date(),
    moment().add(1, "days").date(),
    moment().add(2, "days").date(),
    moment().add(3, "days").date(),
    moment().add(4, "days").date(),
];

const timeStamps = [6, 12, 18]

// array for out button value names
const timeOfDay = ["Morning", "Afternoon", "Night"]

// creating a div to append all days to (Sunday-Saturday)
const firstRowDiv = $("<div>")
firstRowDiv.attr({ "id": "calanderWeek" })
firstRowDiv.addClass("row")

// we have this slot because bootstrap requires 12 column slots (7 days * 1 slot each ) = 4 remaing slots
firstRowDiv.prepend(`<div class="col-md-1"></div>`);

// for loop to dynamically create the days along with any added attr
for (let i = 0; i < daysOfWeek.length; i++) {
    const dayDiv = $("<div>")
    dayDiv.attr({ "id": daysOfWeek[i] })
    dayDiv.addClass(["week", "text-center", "col-md-2"])
    dayDiv.text(daysOfWeek[i])

    firstRowDiv.append(dayDiv);
}
// Same as other div added above, we now have 12 column required per bootstrap
firstRowDiv.append(`<div class="col-md-1"></div>`)

// append this row to html doc
$(".calendarHTML").append(firstRowDiv);

// creating second row for our dates/buttons along with attr
const secondRowDiv = $("<div>")
secondRowDiv.attr({ "id": "secondRow" })
secondRowDiv.addClass(["row", "text-center"])

// With 4 slot remaing in columns this div will be used for calendar purposes
secondRowDiv.prepend(`<div class="col-md-1"></div>`)

// Loop to dynamically create of dates

for (let j = 0; j < dayNum.length; j++) {
    const dayOfTheWeek = $("<div>");
    dayOfTheWeek.addClass(["day", "col-md-2"]);
    // this will dynamically give us text for current day + next 6 days
    dayOfTheWeek.text(dayNum[j]);

    //loop to generate the 3 buttons in our dates
    for (let k = 0; k < 3; k++) {
        const calendarItem = $("<div>");
        calendarItem.addClass([`calendar-item`]);
        // Line will output
        // id : "Specific Day + Specific Time"
        // value: 0 initial starting value
        // data-unix: Specific date with specific time of day
        calendarItem.attr({
            "id": daysOfWeek[j] + timeOfDay[k],
            "data-unix": moment().startOf("day").add(j, "days").add(timeStamps[k], "hours").format()
        });
        calendarItem.val(0)

        // will display the time of day (Morning, Afternoon, Night)
        calendarItem.text(timeOfDay[k]);
        dayOfTheWeek.append(calendarItem);
    }
    secondRowDiv.append(dayOfTheWeek);
}
var eventRow = $("<div>")
eventRow.addClass(["row", "eventDisplay"]);

// again extra 2 column can do whatever with this
secondRowDiv.append(`<div class="col-md-1"></div>`)

//append to html doc
$(".calendarHTML").append(secondRowDiv);

// listener event for buttons 
//TODO Start here. Not writing to firebase and the colors are all strange
$(`body`).on("click", ".calendar-item", function () {
    var value = $(this).val();
    console.log(value)
    // changes value on button to "1" signifying they are available
    if (value === "0") {
        $(this).val("1")
        $(this).removeClass("btn-danger")
        $(this).addClass("btn-success");
    }
    // changes value on button to "0" or false signifying they are unavailable
    if (value === "1") {
        $(this).val("0")
        $(this).removeClass("btn-success")
        $(this).addClass("btn-danger")
    }
});

const updateCalendar = () => {
    for (let key in userFreeTime) {
        if (userFreeTime[key] == 1) {
            $(`.btn .btn-block .calendar-btn .` + key).val("1")
            $(`.` + key).removeClass("btn-danger")
            $(`.` + key).addClass("btn-success");
        }
    }
}

//Gets the User Calendar when authstatechanges from the login page
const getUserCalendar = () => {
    firebase.database().ref(`/freetime/${user.ID}`).once("value").then(function (snap) {
        userFreeTime = {};
        userFreeTime = snap.val();
        getUserFreeTimeArray();
        updateCalendar();
    });
};

//This sets a time to the first time available of the first day the user logs in so they then can write to the calendar in the future.
const addNewUserToCalendar = () => {
    const dummyTime = moment().startOf("day").add(0, "days").add(timeStamps[0], "hours").format()
    userFreeTime = { [dummyTime]: "0" }
    firebase.database().ref(`/freetime/${user.ID}`).set(userFreeTime);
};

//Adds a listener to freetime so when new freetime is selected it pulls to the object
firebase.database().ref("/freetime/").on("value", function (snap) {
    freetime = snap.val();
    getUserFreeTimeArray();
});

$(".calendar-btn").on("click", function () {
    //Pulls the value and the ID from each button to be used in firebase
    const buttonTime = $(this).val();
    //This adds the time as the key in firebase
    const attribute = $(this).attr(`data-unix`);
    freetime[user.ID] = {};
    userFreeTime[attribute] = buttonTime;
    freetime[user.ID] = userFreeTime;
    firebase.database().ref(`/freetime/`).set(freetime);
    $(".eventbtn").empty();
    getUserFreeTimeArray();
});

//Reads the freetime object and checks if there are any times which line up
const getUserFreeTimeArray = () => {
    $(".eventbtn").empty();
    let friendFreeTime = {};
    const friendFreeTimeArray = [];
    const writtenFreeTime = [];
    const userFreeTimeArray = [];

    //Creates a user array for the user's free time which then we compare to the other user's free time.
    for (let key in userFreeTime) {
        if (userFreeTime[key] === "1") {
            userFreeTimeArray.push(key);
        };
    };
    //Populates a list of other user's free time while making sure it doesn't select your user ID.
    for (let key in freetime) {
        if (key !== user.ID) {
            friendFreeTime = freetime[key];
        };
        for (let j in friendFreeTime) {
            if (friendFreeTime[j] === "1") {
                friendFreeTimeArray.push(j);
            };
        };

        for (let i = 0; i < friendFreeTimeArray.length; i++) {
            //This checks if the free time that you've selected lines up with any one of your friends free times
            //The and statment checks if that button has already been written to the dom
            if (userFreeTimeArray.includes(friendFreeTimeArray[i]) && !writtenFreeTime.includes(friendFreeTimeArray[i])) {
                writtenFreeTime.push(friendFreeTimeArray[i]);
                const eventBtn = $("<button>")
                eventBtn.addClass(["SimilarFreeTime", "btn", "btn-success"])
                eventBtn.attr({
                    value: friendFreeTimeArray[i].slice(0, 16)
                })

                // variable will hold the month the event takes place
                const eventMonth = friendFreeTimeArray[i].slice(5, 7);

                // variable will hold the day the event takes place
                const eventDay = friendFreeTimeArray[i].slice(8, 10);
                const eventHour = friendFreeTimeArray[i].slice(11, 13);
                const eventMin = friendFreeTimeArray[i].slice(14, 16);

                eventBtn.text(`${eventMonth}/${eventDay} ${eventHour}:${eventMin}`)
                $(".eventbtn").append(eventBtn)
            };
        };
    };
};
