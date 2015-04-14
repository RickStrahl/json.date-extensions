
# JSON Parser Date Extensions
#### Date parsing extensions for the JavaScript JSON parser to provide real JavaScript dates from JSON.parse()####

This small JavaScript library provides for automatically parsing JSON date strings 
to real JavaScript dates as part of regular JSON parsing. 
You can parse either individual date values or complex objects containing dates
and have them automatically turned into dates, unlike the default JSON parser
behavior of parsing to ISO 8601 date strings. 

You can either manually run the date parsing or replace the JSON parser 
for the global scope to force *all* JSON operations to parse dates 
automatically, including those by other frameworks such as jQuery, angularJS etc.

This library came about as part of the following blog post:
* **[JavaScript JSON Date Parsing and real Dates](http://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates)**

This library provides:

* **JSON.dateParser**<br/>
  JSON parser extension that can be used with JSON.parse() 
  to parse dates with explicit calls to JSON.parse().

* **JSON.parseWithDate()**<br/>
  Function to provide a wrapper function
  that behaves like JSON.parse() but parses dates.

* **JSON.useDateParser()**<br/> 
  Globally replace JSON.parse() with
  JSON.parseWithDates to affect all JSON.parse() operations within
  the current page/scope. Affects all JSON operations including 
  framework JSON parsing such as jQuery.getJSON(), 
  Angular $http functions etc.

* **JSON.dateStringToDate()**<br/> 
  Safely converts JSON ISO and MSAJAX
  dates, raw ISO and MSAJAX string values and dates to JavaScript
  dates. This function is a simple helper to guarantee you get a 
  date value regardless of which format the date is in with an optional
  override to return a known value if the date can't be resolved.

## Installation
You can either use the files out of the `dist` folder directly or you
can install the files via Bower:

	bower install json.date-extensions

## Usage
This library provides a simple API for changing the behavior of the JSON parser. You can either explicitly parse JSON data using provided functions or change the behavior of the parser globally.

### JSON.parseWithDate ###
Manual JSON parsing with automatic date conversion:

```javascript
var date = new Date();
var json = JSON.stringify(date);

var date2 = JSON.parseWithDate(json);
console.log(date2);   // date: Wed Jan 01 2014 13:28:56 GMT-1000 (Hawaiian Standard Time) 
```

Likewise you can apply that to complex objects that contain dates:

```javascript
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
```


### JSON.useDateParser ###
useDateParser() can globally replace the JSON.parse() function with the
JSON.parseWithDate() function, which results in automatically converting dates
for all JSON operations on the global scope. This allows automatic conversions
for all subsequent JSON.parse() calls including those inside of frameworks.

```javascript
// enable global JSON date parsing
JSON.useDateParser();
       
var date = new Date();
var json = JSON.stringify(date);

// using just plain JSON.parse() should decode dates
var date2 = JSON.parse(json);
console.log(date2);

equal(!date2.getTime, false, "Date should be a date object");
equal(date2.toString(), date.toString(), "Dates should be equal");

// optionally replace original parser
JSON.useDateParser(false);
```

The following example demonstrates using $.getJSON() with automatic
date conversion:

```javascript
// enable global JSON date parsing
JSON.useDateParser();    

$.getJSON("JsonWithDate.txt")
    .done(function(data) {
        console.log("jquery result.entered: " + data.entered +
            "  result.updated: " + data.updated);

        equal(!data.entered.getTime, false, "Entered should be a date");            
    })
    .success(function () {        
        // Optionally replace original parser
        JSON.useDateParser(false);
    });
```

### JSON.dateParser ###
dateParser is the JSON parse extension that is used to filter dates from
date strings. You can use this filter directly with JSON.parse() although
I'd recommend you use JSON.parseWithDate() instead.

```javascript
var obj = {
    id: "141923asd1",
    name: "rick",
    entered: new Date(),
    updated: new Date()
};
var json = JSON.stringify(obj);

var obj2 = JSON.parse(json, JSON.dateParser);

console.log(obj2.entered,obj2.updated);
```

### JSON.dateStringToDate ###
dateStringToDate reliably provides JavaScript dates from JSON dates strings,
plain strings in ISO or MS AJAX formats or dates. Useful when you are not
converting JSON dates automatically and you need to be sure you always get
consistent date values in code.

All of the following should produce a date:

```javascript
var date = new Date();
var json = JSON.stringify(date);

// JSON date
var date2 = JSON.dateStringToDate(json);
console.log(date2);  

// string ISO date
date2 = JSON.dateStringToDate("2014-01-01T13:13:34.441Z");
console.log(date2);

date2 = JSON.dateStringToDate("2014-01-01T13:13:34.441Z");
console.log(date2);

// real date - just echoed back
date2 = JSON.dateStringToDate(new Date());
console.log(date2);
```