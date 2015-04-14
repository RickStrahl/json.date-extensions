/*
 * JSON Date Extensions - JSON date parsing extensions
 * Version 1.2.1
 * https://github.com/RickStrahl/json.date-extensions
 * (c) 2013-2015 Rick Strahl, West Wind Technologies
 *
 * Released under MIT License
 * http://en.wikipedia.org/wiki/MIT_License
 */
(function (undefined) {
    "use strict"; 
        
    if (JSON && !JSON.dateParser) {
        var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.{0,1}\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

        /// <summary>
        /// set this if you want MS Ajax Dates parsed
        /// before calling any of the other functions
        /// </summary>
        JSON.parseMsAjaxDate = false;

        JSON.useDateParser = function(reset) {
            /// <summary>
            /// Globally enables JSON date parsing for JSON.parse().
            /// Replaces the default JSON.parse() method and adds
            /// the datePaser() extension to the processing chain.
            /// </summary>    
            /// <param name="reset" type="bool">when set restores the original JSON.parse() function</param>

            // if any parameter is passed reset
            if (reset !== undefined) {
                if (JSON._parseSaved) {
                    JSON.parse = JSON._parseSaved;
                    JSON._parseSaved = null;
                }
            } else {
                if (!JSON._parseSaved) {
                    JSON._parseSaved = JSON.parse;
                    JSON.parse = JSON.parseWithDate;
                }
            }
        };

        /// <summary>
        /// Creates a new filter that processes dates and also delegates to a chain filter optionaly.
        /// </summary>    
        /// <param name="chainFilter" type="Function">property name that is parsed</param>
        /// <returns type="Function">returns a new chainning filter for dates</returns>
        var createDateParser = function(chainFilter) {
            return function(key, value) {
                var parsedValue = value;
                if (typeof value === 'string') {
                    var a = reISO.exec(value);
                    if (a) {
                        parsedValue = new Date(value);
                    } else if (JSON.parseMsAjaxDate) {
                        a = reMsAjax.exec(value);
                        if (a) {
                            var b = a[1].split(/[-+,.]/);
                            parsedValue = new Date(b[0] ? +b[0] : 0 - +b[1]);
                        }
                    }
                }
                if (chainFilter !== undefined)
                    return chainFilter(key, parsedValue);
                else
                    return parsedValue;
            };
        }

        /// <summary>
        /// A filter that can be used with JSON.parse to convert dates.
        /// </summary>    
        /// <param name="key" type="string">property name that is parsed</param>
        /// <param name="value" type="any">property value</param>
        /// <returns type="date">returns date or the original value if not a date string</returns>
        JSON.dateParser = createDateParser();

        JSON.parseWithDate = function(json, chainFilter) {
            /// <summary>
            /// Wrapper around the JSON.parse() function that adds a date
            /// filtering extension. Returns all dates as real JavaScript dates.
            /// </summary>    
            /// <param name="json" type="string">JSON to be parsed</param>
            /// <returns type="any">parsed value or object</returns>
            var parse = JSON._parseSaved ? JSON._parseSaved : JSON.parse;
            try {
                var res = parse(json, createDateParser(chainFilter));
                return res;
            } catch (e) {
                // orignal error thrown has no error message so rethrow with message
                throw new Error("JSON content could not be parsed");
            }
        };

        JSON.dateStringToDate = function(dtString, nullDateVal) {
            /// <summary>
            /// Converts a JSON ISO or MSAJAX date or real date a date value.
            /// Supports both JSON encoded dates or plain date formatted strings
            /// (without the JSON string quotes).
            /// If you pass a date the date is returned as is. If you pass null
            /// null or the nullDateVal is returned.
            /// </summary>    
            /// <param name="dtString" type="var">Date String in ISO or MSAJAX format</param>
            /// <param name="nullDateVal" type="var">value to return if date can't be parsed</param>
            /// <returns type="date">date or the nullDateVal (null by default)</returns> 
            if (!nullDateVal)
                nullDateVal = null;
            
            if (!dtString)
                return nullDateVal; // empty

            if (dtString.getTime)
                return dtString; // already a date
            
            if (dtString[0] === '"' || dtString[0] === "'")
                // strip off JSON quotes
                dtString = dtString.substr(1, dtString.length - 2);

            var a = reISO.exec(dtString);
            if (a)
                return new Date(dtString);

            if (!JSON.parseMsAjaxDate)
                return nullDateVal;

            a = reMsAjax.exec(dtString);
            if (a) {
                var b = a[1].split(/[-,.]/);
                return new Date(+b[0]);
            }
            return nullDateVal;
        };
    }
})();
