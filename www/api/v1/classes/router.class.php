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
        static::setSpecificRoute('GET','#^document/[0-9A-Za-z\-]*/getmeta/#', 'cb_GET_DocumentGetMeta', 'document');
        static::setSpecificRoute('GET','#^typedocument/[0-9A-Za-z\-]*/getmeta/#', 'cb_GET_TypeDocumentGetMeta', 'document');
        static::setSpecificRoute('POST','#^document/[0-9A-Za-z\-]*/addtier/[0-9A-Za-z\-]*#', 'cb_POST_DocumentAddTier', 'document');
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
    }


 }
