<?php

/**
 * API
 * 
 * @author polux <polux@poluxfr.org>
 */

include_once './application/app.inc.php';

use MyGED\Core\Application as Application;
use MyGED\Vault as Vault;


function getFile()
{
    if(array_key_exists('doc_id', $_REQUEST))
    {
        $lStrUniqueId = $_REQUEST['doc_id'];
        
        $lStrFilePath = Vault\Vault::getFilePathByID($lStrUniqueId);
        $lStrName    = Vault\Vault::getFileOriginalNameByID($lStrUniqueId);
        $lStrContent = Vault\Vault::getFileContentByID($lStrUniqueId);
        
        header('Content-Disposition: attachment; filename="'.$lStrName.'"');
        readfile($lStrFilePath); 
        
    }
    else
    {
        echo "Erruru";
    }
}

// Application init!
Application\App::initApplication();


if(array_key_exists('action', $_REQUEST))
{
    switch (strtoupper($_REQUEST['action'])) {
        case 'GETFILE':
            getFile();
            break;

        default:
            echo "Action non gérée!";
            break;
    }
}

exit;