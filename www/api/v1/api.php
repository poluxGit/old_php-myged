<?php

/**
 * API
 *
 * @author polux <polux@poluxfr.org>
 */

require_once '../../appli.inc.php';

use MyGED\Core\Application as Application;
use MyGED\Vault as Vault;
use MyGED\Application\AppAPIRouter as AppAPI;
use MyGED\Application\App as App;

print_r($_REQUEST);

App::initApplication();

// Requests from the same server don't have a HTTP_ORIGIN header
if (!array_key_exists('HTTP_ORIGIN', $_SERVER)) {
    $_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
}

try {
    $API = new AppAPI($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
    echo $API->processAPI();
} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}

exit;
