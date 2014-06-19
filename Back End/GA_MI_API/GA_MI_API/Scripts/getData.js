var getData = {};
getData.ready = false;
getData.account = "";
getData.profile = "";
getData.progress = 0; // 0 = authenticating, 1 = getting need/want list, 2= getting data, 3=resting
getData.displayMessage = "";
getData.queryingGA = false;
getData.loop = function () {
    getData.looping = setInterval(getData.isReady, 500);
}
getData.needListPass = function () {
    clearInterval(getData.looping);
    if (getData.needList.length > 0) {
        var params = {};
        params.profileId = getData.profile;
        params.real_date = getData.needList[0].real_date.substr(0,10);
        params.metric = getData.needList[0].metric;
        getData.needList.splice(0, 1);
        getData.displayMessage = getData.needList.length + " background tasks left to process";
        getData.updateCustomer();
        getData.pullFromGoogle(params);
    } else {
        getData.progress++;
        getData.loop();
    }
}

getData.updateCustomer = function () {
    var customerUpdate = document.getElementById("customerUpdate");
    customerUpdate.innerHTML = getData.displayMessage;
}

getData.isReady = function () {
    if (getData.progress == 0) {
        getData.displayMessage = "Ready";
        if (getData.account != "" && getData.profile != "") {
            getData.ready = true;
            getData.progress++;
            dash.newQuery("chartHolder", "monthly");
        }
    }
    if (getData.progress == 1) {
        getData.displayMessage = "Getting list of required background tasks";
        dsdConn.get();
    }
    if (getData.progress == 2) {
        getData.needListPass();
    }
    if (getData.progress == 3) {
        getData.displayMessage = "All background tasks have been processed";
        clearInterval(getData.looping);
    }
    if (getData.progress == 5) {
        clearInterval(getData.looping);
        getData.displayMessage = "Background processing failed";
    }
    getData.updateCustomer();
}
getData.pullFromGoogle = function (params) {
    var metricAdd = "";
    if(params.metric=='ga:pageviews'){metricAdd = ',ga:pagepath'}
    gapi.client.analytics.data.ga.get({
        'ids': 'ga:' + params.profileId
        , 'start-date': params.real_date
        , 'end-date': params.real_date
        , 'dimensions': 'ga:year,ga:month,ga:day,ga:hour' + metricAdd
        , 'metrics': params.metric
    }).execute(printResults);
}

function printResults(results) {
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
    getData.results = records;
    var json = JSON.stringify(getData.results);
    dsdConn.post(json);
}

var dsdConn = {};
dsdConn.get = function () {
    var xmlHTTP;
    if (window.XMLHttpRequest) {
        xmlHTTP = new window.XMLHttpRequest;
    } else {
        alert("This service will not work with your browser");
    }
    xmlHTTP.open("GET", "api/values", true);
    xmlHTTP.send();
    xmlHTTP.onreadystatechange = function () {
        if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200) {
            getData.needList = eval( "(" + xmlHTTP.response + ")");
            getData.progress++
        }
        if (xmlHTTP.readyState == 4 && xmlHTTP.status != 200) { alert(xmlHTTP.status); getData.progress = 5 }
    }
}
dsdConn.post = function (json) {
    var xmlHTTP;
    if (window.XMLHttpRequest) {
        xmlHTTP = new window.XMLHttpRequest;
    } else {
        alert("This service will not work with your browser");
    }

    xmlHTTP.open("POST", "api/values", true);
    xmlHTTP.setRequestHeader("Content-type", "application/json");
    xmlHTTP.send(json);

    xmlHTTP.onreadystatechange = function () {
        if (xmlHTTP.readyState == 4 && xmlHTTP.status == 200) { 
            //console.log(xmlHTTP.response);
            getData.needListPass();
        }
        if (xmlHTTP.readyState == 4 && xmlHTTP.status != 200) { 
            //console.log(xmlHTTP.status + " " + xmlHTTP.statusText);
            getData.needListPass();
        }
    }
}
getData.loop();