<?php

/**
 * Tier class file definition
 * 
 * @package Core
 * @author polux <polux@poluxfr.org>
 */
namespace MyGED\Business;

use MyGED\Application\App as App;

use MyGED\Core as Core;

/**
 * Tier Class
 * 
 * Defintion of a Tier
 */
class Tier extends Core\AbstractDBObject {
    
    /**
     * Default Class Constructor - New Tier
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
        // TODO To dev when vault OK
        return new Tier($pStrDocId);
    }//end getDocById()
    
     /**
     * Database config set up
     * 
     * @static
     */
    public static function setupDBConfig()
    {
        self::$_sIdDBFieldname = 'tier_id';
        self::$_sTitleDBFieldname = 'tier_title';
        self::$_sTableName = 'app_tiers';
        self::$_aFieldNames = array(
            'tier_id',
            'tier_title',
            'tier_code',
            'tier_desc'
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
    public static function getAllClassItemsData($pStrWhereCondition)
    {
        return static::getAllItems(App::getAppDabaseObject(), $pStrWhereCondition);
    }//end getAllClassItemsData()
    
}//end class
