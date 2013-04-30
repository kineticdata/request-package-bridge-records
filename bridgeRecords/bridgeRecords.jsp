<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>

<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>

<!DOCTYPE html>

<html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title><%= bundle.getProperty("catalogName")%></title>

        <%-- Include the common content. --%>
        <%@include file="../../core/interface/fragments/applicationHeadContent.jspf"%>
        <%@include file="../../common/interface/fragments/headContent.jspf"%>

        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/bridgeRecords.css" type="text/css">
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%= bundle.packagePath()%>resources/js/bridgeRecords.js"></script>
    </head>

    <body>
        <div class="container clearfix">
            <%@include file="../../common/interface/fragments/contentHeader.jspf"%>
            <div class="content clearfix">
                <h1 class="bridgeRecord-header"><%= bundle.getProperty("bridgeRecordHeader")%></h1>
                <div class="bridgeRecord-subheader"><%= bundle.getProperty("bridgeRecordSubheader")%></div>
                <div class="bridgeRecords">
                    <div id="bridgeRecord-results"></div>
                </div>
            </div>
            <%  %>
            <%@include file="../../common/interface/fragments/contentFooter.jspf"%>
        </div>
    </body>
</html>