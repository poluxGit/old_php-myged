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

echo "Initialisation OK! <BR/>";

$lStrUniqueId = Vault\Vault::storeFromFilepath('./info.php');
echo sprintf("Creation File into Vault : '%s'  .....OK! <BR/>",$lStrUniqueId);

$lStrPath = Vault\Vault::getFilePathByID($lStrUniqueId);
$lStrName = Vault\Vault::getFileOriginalNameByID($lStrUniqueId);
$lStrContent = Vault\Vault::getFileContentByID($lStrUniqueId);
echo sprintf("Path of the file '%s' : '%s'  .....OK! <BR/>",$lStrName,$lStrPath);

$lObjDoc = new \MyGED\Business\Document();

        
$lObjDoc->setTitle('Titre Test');
$lObjDoc->setAttributeValue('doc_code','doc-phpunit-test01');
        
$lObjDoc->store();

$lStrIdDoc = $lObjDoc->getId();

echo "Document ID Stored : ".$lStrIdDoc.'<BR/>';

echo "<pre>";
print_r($lObjDoc);
echo "</pre>";

echo "Document loaded from previous ID : ".$lStrIdDoc.'<BR/>';

$lObjDoc = new \MyGED\Business\Document($lStrIdDoc);

echo "<pre>";
print_r($lObjDoc);
echo "</pre>";

echo "DISPLAYING ALL DOCUMENTS : <BR/>";

echo "<pre>";
print_r(\MyGED\Business\Document::getAllItems($pObjPDODb));
echo "</pre>";



exit;