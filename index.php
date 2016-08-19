<?php

/**
 * Index Page - Main Web Start Script
 * 
 * @author polux <polux@poluxfr.org>
 */

include_once './application/app.inc.php';

use MyGED\Application as Application;
use MyGED\Vault as Vault; 

// Application init!
Application\App::initApplication();



echo "DISPLAYING ALL DOCUMENTS : <BR/>";

echo "<pre>";
print_r(\MyGED\Business\Document::getAllClassItemsData());
echo "</pre>";



exit;