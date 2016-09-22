<?php

/**
 * Categorie class file definition
 * 
 * @package Core
 * @author polux <polux@poluxfr.org>
 */
namespace MyGED\Business;

use MyGED\Application\App as App;
use MyGED\Core as Core;

/**
 * Categorie Class
 * 
 * Defintion of a Categorie
 */
class Categorie extends Core\AbstractDBObject {
    
    /**
     * Default Class Constructor - New Categorie
     */
    public function __construct($pStrUid=null) {
        parent::__construct($pStrUid,App::getAppDabaseObject());
    }//end __construct()
    
    /**
     * getDocById
     * 
     * Returns a Categorie by his id
     * 
     * @param string $pStrDocId
     * @return \Document
     */
    public static function getDocById($pStrDocId)
    {
        // TODO To dev when vault OK
        return new Categorie($pStrDocId);
    }//end getDocById()
    
     /**
     * Database config set up
     * 
     * @static
     */
    public static function setupDBConfig()
    {
        self::$_sIdDBFieldname = 'cat_id';
        self::$_sTitleDBFieldname = 'cat_title';
        self::$_sTableName = 'app_categories';
        self::$_aFieldNames = array(
            'cat_id',
            'cat_title',
            'cat_code',
            'cat_desc'
        );
    }
    
    /**
     * Store Data
     */
    public function store()
    {
        parent::storeDataToDB(App::getAppDabaseObject());
    }
    
    /**
     * Returns all records about your class 
     * 
     * @param string $pStrWhereCondition Filtering Condition (without WHERE)
     * 
     * @return array(mixed)
     */
    public static function getAllClassItemsData($pStrWhereCondition=null)
    {
        return static::getAllItems(App::getAppDabaseObject(), $pStrWhereCondition);
    }//end getAllClassItemsData()
    
     /**
     * Delete Data
     */
    public function delete()
    {
        return parent::deleteDataToDB(App::getAppDabaseObject());
    }//end store()
    
}//end class
