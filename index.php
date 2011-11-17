<?php
// Redirect to the cygnet.sccs virtual host.
if ($_SERVER['SERVER_NAME'] === 'www.sccs.swarthmore.edu') {
   $termstring = (isset($_REQUEST['terms']) ? '?terms='.$_REQUEST['terms'] : '');
   header('Location: http://cygnet.sccs.swarthmore.edu' . $termstring);
   die();
}
?>
<!DOCTYPE html>
<html>
<head>
  <title>The Cygnet (by SCCS)</title>
  <script type="text/javascript" src="client.js"></script>
  <link rel="stylesheet" href="cygnet.css" type="text/css" media="all" />
</head>

<body>
  <div id="banner">
    <img id="logo" src="media/cygnet-banner.png" alt="The SCCS Cygnet" />
    <div id="banner-text">
      The online Cygnet is a service of the
      <a href="http://www.sccs.swarthmore.edu/">Swarthmore College Computer Society</a>.
      <!-- <br/>500 College Ave, Swarthmore, PA 19081-1397.-->
      Please use it responsibly or the site may be taken down.
      Send questions, bug reports, replacement pictures
      (please resize to 105 by 130 pixels), and removal requests to the SCCS Staff
      at <a href="mailto:staff@sccs.swarthmore.edu">staff@sccs.swarthmore.edu</a>.
      Advanced options: <a id="toggle-advanced" href="#" onClick="javascript:toggleAdvanced()"
			   title="Show advanced search options">click to show</a>.
      <div id="advanced" style="display: none">
	<br />
	<strong>Advanced searching:</strong>
	You can do a more specific search by using keywords in the search box.
	An advanced search might look like, "first:matt address:lodges",
	which would return everyone named Matt who lives in one of the lodges.
	The accepted keywords are:
	<ul class="InlineList">
	  <li>first</li>
	  <li>last</li>
	  <li>year</li>
	  <!-- <li>phone</li> -->
	  <li>email</li>
	  <li>address</li>
	</ul>
      </div>
    </div>
  </div>

  <div id="searchbar">
    <form method="get" action="index.php">
      <input id="terms" type="text" name="terms"
	     onkeyup="javascript:callSearch()"
	     value="<?php
                    $terms = get_magic_quotes_gpc() ?
                             stripslashes($_REQUEST['terms']) :
                             $_REQUEST['terms'];
                    echo htmlspecialchars($terms, ENT_COMPAT);
                    ?>"/>
      <div id="spinner-box">
	<img id="spinner" src="media/spinner.gif" alt="[spinner]"/>
      </div>
      <div class="clearer">&nbsp;</div>
    </form>
    <div id="responsetime"
	 style="display: <?php echo (isset($_REQUEST['debug']) ? 'block' : 'none') ?>;">
      <span id="timelabel">Query took: </span>
      <span id="timevalue"></span>
    </div>
  </div>

  <div id="results">
    <!-- RESULTS GET INSERTED HERE -->
  </div>

  <div id="footer" style="display: none;">
    <p>
      <strong>Tip:</strong> you can bookmark
      <a id="bookmarkurl" href="index.php">this link</a> to repeat this search.
    </P>
  </div>
</body>
</html>

