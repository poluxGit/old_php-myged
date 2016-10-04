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
            'doc_code',
            'doc_desc',
            'tdoc_id',
            'doc_year',
            'doc_month',
            'doc_day'
        );
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
     * Store Data
     */
    public function store()
    {
        parent::storeDataToDB(App::getAppDabaseObject());
    }//end store()

     /**
     * Delete Data
     */
    public function delete()
    {
        return parent::deleteDataToDB(App::getAppDabaseObject());
    }//end store()

    /**
     * Returns array including all metadata data of document
     */
    public function getAllMetadataDataInArray()
    {
        return MetaDocument::getAllItemsDataFromDocument($this->getId());
    }

    /**
     * Link an existing Tier to a this document.
     *
     * @param string $pStrTierUid     Tier Uid
     *
     * @return boolean OK?
     */
    public function addTierToDocument($pStrTierUid)
    {
        try{
            $lStrSQL = sprintf(
                    "INSERT INTO app_asso_docs_tiers (doc_id,tier_id) VALUES ('%s','%s')",
                    $this->getId(),
                    $pStrTierUid
            );

            $this->executeSQLQuery($lStrSQL);

        } catch (Exception $ex) {
                 $lArrOptions = array('msg' => 'Error during execution of a SQL Statement => '.$ex->getMessage());
            throw new AppExceptions\GenericException('DB_EXEC_SQL_PDO_FAIL', $lArrOptions);
        }

        return true;
    }

    /**
     * Link an existing Categorie to a this document.
     *
     * @param string $pStrCatUid     Categorie Uid
     *
     * @return boolean OK?
     */
    public function addCategorieToDocument($pStrCatUid)
    {
        try{
            $lStrSQL = sprintf(
                    "INSERT INTO app_asso_docs_cats (doc_id,cat_id) VALUES ('%s','%s')",
                    $this->getId(),
                    $pStrCatUid
            );

            $this->executeSQLQuery($lStrSQL);

        } catch (Exception $ex) {
                 $lArrOptions = array('msg' => 'Error during execution of a SQL Statement => '.$ex->getMessage());
            throw new AppExceptions\GenericException('DB_EXEC_SQL_PDO_FAIL', $lArrOptions);
        }

        return true;
    }


}//end class
