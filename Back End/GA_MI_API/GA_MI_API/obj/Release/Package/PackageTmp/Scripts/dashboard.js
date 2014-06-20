var dash = {};

dash.startDate = "2014-03-31";
dash.endDate = "2014-05-30";
dash.metric = "ga:pageviews";
dash.period = "monthly";
var elemStartDate = document.getElementById('startDate');
var elemEndDate = document.getElementById('endDate');
var elemMetric = document.getElementById('metric');
elemStartDate.value = dash.startDate;
elemEndDate.value = dash.endDate;
var opts = elemMetric.options;
for (var i = 0; i < opts.length; i++) {
    if (opts[i].innerHTML.toLowerCase().replace(" ", "") == dash.metric.substr(3, 100)) {
        elemMetric.selectedIndex = i;
        break;
    }
}


dash.changedParam = function () {
    dash.startDate = elemStartDate.value;
    dash.endDate = elemEndDate.value;
    dash.metric = "ga:" + String(elemMetric.childNodes[(elemMetric.selectedIndex*2)+1].innerHTML).toLowerCase().replace(" ", "");
	dash.newQuery("chartHolder", dash.period);
}

dash.loadResults = function (results) {
    if (!results.error) {
        if (results.rows && results.rows.length) {
            var records = [];
            for (var i = 0; i < results.rows.length; i++) {
                var row = {};
                for (var i2 = 0; i2 < results.rows[i].length; i2++) {
                    if (results.columnHeaders[i2].name == 'ga:year') { row.year = results.rows[i][i2] };
                    if (results.columnHeaders[i2].name == 'ga:month') { row.month = results.rows[i][i2] };
                    if (results.columnHeaders[i2].name == 'ga:day') { row.day = results.rows[i][i2] };
                    if (results.columnHeaders[i2].name == 'ga:hour') { row.hour = results.rows[i][i2] };
                    if (results.columnHeaders[i2].name == 'ga:pagepath') { row.pagepath = results.rows[i][i2] };
                    if (results.columnHeaders[i2].name == 'ga:sessions') { row.sessions = results.rows[i][i2] };
                    if (results.columnHeaders[i2].name == 'ga:users') { row.users = results.rows[i][i2] };
                    if (results.columnHeaders[i2].name == 'ga:pageviews') { row.pageviews = results.rows[i][i2] };
                }
                records.push(row);
            }
        } else {
            //console.log('No results found');
        }
    }
    var params = { boxInside: dash.boxInside };
    dash.createColChart(records, params);
}




dash.createBox = function (opts) {
    var box = document.createElement('div');
    box.style.width = opts.boxWidth;
    box.style.height = opts.boxHeight;
    box.style.borderWidth = opts.boxBorderWidth;
    box.style.borderColor = opts.boxBorderColor;
    box.style.borderStyle = opts.boxBorderStyle;
    box.style.backgroundColor = opts.boxBackgroundColor;
    box.style.position = "relative";
    return box;
}

dash.createButtons = function (opts) {
    var buttonHolder = document.createElement('div');
    buttonHolder.style.width = (parseFloat(opts.buttonWidth)) * 5 + "px";
    buttonHolder.style.textAlign = "right";
    buttonHolder.style.height = opts.buttonHeight;
    buttonHolder.style.position = "absolute";
    buttonHolder.style.top = opts.axisPadding / 4 + "px";
    buttonHolder.style.right = opts.axisPadding / 4 + "px";

    var yearly = document.createElement('div');
    yearly.style.backgroundColor = opts.buttonColor;
    yearly.style.height = opts.buttonHeight;
    yearly.style.width = opts.buttonWidth;
    yearly.style.borderWidth = "1px";
    yearly.style.borderStyle = "Solid";
    yearly.style.borderColor = opts.buttonBorderColor;
    yearly.style.textAlign = "center";
    yearly.style.marginRight = "-1px";
    yearly.className = "button"
    yearly.innerHTML = "Yearly";
    yearly.onclick = function () { dash.newQuery(opts.boxInside, "yearly") }
    buttonHolder.appendChild(yearly);

    var monthly = document.createElement('div');
    monthly.style.backgroundColor = opts.buttonColor;
    monthly.style.height = opts.buttonHeight;
    monthly.style.width = opts.buttonWidth;
    monthly.style.borderWidth = "1px";
    monthly.style.borderStyle = "Solid";
    monthly.style.borderColor = opts.buttonBorderColor;
    monthly.style.textAlign = "center";
    monthly.style.marginRight = "-1px";
    monthly.className = "button"
    monthly.innerHTML = "Monthly";
    monthly.onclick = function () { dash.newQuery(opts.boxInside, "monthly") }
    buttonHolder.appendChild(monthly);


    var daily = document.createElement('div');
    daily.style.backgroundColor = opts.buttonColor;
    daily.style.height = opts.buttonHeight;
    daily.style.width = opts.buttonWidth;
    daily.style.borderWidth = "1px";
    daily.style.borderStyle = "Solid";
    daily.style.borderColor = opts.buttonBorderColor;
    daily.style.textAlign = "center";
    daily.style.marginRight = "-1px";
    daily.className = "button"
    daily.innerHTML = "Daily";
    daily.onclick = function () { dash.newQuery(opts.boxInside, "daily") }
    buttonHolder.appendChild(daily);


    var hourly = document.createElement('div');
    hourly.style.backgroundColor = opts.buttonColor;
    hourly.style.height = opts.buttonHeight;
    hourly.style.width = opts.buttonWidth;
    hourly.style.borderWidth = "1px";
    hourly.style.borderStyle = "Solid";
    hourly.style.borderColor = opts.buttonBorderColor;
    hourly.style.textAlign = "center";
    hourly.style.marginRight = "-1px";
    hourly.className = "button"
    hourly.innerHTML = "Hourly";
    hourly.onclick = function () { dash.newQuery(opts.boxInside, "hourly") }
    buttonHolder.appendChild(hourly);

    return buttonHolder;
}


dash.createYAxis = function (opts) {
    var yAxis = document.createElement('div');
    yAxis.style.width = opts.axisPadding + "px";
    yAxis.style.top = opts.axisPadding + "px";
    yAxis.style.left = "0px";
    yAxis.style.height = (parseFloat(opts.boxHeight) - opts.axisPadding * 2) + "px";
    yAxis.style.backgroundColor = opts.axisBackgroundColor;
    yAxis.style.position = "absolute";
    yAxis.style.borderRight = opts.axisBorderWidth + " " + opts.axisBorderStyle + " " + opts.axisBorderColor;
    return yAxis;
}

dash.createTitle = function (opts) {
    var title = document.createElement('div');
    title.style.width = parseFloat(opts.boxWidth) - opts.axisPadding + "px";
    title.style.top = "0px";
    title.style.left = opts.axisPadding + "px";
    title.style.height = opts.axisPadding / 4 * 3 + "px";
    title.style.paddingTop = opts.axisPadding / 4 + "px";
    title.style.position = "absolute";
    title.style.textAlign = "left";
    title.style.fontWeight = 700;
    title.innerHTML = opts.chartTitle;
    return title;
}


dash.createXAxis = function (opts) {
    var xAxis = document.createElement('div');
    xAxis.style.width = (parseFloat(opts.boxWidth) - opts.axisPadding * 2) + "px";
    xAxis.style.left = opts.axisPadding + "px";
    xAxis.style.height = opts.axisPadding + "px";
    xAxis.style.top = parseFloat(opts.boxHeight) - opts.axisPadding + "px";
    xAxis.style.backgroundColor = opts.axisBackgroundColor;
    xAxis.style.position = "absolute";
    xAxis.style.borderTop = opts.axisBorderWidth + " " + opts.axisBorderStyle + " " + opts.axisBorderColor;
    xAxis.style.verticalAlign = "middle";

    var label = document.createElement('div');
    label.style.width = "100%";
    label.style.height = "12px";
    label.style.textAlign = "center";
    label.style.paddingTop = (parseFloat(xAxis.style.height) - 12) / 2 + "px";
    label.innerHTML = opts.xAxisLabel;
    xAxis.appendChild(label);
    return xAxis;
}

dash.createShowVal = function () {
    var showVal = document.createElement('div');
    showVal.id = "showVal";
    showVal.style.position = "absolute";
    showVal.style.bottom = "0px";
    showVal.style.right = "0px";
    showVal.style.textAlign = "right";
    return showVal;
}

dash.createCol = function (opts) {
    var col = document.createElement('div');
    if (parseFloat(opts.colWidth) < 0) { col.style.width = "0px" } else { col.style.width = opts.colWidth };
    col.style.maxWidth = col.style.width;
    col.style.left = parseFloat(opts.colLeft) + opts.axisPadding + "px";
    if (parseFloat(opts.colHeight) < 0) { col.style.height = "0px" } else { col.style.height = opts.colHeight };
    col.style.maxHeight = col.style.height;
    col.style.top = (parseFloat(opts.boxHeight) - opts.axisPadding * 2) - parseFloat(opts.colHeight) + opts.axisPadding + "px";
    col.style.backgroundColor = opts.colBackgroundColor;
    col.style.position = "absolute";
    col.style.borderColor = opts.colBorderColor;
    col.style.borderWidth = opts.colBorderWidth;
    col.style.borderStyle = opts.colBorderStyle;
    if (opts.colVal == 0) {
        col.style.height = "0px";
        col.style.borderWidth = "0px";
    };
    col.alt = dash.cleanDate(opts.colDate, dash.period) + " - " + opts.colVal;
    col.onmouseover = function () { document.getElementById('showVal').innerHTML = this.alt };
    col.className = "col";

    var value = document.createElement('div');
    value.style.width = "100%";
    value.style.height = "20px";
    value.style.textAlign = "center";
    value.style.marginTop = "-20px";
    value.style.fontSize = "10px";
    value.style.backgroundColor = "transparent";
    value.innerHTML = opts.colVal;
    if (parseFloat(col.style.width) > 1) { col.appendChild(value) };


    var colLabel = document.createElement('div');
    colLabel.style.width = "100%";
    colLabel.style.height = "40px";
    colLabel.style.textAlign = "center";
    colLabel.style.marginTop = opts.colHeight;
    colLabel.style.fontSize = "10px";
    colLabel.style.backgroundColor = "transparent";
    colLabel.innerHTML = opts.colLabel;
    if (parseFloat(col.style.width) > 1) { col.appendChild(colLabel) };

    return col;
}

dash.newQuery = function (position, period) {
    var query = {}
    query.ids = "ga:" + getData.profile;
    query["start-date"] = dash.startDate;
    query["end-date"] = dash.endDate;
    query.metrics = dash.metric;
    if (period == "hourly") { query.dimensions = "ga:year,ga:month,ga:day,ga:hour" }
    if (period == "daily") { query.dimensions = "ga:year,ga:month,ga:day" }
    if (period == "monthly") { query.dimensions = "ga:year,ga:month" }
    if (period == "yearly") { query.dimensions = "ga:year" }
    dash.period = period;
    dash.pullFromGoogle(position, query);
}

dash.pullFromGoogle = function (position, query) {
    dash.boxInside = position;
    gapi.client.analytics.data.ga.get(query).execute(dash.loadResults);
}

dash.getDataDetail = function (data) {
	var detail = {};

	detail.max = (parseInt(data[0].sessions) || parseInt(data[0].users) || parseInt(data[0].pageviews) || 0);
	detail.tot = 0;
	detail.len = data.length;
	detail.yearly = false;
	detail.monthly = false;
	detail.daily = false;
	detail.minDate = new Date(data[0].year || 0, data[0].month - 1 || 0, data[0].day || 1, data[0].hour || 0, 0, 0, 0);
	detail.maxDate = detail.minDate;

	if (data[0].sessions) { detail.metric = "sessions" };
	if (data[0].users) { detail.metric = "users" };
	if (data[0].pageviews) { detail.metric = "pageviews" };

	for (var i = 0; i < data.length; i++) {
		data[i].val = (parseInt(data[i].sessions) || parseInt(data[i].users) || parseInt(data[i].pageviews)) || 0;
		var datum = new Date(data[i].year || 0, data[i].month - 1 || 0, data[i].day || 1, data[i].hour || 0, 0, 0, 0);
		if (data[i].val > detail.max) { detail.max = data[i].val };
		if (datum < detail.minDate) { detail.minDate = datum };
		if (datum > detail.maxDate) { detail.maxDate = datum };
		detail.tot += data[i].val;
	}
	detail.avg = parseFloat(detail.tot) / detail.len;
	detail.chartMax = parseInt(detail.max / Math.pow(10, String(detail.max).length - 1) + 1) * Math.pow(10, String(detail.max).length - 1);
	detail.period = dash.period;
	return detail;
}

dash.createColChart = function (data, params) {
    var detail = dash.getDataDetail(data);
    var opts = {
        boxHeight: "400px"
        , boxWidth: "800px"
        , boxBorderWidth: "2px"
        , boxBorderColor: "#BABABA"
        , boxBorderStyle: "Solid"
        , boxBackgroundColor: "#CBDEDE"
        , boxInside: "chartHolder"
        , axisBackgroundColor: "transparent"
        , axisBorderWidth: "2px"
        , axisBorderStyle: "Solid"
        , axisBorderColor: "#888888"
        , axisPadding: 40
        , colHeight: "200px"
        , colWidth: "20px"
        , colBorderWidth: "1px"
        , colBorderColor: "#333333"
        , colBorderStyle: "Solid"
        , colBackgroundColor: "#BC3412"
        , colLeft: "0px"
        , buttonWidth: "60px"
        , buttonHeight: "23px"
        , buttonColor: "#CDCDCD"
        , buttonBorderColor: "#888888"
    }

    for (opt in opts) {
        for (param in params) {
            if (param == opt) { opts[opt] = params[param] }
        }

    }
	
	opts.chartTitle = (detail.metric + " volumes: " + dash.cleanDate(detail.minDate, detail.period) + " - " + dash.cleanDate(detail.maxDate, detail.period)).replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	opts.xAxisLabel = (detail.period + " " + detail.metric + " volumes").replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

	var box = dash.createBox(opts);
	var yAxis = dash.createYAxis(opts);
	var xAxis = dash.createXAxis(opts);
	var title = dash.createTitle(opts);
	var buttons = dash.createButtons(opts);
	var showVal = dash.createShowVal();

	box.appendChild(yAxis);
	box.appendChild(xAxis);
	box.appendChild(title);
	box.appendChild(buttons);
	box.appendChild(showVal);

	for (var i = 0; i < data.length; i++) {
		opts.colHeight = (data[i].val / detail.chartMax * parseFloat(yAxis.style.height)) - (parseFloat(opts.colBorderWidth) * 2) + "px";
		opts.colWidth = ((parseFloat(opts.boxWidth) - opts.axisPadding * 2) / data.length) - (parseFloat(opts.colBorderWidth) * 2) + "px";
		opts.colLeft = ((parseFloat(opts.boxWidth) - opts.axisPadding * 2) / data.length) * i + "px";
		opts.colVal = data[i].val;
		opts.colDate = new Date(data[i].year || 0, data[i].month - 1 || 0, data[i].day || 1, data[i].hour || 0, 0, 0, 0)
		if (detail.period == "hourly") { opts.colLabel = data[i].hour };
		if (detail.period == "daily") { opts.colLabel = data[i].day };
		if (detail.period == "monthly") { opts.colLabel = data[i].month };
		if (detail.period == "yearly") { opts.colLabel = data[i].year };
		var col = dash.createCol(opts);
		box.appendChild(col);
	}

	var placement = document.getElementById(opts.boxInside) || document.getElementsByTagName(opts.boxInside)[0];
	placement.innerHTML = "";
	placement.appendChild(box);

}

dash.cleanDate = function (datum, period) {
    var d = datum.getDate();
    var y = datum.getFullYear();

    if (datum.getHours() < 12) {
        var longH = "00" + datum.getHours();
        var h = longH.substr(String(longH.length) - 2, 2) + "am";
    } else {
        var longH = "00" + (datum.getHours() - 12);
        var h = longH.substr(String(longH.length) - 2, 2) + "pm";
    }

    switch (datum.getMonth()) {
        case 0: var m = "Jan"; break;
        case 1: var m = "Feb"; break;
        case 2: var m = "Mar"; break;
        case 3: var m = "Apr"; break;
        case 4: var m = "May"; break;
        case 5: var m = "Jun"; break;
        case 6: var m = "Jul"; break;
        case 7: var m = "Aug"; break;
        case 8: var m = "Sep"; break;
        case 9: var m = "Oct"; break;
        case 10: var m = "Nov"; break;
        case 11: var m = "Dec"; break;
        default: var m = "NA";
    }
    switch (period) {
        case "hourly": var result = d + " " + m + " " + y + " " + h; break;
        case "daily": var result = d + " " + m + " " + y; break;
        case "monthly": var result = m + " " + y; break;
        case "yearly": var result = y; break;
    }

    return result;
}


