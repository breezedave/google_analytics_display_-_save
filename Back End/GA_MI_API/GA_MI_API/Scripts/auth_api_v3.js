var clientId = '322876015263-24nc1splan07oqm0gni9nu8rnohf60go.apps.googleusercontent.com';
var apiKey = 'AIzaSyC_8dWztKhJ-f7ny-m7jOeBXZ0gfqxhMqk';
var scopes = 'https://www.googleapis.com/auth/analytics.readonly';
var authTried = false;

// This function is called after the Client Library has finished loading
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
}


function checkAuth() {
    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult);
}


function handleAuthResult(authResult) {
    if (authTried) {
        // The user has authorized access
        // Load the Analytics Client. This function is defined in the next section.
        loadAnalyticsClient();
    } else {
        // User has not Authenticated and Authorized
        handleUnAuthorized();
        authTried=true;
    }
}


// Authorized user
function handleAuthorized() {
    var authorizeButton = document.getElementById('authorize-button');
    var makeApiCallButton = document.getElementById('make-api-call-button');

    //makeApiCallButton.style.visibility = '';
    authorizeButton.style.visibility = 'hidden';
    makeApiCall()
}


// Unauthorized user
function handleUnAuthorized() {
    var authorizeButton = document.getElementById('authorize-button');
    var makeApiCallButton = document.getElementById('make-api-call-button');

    makeApiCallButton.style.visibility = 'hidden';
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
}


function handleAuthClick(event) {
    getData.displayMessage = "Authenticating access with Google";
    getData.updateCustomer();
    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false }, handleAuthResult);
    return false;
}


function loadAnalyticsClient() {
    // Load the Analytics client and set handleAuthorized as the callback function
    gapi.client.load('analytics', 'v3', handleAuthorized);
}