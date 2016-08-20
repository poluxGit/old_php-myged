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
        parent::__construct($request);

        
        
        
//        // Abstracted out for example
//        $APIKey = new Models\APIKey();
//        $User = new Models\User();
//
//        if (!array_key_exists('apiKey', $this->request)) {
//            throw new Exception('No API Key provided');
//        } else if (!$APIKey->verifyKey($this->request['apiKey'], $origin)) {
//            throw new Exception('Invalid API Key');
//        } else if (array_key_exists('token', $this->request) &&
//             !$User->get('token', $this->request['token'])) {
//
//            throw new Exception('Invalid User Token');
//        }
//
//        $this->User = $User;
    }

    /**
     * Example of an Endpoint
     */
     protected function example() {
        if ($this->method == 'GET') {
        
            // Load a document !
            // at least one parameters about id of doc!
            if(count($pStrArgs) > 0)
            {
                $lStrIDDoc = $pStrArgs[0];
                $lObjDoc = new Business\Document($lStrIDDoc);
                $lArrData = $lObjDoc->getAllAttributeValueToArray();
            }
            else {
                // Load all documents !
                $lObjDoc = new Business\Document($lStrIDDoc);
                $lArrData = Business\Document::getAllClassItemsData();
            }
            return $lArrData;
        } elseif($this->method == 'POST') {
            return "Only accepts GET requests : Mode INSERT (POST) asked!";
        } elseif($this->method == 'DELETE') {
            return "Only accepts GET requests : Mode DELETE (DELETE) asked!";
        } elseif($this->method == 'PUT') {
            return "Only accepts GET requests : Mode UPDATE (PUT) asked!";
        }
     }
     
    /**
     * Endpoint 'document'
     * 
     * Document Class items management.
     * 
     * @return mixed    Result
     */
    protected function document($pStrArgs) 
    {
        // Mode GET - LOADING DATA !
        if ($this->method == 'GET') {
            // Load a document !
            // at least one parameters about id of doc!
            if(count($pStrArgs) > 0)
            {
                $lStrIDDoc = $this->verb;
                $lObjDoc = new Business\Document($lStrIDDoc);
                $lArrData = $lObjDoc->getAllAttributeValueToArray();
            }
            else {
                // Load all documents !
                $lObjDoc = new Business\Document();
                $lArrData = Business\Document::getAllClassItemsData();
            }
            return $lArrData;
        } 
        elseif ($this->method == 'POST') 
        {
            // Mode POST - INSERT DATA !
            if(count($pStrArgs) > 0)
            {
                $lStrIDDoc = array_shift($pStrArgs);
                $lObjDoc = new Business\Document($lStrIDDoc);
                $lArrData = $lObjDoc->getAllAttributeValueToArray();
            }
            else {
                // Load all documents !
                $lObjDoc = new Business\Document();
                $lArrData = Business\Document::getAllClassItemsData();
            }
            return $lArrData;
        } 
        elseif ($this->method == 'DELETE') 
        {
            // Mode DELETE - DELETE DATA !
            return "Only accepts GET requests : Mode DELETE (DELETE) asked!";
        } 
        elseif ($this->method == 'PUT') 
        {
            // Mode UPDATE - UPDATE DATA !
            return "Only accepts GET requests : Mode UPDATE (PUT) asked!";
        }
     }
     
     /**
      * Update fields if possible
      * 
      * @param \MyGED\Core\AbstractDBObject     $pObjToUpdate           Object to update
      * @param array(fieldname => fieldvalue)   $pArrFieldsToUpdate     Fieldsname to update
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
 
