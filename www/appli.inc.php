<?php

/**
 * Autoloader
 *
 * @param type $pStrClassName
 * @return type
 */
function __autoload($pStrClassName)
{
    $lStrPAth = pathinfo(__FILE__,PATHINFO_DIRNAME);
    $lStrPAth .= '/';

    //class directories
    $directorys = array(
        $lStrPAth.'application/',
        //'api/functions',
        $lStrPAth.'application/classes/',
        $lStrPAth.'application/classes/core/api/',
        $lStrPAth.'application/classes/core/',
        $lStrPAth.'application/classes/business/',
        $lStrPAth.'application/classes/exceptions/',
        $lStrPAth.'application/data/',
        $lStrPAth.'api/v1/classes/'
    );

    //for each directory
    foreach($directorys as $directory)
    {
        $lObjDir = opendir($directory);

        while(($lStrInput=readdir($lObjDir))==true)
        {
            if(is_file($directory.$lStrInput) && pathinfo($directory.$lStrInput, PATHINFO_EXTENSION)=='php') {
                require_once $directory.$lStrInput;
            }
        }

        closedir($lObjDir);
    }
}//end __autoload()
