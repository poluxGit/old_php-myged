<?php

/**
 * Index Page - Main Web Start Script
 *
 * @author polux <polux@poluxfr.org>
 */

include_once 'appli.inc.php';

use MyGED\Application as Application;
use MyGED\Vault as Vault;

// Application init!
Application\App::initApplication();

echo "DISPLAYING ALL DOCUMENTS : <BR/>";
$lODoc = new \MyGED\Business\Categorie();
echo "<pre>";
print_r(\MyGED\Business\Categorie::getAllClassItemsData());
echo "</pre>";


exit;
