<?php
	if ($_SERVER['SERVER_NAME'] === 'www.sccs.swarthmore.edu') // the cygnet doesn't work from this address -- the python script doesn't get executed
	{
		header('Location: http://cygnet.sccs.swarthmore.edu' . (isset($_REQUEST['terms']) ? '?terms=' . $_REQUEST['terms'] : ''));
		die();
	}
?>
<html>
    <head>
        <title>the cygnet (swarthmore college computer society)</title>
        <script type="text/javascript" language="javascript" src="client.js"></script>
        <link rel="stylesheet" href="cygnet.css" type="text/css" media="all"/>
    </head>
    
    <body<?php if (isset($_REQUEST['terms'])) { echo ' onload="javascript:callSearch(true)"'; } ?>>
        <div id="banner">
            <div style="float: left; text-align: center; margin-bottom: 10px;">
                <img src="media/cygnet-banner.png" width="315" height="60" />
            </div>
            <div style="margin-left: 315px; padding-left: 20px;">
            	<p><strong>Instructions:</strong> To use the online cygnet,
            	simply type what you're looking for in the "Find:" field below. When the online cygnet detects
                that you've stopped typing, it will fetch the results and display them in this page. To search again,
                just change the text in the "Find:" field, and the online cygnet will refresh the search results.</p>
				<div><strong>Advanced:</strong> You can do a more specific search by using keywords in the search box.
				An advanced search might look like, "first:matt address:lodges", which would return everyone named Matt
				who lives in one of the lodges.  The legal keywords are: 
	            <ul style="display: inline;" class="InlineList">
	              <li>first</li>
	              <li>last</li>
	              <li>class</li>
	              <li>phone</li>
	              <li>email</li>
	              <li>address</li>
	            </ul>
				</div>
            </div>
        </div>
        <div id="searchbar" style="clear: both;">
          <form method="get" action="index.php">
            <input id="terms" type="text" name="terms"
		   onkeyup="javascript:callSearch()"
		   value="<?php echo $_REQUEST['terms']; ?>"/>
	    <div id="spinner-box">
	      <img id="spinner" src="media/spinner.gif" alt=""/>
	    </div>
	    <div class="clearer">&nbsp;</div>
          </form>
          <div id="responsetime"
	       style="display: <?php echo (isset($_REQUEST['debug']) ? 'block' : 'none') ?>;">
            <span id="timelabel">Query took: </span>
            <span id="timevalue"></span>
          </div>
        <div id="results" style="text-align:center; margin: 1em auto 0;">
        </div>
        <div id="footer">
            <p>
                The online cygnet is a service of the <a href="http://www.sccs.swarthmore.edu/">Swarthmore College Computer Society</a>.
                Please use the site responsibly, or it may be taken down.
            </p>
            <p>
                <strong>Tip:</strong> you can bookmark <a id="bookmarkurl" href="index.php">this link</a> to repeat this search.
            </p>
            <p>
                Please send questions, comments, bug reports, or new/replacement pictures to the SCCS Staff, at
                <a href="mailto:staff@sccs.swarthmore.edu">staff@sccs</a>.
                Please crop and resize images to 105 pixels wide by 130 pixels tall before sending them to us.
                If you would like to be removed from the online cygnet, email SCCS Staff at <a href="mailto:staff@sccs.swarthmore.edu">staff@sccs</a>.
            </p>
            <p>
                Content copyright &copy;<?php echo date("Y") ?>. All rights reserved.
                <br/><a href="http://www.sccs.swarthmore.edu/">Swarthmore College Computer Society</a>
                <br/>500 College Ave, Swarthmore, PA 19081-1397
            </p>
        </div>
    </body>
</html>

