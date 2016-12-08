<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang= "en"  "http://www.w3.org/1999/xhtml">
    <head>
		<title>Adrian GROZAVU - Professional-Info </title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="keywords" content="Adrian GROZAVU, engineer, programmer, networking, server, linux, internet" />
		<meta name="description" content="Website containing personal & professional info about Adrian GROZAVU" />
        <meta name="author" content="Adrian GROZAVU" />
        <meta name="copyright" content="Copyright(c) Adrian Grozavu 2013" />        
        <link media="all" type="text/css" href="style/clean.css" rel="stylesheet" />   
        <link media="all" type="text/css" href="style/main.css" rel="stylesheet" />
        <link media="all" type="text/css" href="style/nav.css" rel="stylesheet" />                 
        <link rel="shortcut icon" href="img/favicon.png" type="image/x-icon" />
    </head>

    <body>
    	<div id="content">
    		
        	<div id="header"> 
        		<p id="top"> ADRIAN GROZAVU</p>     <br />
        		<p id="quote" align="left" > 'I'm an exception to the rule' </p>      
        	</div>	<!-- end header-->  
        			
        	<div id="main-menu">
        		<ul class="nav">
					<li>  <a href="index.html" >  Home  </a>  </li>
					<li>  <a href="personal-info.html">  Personal Info  </a>  </li>
					<li>  <a href="professional-info.html">  Professional Info  </a>  </li>
					<li>  <a href="contact.html">  Contact  </a>  </li>
				</ul>
        	</div>  <!-- end main-menu -->
        	<div id="main-content"> 
        		<?php
					  // The global $_POST variable allow to access the data send with the POST method
  					 // To access the data send with the GET method, you can use $_GET
  					 echo "Thanks for the  message";
  					 $to= "grozavu.adrian@gmail.com";
					 $subject= "Comment on Personal Website";
					 $email= $_REQUEST('user_email');
					 $message= $_REQUEST('user_message;');
					 $headers= "From: $user_email";
					 $sent= mail($to, $subject, $message) ;
					 if ($sent)
					 	{ print "Your message was sent successfully."; }
					 else { print "Encountered error sending the message";}	
        		?>
        	</div>	<!-- end main-content -->
        	
        	<div id="footer"> 
            	<div id="copyright">Copyright(c) Adrian GROZAVU 2013 </div>
            	<br>
            	<div id="footer-menu">
            		<span id="tumblr">  <a href="http://www.s-brody.tumblr.com" target="_blank"> <img src="img/tumblr-logo.png" width="45px" height="45px"/> </a>  </span>
					<span id="twitter"> <a href="http://www.twitter.com/adrian_grozavu" target="_blank"> <img src="img/twitter-logo-small.png" height="45px;" /> </a>   </span>
					<span id="youtube"> <a href="http://www.youtube.com/user/TzEeMS" target="_blank"> <img src="img/youtube_logo_small.jpg" width="60px" height="45px"/></a>  </span>
					<span id="github"> <a href="https://github.com/s-brody" target="_blank"> <img src="img/github_logo.jpg" height="45px"/> </a>  </span>
            	</div>
            </div>  <!-- end footer -->	  
            	
    	</div> <!-- end content-->
    </body>
</html>
