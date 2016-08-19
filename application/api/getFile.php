<?php


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


if(array_key_exists('action', $_REQUEST))
{
    switch (strtoupper($_REQUEST['action'])) {
        case 'GETFILE':


            break;

        default:
            break;
    }
}

header ("Content-type: text/plain");
header ("Content-Disposition: Inline; filename=\"info.php\"");



