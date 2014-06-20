// Execute this function when the 'Make API Call' button is clicked
function makeApiCall() {
    //console.log('Starting Request Process...');
    queryAccounts();
}


function queryAccounts() {
    //console.log('Querying Accounts.');

    // Get a list of all Google Analytics accounts for this user
    gapi.client.analytics.management.accounts.list().execute(handleAccounts);
}


function handleAccounts(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {

            for(i=0;i<results.items.length;i++) {
                if (results.items[i].name == 'DVLA') {
                    var firstAccountId = results.items[i].id;
                    getData.account = firstAccountId;
                }
            }
            // Query for Web Properties
            queryProfiles(firstAccountId);

        } else {
            //console.log('No accounts found for this user.')
        }
    } else {
        //console.log('There was an error querying accounts: ' + results.message);
    }
}

function queryProfiles(accountId) {
    //console.log('Querying Views (Profiles).');

    // Get a list of all Views (Profiles) for the first Web Property of the first Account
    gapi.client.analytics.management.profiles.list({
        'accountId': accountId,
        'webPropertyId': '~all'
    }).execute(handleProfiles);
}


function handleProfiles(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {

            for (var i = 0; i < results.items.length; i++) {
                if (results.items[i].webPropertyId == 'UA-44719962-6') {
                    // Get the first View (Profile) ID
                    var firstProfileId = results.items[i].id;
                    getData.profile = firstProfileId;
                }
            }

        } else {
            //console.log('No views (profiles) found for this user.');
        }
    } else {
        //console.log('There was an error querying views (profiles): ' + results.message);
    }
}

