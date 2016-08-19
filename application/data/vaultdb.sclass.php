<?php

/**
 * Vault Class File Definition
 * 
 * @author polux <polux@poluxfr.org>
 * 
 * @package MyGED
 * @subpackage Vault
 */

namespace MyGED\Vault;

use MyGED\Core\Exceptions as AppExceptions;

/**
 * Vaul Class Definition
 * 
 * Class managing storing solution.
 */
class VaultDb {
    
    /**
     * Add a new file into database 
     * 
     * @param string $pStrUniqueId          UniqueId of doc
     * @param string $pStrSourceFilename    Original filename
     * @param string $pStrTargetFilename    Target filename
     * 
     * @return boolean
     */
    public static function insertNewFile($pStrUniqueId,$pStrSourceFilename,$pStrTargetFilename)
    {
        try {
            
            $lObjDb = Vault::getPDOVaultDBObject();
            
            $lStrSQLQuery = sprintf(
                    "INSERT INTO vault_files VALUES ('%s','%s','%s',%d);",
                    $pStrUniqueId,
                    $pStrTargetFilename,
                    $pStrSourceFilename,
                    filesize($pStrTargetFilename)
            );
            
            $lObjDb->query($lStrSQLQuery);
            $lObjDb->lastInsertId();
        }
        catch (\Exception $e)
        {
            $lArrOptions = array('msg'=> 'Error during adding a new document into DB => '.$e->getMessage());
            throw new AppExceptions\GenericException('VAULT_DB_ADD_DOC_FAILED',$lArrOptions);
        }
        return $lObjDb->lastInsertId();
    }
    
    /**
     * Delete a file into database
     * 
     * @param string $pStrUniqueId          UniqueId of doc
     * @param string $pStrSourceFilename    Original filename
     * @param string $pStrTargetFilename    Target filename
     * 
     * @return boolean
     */
    public static function deleteFile($pStrUniqueId)
    {
        try {
            
            $lObjDb = Vault::getPDOVaultDBObject();
            
            $lStrSQLQueryDelFiles = sprintf(
                    "DELETE FROM vault_files WHERE file_id ='%s';",
                    $pStrUniqueId
            );
            
            $lObjDb->query($lStrSQLQueryDelFiles);
        }
        catch (\Exception $e)
        {
            $lArrOptions = array('msg'=> 'Error during adding a new document into DB => '.$e->getMessage());
            throw new AppExceptions\GenericException('VAULT_DB_ADD_DOC_FAILED',$lArrOptions);
        }
        return true;
    }
    
    /**
     * get a filepath data from Uid
     * 
     * @param string $pStrUniqueId          UniqueId of doc
     * 
     * @return string filepath (null if not founded)
     */
    public static function getFilePath($pStrUniqueId)
    {
        $lStrResult = null;
        try {
            
            $lObjDb = Vault::getPDOVaultDBObject();
            
            $lStrSQLQuerySelFiles = sprintf(
                    "SELECT file_id,file_path,file_originalname FROM vault_files WHERE file_id='%s'",
                    $pStrUniqueId
            );
            
            $lObjStat = $lObjDb->query($lStrSQLQuerySelFiles,\PDO::FETCH_BOTH);
            $lArrDataAllRows = $lObjStat->fetchAll();
            
            if(count($lArrDataAllRows) === 1)
            {
                $lStrResult = $lArrDataAllRows[0]['file_path'];
            }
        }
        catch (\Exception $e)
        {
            $lArrOptions = array('msg'=> 'Error during adding a new document into DB => '.$e->getMessage());
            throw new AppExceptions\GenericException('VAULT_DB_ADD_DOC_FAILED',$lArrOptions);
        }
        return $lStrResult;
    }
    
    /**
     * get a fileoiriginal name data from Uid
     * 
     * @param string $pStrUniqueId          UniqueId of doc
     * 
     * @return string filepath (null if not founded)
     */
    public static function getFileOriginalName($pStrUniqueId)
    {
        $lStrResult = null;
        try {
            
            $lObjDb = Vault::getPDOVaultDBObject();
            
            $lStrSQLQuerySelFiles = sprintf(
                    "SELECT file_id,file_path,file_originalname FROM vault_files WHERE file_id='%s'",
                    $pStrUniqueId
            );
            
            $lObjStat = $lObjDb->query($lStrSQLQuerySelFiles,\PDO::FETCH_BOTH);
            $lArrDataAllRows = $lObjStat->fetchAll();
            
            if(count($lArrDataAllRows) === 1)
            {
                $lStrResult = $lArrDataAllRows[0]['file_originalname'];
            }
        }
        catch (\Exception $e)
        {
            $lArrOptions = array('msg'=> 'Error during adding a new document into DB => '.$e->getMessage());
            throw new AppExceptions\GenericException('VAULT_DB_ADD_DOC_FAILED',$lArrOptions);
        }
        return $lStrResult;
    }
    
}