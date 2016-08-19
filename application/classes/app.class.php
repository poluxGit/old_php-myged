<?php

/**
 * App Class File Definition
 * 
 * @package MyGED
 * @subpackage Application
 * 
 * @category CoreApplication
 */

namespace MyGED\Application;

use MyGED\Core\Exceptions as ApplicationException;
use MyGED\Vault as VaultApplication;
use MyGED\Core\FileSystem\FileSystem as FileFS;

/**
 * App Class definition
 * 
 * @package MyGED
 * @category CoreApplication
 */
class App {
    
    /**
     * Application Parameters
     * 
     * @var array(mixed) $_aParams 
     * @access private
     */
    private static $_aParams = array();
    
    /**
     * Database PDO Object to Metadata DB.
     * 
     * @var \PDO 
     * @access private
     */
    private static $_oMetaDatabase = null;
    
    /**
     * Returns PDO Object about Application Metadata database
     * 
     * @return \PDO
     */
    public static function getAppDabaseObject()
    {
        return App::$_oMetaDatabase;
    }
    
    /**
     * @deprecated since version 1
     */
    public static function initApplication()
    {
        App::setAppParam('SQLITE_DB_FILEPATH', '/var/www/html/php-myged/data/app.db');
        App::setAppParam('MODE', 'DEBUG');
        App::setAppParam('VAULT_ROOT', '/var/www/html/php-myged/data/vault');
        App::setAppParam('VAULT_DB', '/var/www/html/php-myged/data/vault/db/vault.db');
        App::setAppParam('TEMPLATES_ROOT', '/var/www/html/php-myged/application/templates');
        
        // Database init...
        App::initDatabase();
        
        // Vault init...
        App::initVault();
    }
    
    /**
     * Database initialisation
     * 
     * @throws ApplicationException\GenericException
     */
    public static function initDatabase()
    {
        try {
            // Application DB file does not exists ?
            if(!file_exists(App::getAppParam('SQLITE_DB_FILEPATH')))
            {
                // Recreate it from template!
                static::resetApplicationDBFile();
            }
            $lObjPdoDB = \MyGED\Core\Database\DatabaseTools::getSQLitePDODbObj(App::getAppParam('SQLITE_DB_FILEPATH'));            
            App::$_oMetaDatabase = $lObjPdoDB;
            
        } catch (\Exception $ex) {
            $lArrOptions = array('msg'=>"SQLite db DSN : '".$lStrDSN."'. ExMsg : ".$ex->getMessage());
            throw new ApplicationException\GenericException('PDO_CONNECTION_FAILED',$lArrOptions);
        }
    }
    
     /**
     * Vault initialisation
     * 
     * @throws ApplicationException\GenericException
     */
    public static function initVault($pBCreateIfNeeded = false)
    {
        $lStrVaultFilePath = App::getAppParam('VAULT_ROOT');
        VaultApplication\Vault::loadVault($lStrVaultFilePath,$pBCreateIfNeeded);
    }
    
    /**
     * getAppParam
     * 
     * Returns Parameter value. NULL if not defined.
     * 
     * @param string $pStrParamIdx Parameter Id
     * @return mixed Value of Parameter (null if not founded)
     */
    public static function getAppParam($pStrParamIdx)
    {
        $lMixedResult = null;
        if(array_key_exists($pStrParamIdx, App::$_aParams))
        {
            $lMixedResult =  App::$_aParams[$pStrParamIdx];
        }
        
        return $lMixedResult;    
    }
    
    /**
     * setAppParam
     * 
     * Set Parameter value.
     * 
     * @param string $pStrParamIdx Parameter Id
     * @param mixed  $pMixedValue  Value to define
     */
    public static function setAppParam($pStrParamIdx,$pMixedValue)
    {
        App::$_aParams[$pStrParamIdx] = $pMixedValue;
    }
    
     /**
     * Returns filepath about Application Template DB File
     * 
     * @return string Filepath of Application Template DB File
     */
    public static function getTemplateAppDbFilePath()
    {
        return static::getAppParam('TEMPLATES_ROOT').'/app_template.db';
    }
    
    /**
     * Returns  filepath about Application DB File
     * 
     * @return string Filepath of Application DB File
     */
    public static function getAppDbFilePath()
    {
        return static::getAppParam('SQLITE_DB_FILEPATH');
    }
    
    /**
     * Resets Application DB File
     * 
     * @static
     * @throws AppExceptions\GenericException
     */
    public static function resetApplicationDBFile()
    {
         try {
            $lStrRoot = static::getTemplateAppDbFilePath();
            $lStrDest = static::getAppDbFilePath();
            
            FileFS::filecopy($lStrRoot, $lStrDest);
        }
        catch (\Exception $e)
        {
            $lArrOptions = array('msg'=> $e->getMessage());
            throw new ApplicationException\GenericException('INIT_APP_DB_FAILED',$lArrOptions);
        }
    }
}
