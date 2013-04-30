jQuery(document).ready(function() {
    // 
    var connector = new KD.bridges.BridgeConnector({templateId: BUNDLE.config.bridgeRecordKSRV});
    var attribArray = BUNDLE.config.bridgeRecordAttributes.split(/\s*,\s*/);
    var atrribShow = "";
    var attribDetails = "";

    // Create sort array from attributes
    var sortBy = BUNDLE.config.bridgeRecordSort.split(/\s*,\s*/);
    var attribSort = [];
    for (var s=0; s < sortBy.length; s++){
        var attrib = sortBy[s].split(':');
        attribSort.push(encodeURIComponent('<%= attribute[\"'+attrib[0]+'\"]%>:'+attrib[1]));
    }

    // Create parameters array
    var paramList = BUNDLE.config.bridgeRecordParameters.split(',');
    var parameters = [];
    for (var p=0; p < paramList.length; p++){
        var parameter = paramList[p].split(':');
        parameters[parameter[0]] = parameter[1];
    }

    // If we have a display type set the Show and Details arrays
    if (BUNDLE.config.bridgeRecordDetailsType != ""){
        var detailsSet = true;
        atrribShow = BUNDLE.config.bridgeRecordShow.split(/\s*,\s*/);
        attribDetails = BUNDLE.config.bridgeRecordDetails.split(/\s*,\s*/);
    }

    // Get the data from the bridge
    connector.search(BUNDLE.config.bridgeRecordModel, BUNDLE.config.bridgeRecordQualification, {
        parameters: parameters,
        attributes: [attribArray],
        metadata: {"order": [attribSort]},
        success: function(response) {
            if (response.records.length > 0){
                if (BUNDLE.config.bridgeRecordDisplay == 'table') {
                    tableDisplay(response, attribArray, atrribShow, attribDetails);
                }
                else {
                    divDisplay(response,attribArray, atrribShow, attribDetails);
                }
            }
            else {
                $('#bridgeRecord-results').append('<div class="no-results">'+BUNDLE.config.bridgeRecordNoResultsMessgage+'</div>');
            }
        },
        failure: function(arg) {
                $('#bridgeRecord-results').append('<div class="message alert alert-error"><a class="close" data-dismiss="alert">x</a> '+arg.responseMessage+'</div>');
        }
    });

    // On click event for showing details
    jQuery(document).on("click",".bridgeRecord-result",function(event){
        var displayType = BUNDLE.config.bridgeRecordDetailsType;
        switch(displayType){
            case 'Inline' : jQuery('#'+jQuery(this).data('id')).toggle(); break;
            case 'Dialog' : jQuery.blockUI({
                                theme:   true, 
                                title:   BUNDLE.config.bridgeRecordDetailsTitle + ' <button id="close-dialog">' + BUNDLE.config.bridgeRecordDialogClose + '</button>', 
                                message: jQuery('#'+jQuery(this).data('id')+' .bridgeRecord-details'),
                            }); 
                            break;
        }
        if (BUNDLE.config.bridgeRecordDetailsType == 'Inline'){
            if(jQuery('#'+jQuery(this).data('id')).is(':visible')){
                jQuery(this).parent().find('.moreDetails').html(BUNDLE.config.bridgeRecordTableLess);
            }
            else {
                jQuery(this).parent().find('.moreDetails').html(BUNDLE.config.bridgeRecordTableMore);
            }
        }
    });
    jQuery(document).on("click",'#close-dialog',function(event) { 
        $.unblockUI(); 
    }); 

});

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS
    //////

    // Display the brige results as a table
    function tableDisplay(response, attribArray, atrribShow, attribDetails){
        // Create the table header  - these values are displayed from the config
        var tableHead = "<thead>";
        // Loop through the array of attributes listed in the config
        for (var a=0;a<attribArray.length;a++){
            var css = attribArray[a].replace(/\s+/g, '');
            // Check if we are using details and if so show only the attributes listed in 
            // the show list from the config
            // Else list all attributes
            if (BUNDLE.config.bridgeRecordDetailsType != ""){
                for (b=0;b<atrribShow.length;b++){
                    if (attribArray[a] == atrribShow[b]){
                        tableHead += '<th class="'+ css + '">' + attribArray[a] + '</th>';
                    }
                }
            }
            else {
                tableHead += '<th class="'+ css + '">' + attribArray[a] + '</th>';
            }
        }
        tableHead += '</thead>';

        // Create table rows from results from bridge
        var tableInner = "";
        for (var i=0;i<response.records.length;i++) {
            var tableRow = "<tr>";
            var tableRowDetails = "";
            var resultFormatted = "";
            // Loop through the result hash and grab the key for each item
            for(var index in response.records[i].attributes){
                // Check if result is a date and, if so, run it through the date format function
                // Else return the result value as is
                resultFormatted = checkForDate(response.records[i].attributes[index]);
                // Create the css tag from the key which is the attribute name
                // substitute spaces with dashes and set all to lowercase
                var css = index.replace(/\s+/g,'-').toLowerCase();
                // Check is we are showing details and if so set up the results based
                // on the config arrays
                // Else show all results 
                if (BUNDLE.config.bridgeRecordDetailsType != ""){
                    // Set the unique value to a variable to be used by both the calling element
                    // and the detail element to tie them together for onClick events
                    var unique = response.records[i].attributes[BUNDLE.config.bridgeRecordUniqueAttribute];
                    // Loop through the show list and display results
                    for (x=0;x<atrribShow.length;x++){
                        // Set the "more" and "less" toggle item
                        var plusSign = "";
                        if (index == atrribShow[x]){
                            x == 0 ? plusSign = '<span class="moreDetails">'+BUNDLE.config.bridgeRecordTableMore+'</span>' : plusSign = "";
                            tableRow += '<td class="bridgeRecord-result pointer '+ css + '" data-id="'+ unique +'">' + plusSign + ' ' + resultFormatted + '</td>';
                        }
                    }
                    // Loop through the details list and hide these resutls
                    for (y=0;y<attribDetails.length;y++){
                        if (index == attribDetails[y]){
                            tableRowDetails += '<div class="'+ css + '">' + resultFormatted + '</div>';
                        }
                    }
                } else {
                    tableRow += '<td class="'+ css + '">' + resultFormatted + '</td>';
                }
            }
            tableRow +='</tr>';
            tableInner += tableRow;
            if (BUNDLE.config.bridgeRecordDetailsType != ""){
                tableInner += '<tr id="'+ unique + '" class="hidden"><td colspan='+ atrribShow.length +'><div class="bridgeRecord-details">' + tableRowDetails + '</div></td></tr>';
            }
        }
        // Create table from header and inner html
        var table = '<table id="bridgeRecord-results-table"><tr>' + tableHead + '</tr>' + tableInner + '</table>';
        // Add it to the div on the page
        $('#bridgeRecord-results').append(table);
    }

    // Display results in divs
    function divDisplay(response, attribArray, atrribShow, attribDetails){
        var results = "";
        for (var i=0;i<response.records.length;i++) {
            var resultInner = "";
            var resultInnerDetails = "";
            for(var index in response.records[i].attributes){
                var resultFormatted = checkForDate(response.records[i].attributes[index]);
                var css = index.replace(/\s+/g,'-').toLowerCase();
                if (BUNDLE.config.bridgeRecordDetailsType != ""){
                    for (x=0;x<atrribShow.length;x++){
                        if (index == atrribShow[x]){
                            resultInner += '<div class="'+ css + '">' + resultFormatted + '</div>';
                        }
                    }
                    for (y=0;y<attribDetails.length;y++){
                        if (index == attribDetails[y]){
                            resultInnerDetails += '<div class="'+ css + '">' + resultFormatted + '</div>';
                        }
                    }
                }
                else {
                    resultInner += '<div class="'+ css + '">' + resultFormatted + '</div>';
                }
            }

            if (BUNDLE.config.bridgeRecordDetailsType != ""){
                var unique = response.records[i].attributes[BUNDLE.config.bridgeRecordUniqueAttribute];
                var resultDetails = '<div class="hidden" id="'+ unique +'"><div class="bridgeRecord-details">' + resultInnerDetails + '</div></div>';
                var result = '<div class="bridgeRecord-result pointer" data-id="'+ unique +'">' + resultInner +' ' + resultDetails +'</div>';
            }
            else {
                var result = '<div class="bridgeRecord-result">' + resultInner +'</div>';
            }
            results += result;
        }
        $('#bridgeRecord-results').append(results);
    }

    function checkForDate(result){
        var match = result.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\+0000/);
        if (match != null) {
            var result = formatDate(result);
        }
        return result;
    }

    function formatDate(dateString) {
      var match = dateString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\+0000/);
      var date = new Date();
      date.setUTCFullYear(match[1], parseInt(match[2].replace(/^0/,""))-1, match[3]);
      date.setUTCHours(match[4], match[5], match[6]);
      var formattedDate = date.toLocaleString();
      return formattedDate;
    }