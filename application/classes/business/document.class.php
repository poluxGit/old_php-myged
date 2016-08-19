<?php

/**
 * Document class file definition
 * 
 * @package Core
 * @author polux <polux@poluxfr.org>
 */
namespace MyGED\Business;

// Classes needed!
use MyGED\Application\App as App;
use MyGED\Core as Core;

/**
 * Document Class
 * 
 * Defintion of a Document
 */
class Document extends Core\AbstractDBObject {
    
    /**
     * Default Class Constructor - New Document
     */
    public function __construct($pStrUid=null) {
        parent::__construct($pStrUid,App::getAppDabaseObject());
    }//end __construct()
    
    /**
     * getDocById
     * 
     * Returns a Document by his id
     * 
     * @param string $pStrDocId
     * @return \Document
     */
    public static function getDocById($pStrDocId)
    {
        return new Document($pStrDocId);
    }//end getDocById()
    
    /**
     * Database table set up
     * 
     * @static
     */
    public static function setupDBConfig()
    {
        self::$_sIdDBFieldname = 'doc_id';
        self::$_sTitleDBFieldname = 'doc_title';
        self::$_sTableName = 'app_documents';
        self::$_aFieldNames = array(
            'doc_id',
            'doc_title',
            'doc_code'
        );
    }
    
    /**
     * Returns all records about your class 
     * 
     * @param string $pStrWhereCondition Filtering Condition (without WHERE)
     * 
     * @return array(mixed)
     */
    public static function getAllClassItemsData($pStrWhereCondition)
    {
        return static::getAllItems(App::getAppDabaseObject(), $pStrWhereCondition);
    }//end getAllClassItemsData()
    
    /**
     * Store Data
     */
    public function store()
    {
        parent::storeDataToDB(App::getAppDabaseObject());
    }//end store()
    
}//end class
