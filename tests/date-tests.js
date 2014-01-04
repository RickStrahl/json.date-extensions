// default json behavior test - date as string
test("defaultJson", function () {
    var date = new Date();
    var json = JSON.stringify(date);
    console.log("JSON: " + json);

    var date2 = JSON.parse(json);
    console.log("Result (string): " + date2);

    equal(typeof (date2) === "string", true, "Date should result in a string");
});

// using date constructor to convert JSON parsed date
test("decodeJsonDate", function () {
    var date = new Date();
    var json = JSON.stringify(date);
    var dateStr = JSON.parse(json);

    console.log(dateStr); // 2014-01-01T23:28:56.782Z

    var date2 = new Date(dateStr);
    console.log(date2);  // Wed Jan 01 2014 13:28:56 GMT-1000 (Hawaiian Standard Time)         

    equal(!date2.getTime, false, "Date should be a date object");
    equal(date2.toString(), date.toString(), "Dates should be equal");
});
