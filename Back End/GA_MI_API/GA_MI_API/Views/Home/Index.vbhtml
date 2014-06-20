<body>
    <div id="titleHold">
        <div id="title">IEP Analytics</div>
        <button id="authorize-button" style="visibility: hidden">Log in</button><br/>
    </div>
    <div id="reportBody">
        <div id="myControls" style="display:none">
            <div id="controlsTitle">
                Select your reports
            </div>
            <div>
                <table>
                    <tr>
                        <td>Start Date</td>
                        <td><input id="startDate" type="text" onchange="dash.changedParam()"/></td>
                        <td class="guide">YYYY-MM-DD</td>
                    </tr>
                    <tr>
                        <td>End Date</td>
                        <td><input id="endDate" type="text" onchange="dash.changedParam()"/></td>
                        <td class="guide">YYYY-MM-DD</td>
                    </tr>
                    <tr>
                        <td>Options</td>
                        <td>
                            <select id="metric" onchange="dash.changedParam()">
                                <option>Sessions</option>
                                <option>Users</option>
                                <option>Page Views</option>
                            </select>
                        </td>
                        <td class="guide"></td>
                    </tr>
                </table>
            </div>
        </div>
    
        <div id="chartHolder"></div>
        <div id="tableHolder"></div>

    </div>
    <!-- These JavaScript files will be created later on in the tutorial -->
    @Scripts.Render("~/scripts/json3.min.js")
    @Scripts.Render("~/scripts/getData.js")
    @Scripts.Render("~/scripts/api_v3.js")
    @Scripts.Render("~/scripts/auth_api_v3.js")
    @Scripts.Render("~/scripts/dashboard.js")
      
    <div id="customerUpdate"></div>
    <!-- Load the Client Library. Use the onload parameter to specify a callback function -->
    <script src="https://apis.google.com/js/client.js?onload=handleClientLoad"></script>
    <button id="make-api-call-button" style="visibility: hidden">Get Sessions</button>
    
  </body>