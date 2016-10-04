<?php
namespace MyGED\Application;
/**
 * Application API Class file definition
 *
 * @package MyGED
 *
 * @subpackage API_RESTful
 */
use MyGED\Core\API\API as API;
use MyGED\Core\Exceptions as Exceptions;
use MyGED\Business as Business;
use MyGED\Vault\Vault as VaultApp;

/**
 * Application API Class definition
 */
class AppAPIRouter extends API
{
    /**
     *  Default constructor
     *
     * @param array(mixed)  $request    HTTP Request Data
     * @param string        $origin     Server Name
     */
    public function __construct($request, $origin) {
        parent::__construct($request, $origin);

        // Specific Routes init!

        // API Document relatives Routes
        static::setSpecificRoute('GET','#^document/[0-9A-Za-z\-]*/getmeta/#', 'cb_GET_DocumentGetMeta', 'document');
        static::setSpecificRoute('GET','#^document/[0-9A-Za-z\-]*/getcat/#', 'cb_GET_DocumentGetCategories', 'document');
        static::setSpecificRoute('GET','#^document/[0-9A-Za-z\-]*/gettiers/#', 'cb_GET_DocumentGetTiers', 'document');

        static::setSpecificRoute('POST','#^document/[0-9A-Za-z\-]*/addtier/[0-9A-Za-z\-]*#', 'cb_POST_DocumentAddTier', 'document');
        static::setSpecificRoute('POST','#^document/[0-9A-Za-z\-]*/addcat/[0-9A-Za-z\-]*#', 'cb_POST_DocumentAddCat', 'document');
        static::setSpecificRoute('POST','#^document/[0-9A-Za-z\-]*/file/#', 'cb_POST_DocumentFileAddFileAndLink', 'document');
        static::setSpecificRoute('POST','#^document/[0-9A-Za-z\-]*/file/[0-9A-Za-z\-]*#', 'cb_POST_DocumentAddLink', 'document');
        static::setSpecificRoute('DELETE','#^document/[0-9A-Za-z\-]*/file/[0-9A-Za-z\-]*#', 'cb_DELETE_DocumentFileDeleteLink', 'document');

        // API TypeDocument relatives Routes
        static::setSpecificRoute('GET','#^typedocument/[0-9A-Za-z\-]*/getmeta/#', 'cb_GET_TypeDocumentGetMeta', 'document');

        // API File relatives Routes
        static::setSpecificRoute('GET','#^file/[0-9A-Za-z\-]*#', 'cb_GET_getFileContent', 'file');
        static::setSpecificRoute('PUT','#^file/#', 'cb_PUT_NewFile', 'document');
        //static::setSpecificRoute('PUT','#document/doc-57b9b6c0d3006/addmeta/#', 'test', 'document');
    }

    /**
     * CallBack Document GetMeta in GET Request.
     *
     * @internal grab '#^document/[0-9A-Za-z\-]/addmeta/#' URI
     *
     * @return string Message
     */
    protected function cb_GET_DocumentGetMeta() {
        // Getting Data
        $lStrDocUID = array_shift($this->args);
        $lObjDoc = new Business\Document($lStrDocUID);
        return $this->_response($lObjDoc->getAllMetadataDataInArray(),200);
    }//end cb_GET_DocumentGetMeta()

    /**
     * CallBack TypeDocument GetMeta in GET Request.
     *
     * @internal grab '#^document/[0-9A-Za-z\-]/addmeta/#' URI
     *
     * @return string Message
     */
    protected function cb_GET_TypeDocumentGetMeta() {

        // Getting Data
        $lStrDocUID = array_shift($this->args);
        $lObjDoc = new Business\TypeDocument($lStrDocUID);

        return $this->_response($lObjDoc->getAllMetadataDataInArray(),200);
    }//end cb_GET_TypeDocumentGetMeta()

    /**
     * CallBack Document AddTier in POST Request.
     *
     * @internal grab '#^document/[0-9A-Za-z\-]/addtier/[0-9A-Za-z\-]*#' URI
     *
     * @return string Message
     */
    protected function cb_POST_DocumentAddTier() {
        // Getting Data
        $lStrDocUID = array_shift($this->args);
        $lStrAddTier = array_shift($this->args);
        $lStrTierUid = array_shift($this->args);
        $lObjDoc = new Business\Document($lStrDocUID);

        return $this->_response($lObjDoc->addTierToDocument($lStrTierUid),200);
    }//end cb_POST_DocumentAddTier()

    /**
     * CallBack Document AddTier in POST Request.
     *
     * @internal grab '#^document/[0-9A-Za-z\-]/addcat/[0-9A-Za-z\-]*#' URI
     *
     * @return string Message
     */
    protected function cb_POST_DocumentAddCat() {
        // Getting Data
        $lStrDocUID = array_shift($this->args);
        $lStrAddCat = array_shift($this->args);
        $lStrCatUid = array_shift($this->args);
        $lObjDoc = new Business\Document($lStrDocUID);

        return $this->_response($lObjDoc->addCategorieToDocument($lStrCatUid),200);
    }//end cb_POST_DocumentAddCat()

    /**
     * CallBack Document getCat in GET Request.
     *
     * @internal grab '#^document/[0-9A-Za-z\-]/getcat/#' URI
     *
     * @return string Message
     */
    protected function cb_GET_DocumentGetCategories() {
        // Getting Data
        $lStrDocUID = array_shift($this->args);
        $lObjDoc = new Business\Categorie();
        return $this->_response($lObjDoc->getCategoriesDataForDocument($lStrDocUID),200);
    }//end cb_GET_DocumentGetCategories()

    /**
     * CallBack Document getTier in GET Request.
     *
     * @internal grab '#^document/[0-9A-Za-z\-]/gettier/#' URI
     *
     * @return string Message
     */
    protected function cb_GET_DocumentGetTiers() {
        // Getting Data
        $lStrDocUID = array_shift($this->args);
        $lObjDoc = new Business\Tier();
        return $this->_response($lObjDoc->getTiersDataForDocument($lStrDocUID),200);
    }//end cb_GET_DocumentGetTiers()


    /**
     * CallBack Document file in PUT Request
     *
     * Create and store a new File
     * @internal grab '#^file/#' URI
     *
     * @return string Message
     */
    protected function cb_PUT_NewFile() {
        // Getting Data
        $lStrFileVaultFS = VaultApp::storeFromContent($this->file);

        return $this->_response($lStrFileVaultFS,200);
    }

    /**
     * Update fields on Business Object concerned by request.
     *
     * @param \MyGED\Core\AbstractDBObject     $pObjToUpdate           Object to update
     * @param array(fieldname => fieldvalue)   $pArrFieldsToUpdate     Fieldsname to update
     *
     * @throws Exceptions\GenericException     if field not valid for current type of Object
     */
    private function setItemAttributesFromCurrentRequestArgs($pObjToUpdate,$pArrFieldsToUpdate)
    {
        if($pObjToUpdate instanceof \MyGED\Core\AbstractDBObject)
        {
           foreach($pArrFieldsToUpdate as $lStrFieldAttributeName => $lStrFieldAttributeValue)
           {
               if($pObjToUpdate->isValidFieldForClass($lStrFieldAttributeName))
               {
                   $pObjToUpdate->setAttributeValue($lStrFieldAttributeName, $lStrFieldAttributeValue);
               }
               else
               {
                   $lArrOptions = array(
                       'msg' => sprintf(
                                   "Fieldname '%s' isn't valid for Object of type '%s'.",
                                   $lStrFieldAttributeName,
                                   $this->endpoint
                               )
                       );
                   throw new Exceptions\GenericException('API_BUSINESS_FIELDNAME_INVALID', $lArrOptions);
               }

           }
        }
    }//end setItemAttributesFromCurrentRequestArgs()

}//end class
