/// <reference path="http://code.jquery.com/jquery-1.10.2.min.js" />
/// <reference path="../src/json.date-extensions.js" />

// Date Parser Extension
test("dateParserExtension", function () {
    var date = new Date();
    var json = JSON.stringify(date);

    var date2 = JSON.parse(json, JSON.dateParser);
    console.log(date2);

    equal(!date2.getTime, false, "Date should be a date object");
    equal(date2.toString(), date.toString(), "Dates should be equal");
});


// Date Parser Extension with object dates
test("dateParserExtensionObject", function () {
    var obj = {
        id: "141923asd1",
        name: "rick",
        entered: new Date(),
        updated: new Date()
    };
    var json = JSON.stringify(obj);

    var obj2 = JSON.parse(json, JSON.dateParser);

    equal(!obj2.entered.getTime, false, "Date should be a date object");
    equal(obj2.entered.toString(), obj.entered.toString(), "Dates should be equal");
});

test("parseWithDate", function () {
    var date = new Date();
    var json = JSON.stringify(date);

    var date2 = JSON.parseWithDate(json);
    console.log(date2);

    equal(!date2.getTime, false, "Date should be a date object");
    equal(date2.toString(), date.toString(), "Dates should be equal");
});


test("parseWithDateObject", function () {
    var obj = {
        id: "141923asd1",
        name: "rick",
        entered: new Date(),
        updated: new Date()
    };
    var json = JSON.stringify(obj);

    var obj2 = JSON.parseWithDate(json);

    equal(!obj2.entered.getTime, false, "Date should be a date object");
    equal(obj2.entered.toString(), obj.entered.toString(), "Dates should be equal");
});


// useDateParser global replace operation
test("useDateParser", function () {
    // enable global JSON parsing
    JSON.useDateParser();

    var date = new Date();
    var json = JSON.stringify(date);

    // using just plain JSON.parse() should decode dates
    var date2 = JSON.parse(json);
    console.log(date2);

    equal(!date2.getTime, false, "Date should be a date object");
    equal(date2.toString(), date.toString(), "Dates should be equal");

    // replace original parser
    JSON.useDateParser();
});


test("dateStringToDateJson", function () {
    var date = new Date();
    var json = JSON.stringify(date);

    var date2 = JSON.dateStringToDate(json);

    console.log(date2);
    equal(date2.toString(), date.toString(), "Deserialized date should match original date");
});

test("dateStringToDateString", function () {

    var date2 = JSON.dateStringToDate("2014-01-01T13:13:34.441Z");

    equal(!date2.getTime, false, "Deserialized date string should be a date");
});

test("dateStringToDateDate", function () {

    var date2 = JSON.dateStringToDate(new Date());

    equal(!date2.getTime, false, "Deserialized date string should be a date");
});

test("dateStringToDateNull", function () {

    var date2 = JSON.dateStringToDate(null);    
    equal(!date2, true, "Date should be null");
});


// jQuery JSON from AJAX
test("useDateParserAjax", function () {
    JSON.useDateParser();
    stop();

    $.getJSON("JsonWithDate.txt")
        .done(function (data) {
            console.log("jquery result.entered: " + data.entered +
                "  result.updated: " + data.updated);
            equal(!data.entered.getTime, false, "Entered should be a date");
        })
        .success(function () {
            start();
            // replace original parser
            JSON.useDateParser(false);
        });

});