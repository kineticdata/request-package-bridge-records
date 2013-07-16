# Request Package - Bridge Records 

## Overview
This project contains a package for simple display of bridge records. This package creates a new portal page in a bundle for displaying result records from a bridge request such as broadcast messages, users, assets, etc. The package allows display in either sections on the page using html divs or a table display. This package does not have any click events and is purely for displaying information. 

*To learn more about creating bridges, refer to the Kinetic Community article at:  
http://community.kineticdata.com/10_Kinetic_Request/Resources/Bridges*

## Installation / Quick Start

1. Unzip the request-package-bridge-records.zip file into the packages directory of your bundle

2. Rename the request-package-bridge-records folder to something that represents the information that will be displayed (e.g. bradcasts, assests, etc.)

3. Open the config.jsp in the config directory and choose your options according to the table below (the config file includes descriptions of each varible):

| Variable | Value | Desription |
| ---------| ------|------------|
| bridgeRecordHeader | | This variable is the header for the page |
| bridgeRecordSubheader | | This is the description for your page that shows under the header |
| bridgeRecordNoResultsMessgage | | This is the message that displays when no records are found |
| bridgeRecordModel | | The name of your bridge model |
| bridgeRecordQualification | | The name of the qualification used for this result set |
| bridgeRecordAttributes | | The list of the model attributes that are used in the brige configuration. These are separated by commas and in the order they should be displayed|
| bridgeRecordSort | ATTRIBUTE:ASC or ATTRIBUTE:DESC | This property sets the sort order for the results and requires the attribute name left of the sort order (either ASC- assending or DESC - descending). At least 1 attribute must be specified|
| bridgeRecordParameters | | This property sets the parameters designated in the bridge. Comma separated list with Field:Value pairs |
| bridgeRecordDisplay | table or div | This property sets the display to a basic table or divs - parameter is: "table" or "div". CSS classes will be added to each element - the class name will be the same as the attribute with spaces removed.|
| bridgeRecordDetailsType | inline, dialog or blank | These properties allow show inline or a dialog for details which are specified by other variables.If bridgeRecordDetailsType has a value, separate details will be available. If it is blank none of the other properties are used. Inline will toggle under the result whereas dialog will produce a popup. To use this feature you must use a unique attribute in the bridgeRecordUniqueAttribute variable |
| bridgeRecordUniqueAttribute | | This property requres a unique attribute in the bridge and is used to tie the details to each result |
| bridgeRecordShow | | List of attributes that should be visible on the page separated by commas. The order of these items needs to match the bridgeRecordAttributes order |
| bridgeRecordDetails | | List of attributes that should be in the details separated by commas |
| bridgeRecordDetailsTitle | | Title for the dialog if bridgeRecordDetailsType is set to dialog |
| bridgeRecordDialogClose | | The following property sets the text within the dialog close button. This can be text or images. If using images a fully qualified href tag needs to be used |
| bridgeRecordTableMore | | The item / text displayed notifying the user that there is more information when details. This can be text or images. If using images a fully qualified href tag needs to be used |
| bridgeRecordTableLess | | The item / text displayed when using table display with inline details, that alerts the user that they can close the details. This can be text or images. If using images a fully qualified href tag needs to be used | 

4. Create an empty service item in your catalog and set the "Display Page (JSP)" under "Advanced" tab to this package directory bridgeRecords.jsp.

