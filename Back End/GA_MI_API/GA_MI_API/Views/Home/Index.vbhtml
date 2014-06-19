<body>
    <!-- The 2 Buttons for the user to interact with -->
    <button id="authorize-button" style="visibility: hidden">Authorize</button><br/>
    <button id="make-api-call-button" style="visibility: hidden">Get Sessions</button>
    <div id="customerUpdate"></div>

    <div id="controls">
        <div>
            <table>
                <tr>
                    <td>Start Date</td>
                    <td><input id="startDate" type="text" /></td>
                </tr>
                <tr>
                    <td>End Date</td>
                    <td><input id="endDate" type="text" /></td>
                </tr>
                <tr>
                    <td>End Date</td>
                    <td>
                        <select id="metric">
                            <option>Sessions</option>
                            <option>Users</option>
                            <option>Page Views</option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    
    <div id="chartHolder"></div>


    <!-- These JavaScript files will be created later on in the tutorial -->
    @Scripts.Render("~/scripts/json3.min.js")
    @Scripts.Render("~/scripts/getData.js")
    @Scripts.Render("~/scripts/api_v3.js")
    @Scripts.Render("~/scripts/auth_api_v3.js")
    @Scripts.Render("~/scripts/dashboard.js")
      
    
    <!-- Load the Client Library. Use the onload parameter to specify a callback function -->
    <script src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>
  

  </body>