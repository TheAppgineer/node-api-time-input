// Copyright 2017 The Appgineer
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

function ApiTimeInput() {
}

ApiTimeInput.prototype.validate_time_string = function(time_string, allow_relative) {
    let relative = (time_string.charAt(0) == "+");

    if (relative && allow_relative != true) {
        return null;
    }

    let valid_time_string = time_string.substring(relative);
    let separator_index = valid_time_string.indexOf(":");
    let hours = "0";

    // Extract hours
    if (separator_index == 1 || separator_index == 2 ) {
        hours = valid_time_string.substring(0, separator_index);
    } else if (relative) {
        // Outside expected range, no hours specified
        separator_index = -1;
    } else {
        return null;
    }

    // Extract minutes
    let minutes = valid_time_string.substring(separator_index + 1, separator_index + 3);

    // Check ranges
    if (isNaN(hours) || hours < 0 || hours > 23) {
        return null;
    }

    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
        return null;
    }

    // Extract 24h/12h clock type
    let is_am = false;
    let is_pm = false;
    let am_pm = "";

    if (!relative) {
        let am_pm_index = separator_index + 1 + minutes.length;
        am_pm = valid_time_string.substring(am_pm_index, am_pm_index + 2);
        is_am = (am_pm.toLowerCase() == "am");
        is_pm = (am_pm.toLowerCase() == "pm");

        // Check hour range
        if (is_am || is_pm) {
            if (hours < 1 || hours > 12) {
                return null;
            }
        }
    }

    if (hours.length == 1) {
        hours = "0" + hours;
    }

    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }

    // Create human readable string
    let friendly = (relative ? "+" : "") + hours + ":" + minutes;
    if (is_am || is_pm) {
        friendly += am_pm;
    }

    // Convert to 24h clock type
    if (is_am && hours == 12) {
        hours -= 12;
    } else if (is_pm && hours < 12) {
        hours = +hours + 12;
    }

    return {
        relative: relative,
        hours:    +hours,
        minutes:  +minutes,
        friendly: friendly
    };
}

exports = module.exports = ApiTimeInput;
