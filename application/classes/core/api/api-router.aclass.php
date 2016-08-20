<?php

namespace MyGED\Core\API;
/**
 * API Class File definition
 * 
 * @package MyGED
 * @subpackage API_RESTful
 */


/**
 * API Class Definition
 * 
 * @abstract
 */
abstract class API {

    /**
     * Property: method
     * The HTTP method this request was made in, either GET, POST, PUT or DELETE
     */
    protected $method = '';

    /**
     * Property: endpoint
     * The Model requested in the URI. eg: /files
     */
    protected $endpoint = '';

    /**
     * Property: verb
     * An optional additional descriptor about the endpoint, used for things that can
     * not be handled by the basic methods. eg: /files/process
     */
    protected $verb = '';
    
    /**
     * Property: namespaceOfEndpointsClass
     * 
     * @static
     * @var string  Namespace 
     */
    protected static $_sNsEndpointsClass = '\\MyGED\\Business\\';

    /**
     * Property: args
     * Any additional URI components after the endpoint and verb have been removed, in our
     * case, an integer ID for the resource. eg: /<endpoint>/<verb>/<arg0>/<arg1>
     * or /<endpoint>/<arg0>
     */
    protected $args = Array();

    /**
     * Property: file
     * Stores the input of the PUT request
     */
    protected $file = null;

    /**
     * Constructor: __construct
     * 
     * Allow for CORS, assemble and pre-process the data
     */
    public function __construct($request) {
        
        header("Access-Control-Allow-Orgin: *");
        header("Access-Control-Allow-Methods: *");
        header("Content-Type: application/json");

        $this->args = explode('/', rtrim($request, '/'));
        
        $this->endpoint = array_shift($this->args);
     
        $this->method = $_SERVER['REQUEST_METHOD'];
        if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
            if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
                $this->method = 'DELETE';
            } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
                $this->method = 'PUT';
            } else {
                throw new Exception("Unexpected Header");
            }
        }
        $this->cleaningAccordingMethod();        
    }
    
    private function cleaningAccordingMethod()
    {
        switch ($this->method) {
            case 'DELETE':
            case 'POST':
                $this->request = $this->_cleanInputs($_POST);
                break;
            case 'GET':
                $this->request = $this->_cleanInputs($_GET);
                break;
            case 'PUT':
                parse_str(file_get_contents("php://input"), $this->request);
                $this->file = file_get_contents("php://input");
                break;
            default:
                $this->_response('Invalid Method', 405);
                break;
        }
    }

    /**
     * Processing API Action
     * 
     * @return mixed response
     */
    public function processAPI() 
    {
        try{
            // Endpoint is valid ?
            if(!static::isValidEndpoint($this->endpoint))
            {
                throw new \Exception(
                            sprintf(
                                    "No Endpoint '%s' (ClassName:'%s').",
                                    $this->endpoint,
                                    static::getEndpointClassname($this->endpoint)
                                    )
                        );
            }
            
            return $this->callEndpointByMethod();
        }
        catch (\Exception $ex)
        {
            return $this->_response($ex->getMessage(), 404);
        }
    }
    
    protected function callEndpointByMethod()
    {
        if ($this->method == 'GET') 
        {
            // Mode GET - LOADING DATA !
            return $this->_response($this->processGenericGETResponse(),200);
        } 
        elseif ($this->method == 'POST') 
        {
            // Mode POST - INSERT DATA!
           return $this->_response($this->processGenericPOSTResponse(),200);
        } 
        elseif ($this->method == 'DELETE') 
        {
            // Mode DELETE - DELETE DATA !
            return $this->_response($this->processGenericDELETEResponse(),200);
        } 
        elseif ($this->method == 'PUT') 
        {
            // Mode UPDATE - UPDATE DATA !
            return $this->_response($this->processGenericPUTResponse(),200);
        }
        else
        {
            return $this->_response("No Endpoint founded : $this->endpoint", 404);
        }
    }//end callEndpointByMethod()

    /**
     * Send HTTP response
     * 
     * @param mixed     $data       Data provided
     * @param intger    $status     HTTP Status Code
     * 
     * @return mixed    HTTP Response
     */
    private function _response($data, $status = 200) {
        header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
        return json_encode($data);
    }

    /**
     * Cleaning Inputs
     * 
     * @param mixed $data
     * @return mixed
     */
    private function _cleanInputs($data) {
        $clean_input = Array();
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $clean_input[$k] = $this->_cleanInputs($v);
            }
        } else {
            $clean_input = trim(strip_tags($data));
        }
        return $clean_input;
    }

    /**
     * Returns Status Request
     * 
     * @param string $code
     * 
     * @return integer  HTTP Status Code
     */
    private function _requestStatus($code) {
        $status = array(
            200 => 'OK',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
        );
        return ($status[$code]) ? $status[$code] : $status[500];
    }

    /**
     * Returns TRUE if Endpoint is identified and valid
     * 
     * @param string $pStrEndpointName  Endpoint name.
     * 
     * @return boolean
     */
    protected static function isValidEndpoint($pStrEndpointName)
    {
        return class_exists(static::getEndpointClassname($pStrEndpointName));
    }
    
    
    /**
     * Returns complete Classname with namespace.
     * 
     * @param string $pStrEndpointName  Endpoint name.
     * @return string Classname
     */
    protected static function getEndpointClassname($pStrEndpointName)
    {
        return static::$_sNsEndpointsClass.$pStrEndpointName;
    }
    
    /**
     *  Processing HTTP GET request
     * 
     * @return mixed
     * 
     * @throws \Exception
     */
    protected function processGenericGETResponse() {
        $lStrClassName = static::getEndpointClassname($this->endpoint);
        // Number of Args?
        switch (count($this->args)) {
            case 0:
                // Load all items!
                $lObjDoc = new $lStrClassName();
                $lArrData = $lStrClassName::getAllClassItemsData();
                break;
            case 1:
                $lStrIDDoc = array_shift($this->args);
                $lObjDoc = new $lStrClassName($lStrIDDoc);
                $lArrData = $lObjDoc->getAllAttributeValueToArray();
                break;
            case 2:
                $lStrIDDoc = array_shift($this->args);
                $lStrFieldName = array_shift($this->args);
                $lObjDoc = new $lStrClassName($lStrIDDoc);

                $lArrData = $lObjDoc->getAttributeValue($lStrFieldName);
                // Field not found
                if (is_null($lArrData)) {
                    throw new \Exception(
                    sprintf(
                            "No attribute named '%s' founded for object of class '%s'.", $lStrFieldName, $this->endpoint
                    )
                    );
                }

                break;
            default:
                throw new \Exception("Too many arguments for this request (Max:3).");
                break;
        }

        return $lArrData;
    }//end processGenericGETResponse()
    
    /**
     * Define all request parameter on target Objet as Attribute value.
     * 
     * @param \MyGED\Core\AbstractDBObject $pObjTarget  Business Object concerned
     */
    protected function defineRequestParamsAsFieldOnToBusinessObject(\MyGED\Core\AbstractDBObject $pObjTarget)
    {
        foreach($this->request as $lStrKey => $lStrValue)
        {
            $pObjTarget->setAttributeValue($lStrKey, $lStrValue);
        }
    }//end defineRequestParamsAsFieldOnToBusinessObject()
    
    /**
     * Processing HTTP POST request
     * 
     * @return mixed
     * 
     * @throws \Exception
     */
    protected function processGenericPOSTResponse() {
        $lStrClassName = static::getEndpointClassname($this->endpoint);
        $lStrUIDData = null;
        
        // Number of Args ? 
        if(count($this->args) > 0)
        {
            throw new \Exception(
                    sprintf(
                            "Wrong number of parameters (%d founded).",count($this->args))
                    );
        }
        else
        {
            $lObjDoc = new $lStrClassName();
            $this->defineRequestParamsAsFieldOnToBusinessObject($lObjDoc);
            $lObjDoc->store();
            
            $lStrUIDData = $lObjDoc->getId();
        }
        return $lStrUIDData;

    }//end processGenericPOSTResponse()
    
    
    /**
     * Processing HTTP DELETE request
     * 
     * @return boolean
     * 
     * @throws \Exception
     */
    protected function processGenericDELETEResponse() {
        $lStrClassName = static::getEndpointClassname($this->endpoint);
        $lStrUIDData = false;
        // Number of Args ? 
        if(count($this->args) != 1)
        {
            throw new \Exception(
                    sprintf(
                            "Wrong number of parameters (%d founded).",count($this->args))
                    );
        }
        else
        {
            $lStrUidDoc = array_shift($this->args);
            $lObjDoc = new $lStrClassName($lStrUidDoc);
            $lStrUIDData = $lObjDoc->delete();
            
        }
        return $lStrUIDData;

    }//end processGenericDELETEResponse()
    
    
    
    /**
     * Processing HTTP PUT request
     * 
     * @return mixed
     * 
     * @throws \Exception
     */
    protected function processGenericPUTResponse() {
        
        $lStrClassName = static::getEndpointClassname($this->endpoint);
        $lStrUIDData = null;        
        $lIntNbArgs = count($this->args);
        
        // Number of Args ? 
        if($lIntNbArgs !== 1)
        {
            $lStrMessage = ($lIntNbArgs==0)?sprintf("No ID specified - For creation use POST METHOD."):sprintf("Wrong number of parameters (%d founded).",count($this->args));
            throw new \Exception($lStrMessage);
        }
        else
        {
            $lStrUidDoc = array_shift($this->args);
            $lObjDoc = new $lStrClassName($lStrUidDoc);             
            $this->defineRequestParamsAsFieldOnToBusinessObject($lObjDoc);
            $lObjDoc->store();            
            $lStrUIDData = $lObjDoc->getAllAttributeValueToArray();
        }
        return $lStrUIDData;

    }//end processGenericPOSTResponse()
    
   
}
