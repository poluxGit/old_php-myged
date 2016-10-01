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
     * Property: namespaceOfEndpointsClass
     *
     * @static
     * @var string  Namespace
     */
    protected static $_sNsEndpointsClass = '\\MyGED\\Business\\';


    /**
     * Property: _aSpecificRoute
     *
     * URI for specific routing.
     *
     * @static
     * @var array(route => array(classname,callback))
     */
    protected static $_aSpecificRoute = array(
        'PUT' => array(),
        'POST' => array(),
        'GET' => array(),
        'DELETE' => array()
    );


    /**
     * Property : initRequest
     *
     * Request initially submited.
     *
     * @var type
     */
    protected $initRequest = '';

    /**
     * Property: args
     *
     * Any additional URI components after the endpoint and verb have been removed, in our
     * case, an integer ID for the resource. eg: /<endpoint>/<verb>/<arg0>/<arg1>
     * or /<endpoint>/<arg0>
     */
    protected $args = Array();

    /**
     * Property: file
     * Stores the input of the PUT request
     *
     * @var string
     */
    protected $file = null;

     /**
     * Property: origin
      *
     * Origin
      *
      * @var string
     */
    protected $origin = null;

    /**
     * Constructor: __construct
     *
     * Allow for CORS, assemble and pre-process the data
     */
    public function __construct($request,$origin) {

        header("Access-Control-Allow-Orgin: *");
        header("Access-Control-Allow-Methods: *");
        header("Content-Type: application/json");

        $this->origin = $origin;
        $this->args = explode('/', rtrim($request, '/'));

        //print_r($this);
        $this->initRequest = $request;

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
       // print_r($this);
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
        // XXX print_r($this->initRequest);

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
            return $this->callEndPoint();
        }
        catch (\Exception $ex)
        {
            return $this->_response($ex->getMessage(), 404);
        }
    }

    protected function callEndPoint()
    {
        // Specific Route ?
        if($this->isSpecificRoute($this->initRequest,$this->method))
        {
            return $this->callEndpointBySpecificRouteProcess();
        }
        else
        {
            // Regular route !
            return $this->callEndpointByMethod();
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
     *
     * @return type
     */
    protected function callEndpointBySpecificRouteProcess()
    {
        $lArrRouteDef = $this->getSpecificRouteDefinition($this->initRequest,  $this->method);
        $lStrCallBack = $lArrRouteDef['callback'];

        // Callback !
        if(method_exists($this, $lStrCallBack))
        {
            return $this->{$lStrCallBack}();
        }
        else
        {
            throw new \Exception(
                    sprintf(
                            "Method '%s' not found for specific Route %s '%s'.",
                            $lStrCallBack,
                            $this->method,
                            $this->initRequest
                            )
                );
        }
    }//end callEndpointBySpecificRouteProcess()

    /**
     * Send HTTP response
     *
     * @param mixed     $data       Data provided
     * @param intger    $status     HTTP Status Code
     *
     * @return mixed    HTTP Response
     */
    protected function _response($data, $status = 200) {
        header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
        return json_encode($data);
    }

    /**
     * Cleaning Inputs
     *
     * @param mixed $data
     * @return mixed
     */
    protected function _cleanInputs($data) {
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
     * Returns TRUE if request corresponding to a specific route
     *
     * @param string $pStrURIRequest    URI Requested
     * @param string $pStrHTTPMethod    HTTP Method (eg. PUT/POST/GET/DELETE)
     *
     * @return boolean
     */
    protected static function isSpecificRoute($pStrURIRequest,$pStrHTTPMethod)
    {
        return !is_null(static::getSpecificRouteIndex($pStrURIRequest,$pStrHTTPMethod));
    }

    /**
     * Returns First Route Definition which matches with URI.
     *
     * @param string $pStrURIRequest   URI Requested eg. : typedocument/tdoc-1/createmeta/mtoc
     * @param string $pStrHTTPMethod    HTTP Method (eg. PUT/POST/GET/DELETE)
     *
     * @return array(classname,callback)    null if not founded.
     */
    protected static function getSpecificRouteDefinition($pStrURIRequest,$pStrHTTPMethod)
    {

        $lStrRouteName = static::getSpecificRouteIndex($pStrURIRequest,$pStrHTTPMethod);

        if(empty($lStrRouteName))
        {
            return null;
        }
        else {
            return static::$_aSpecificRoute[strtoupper($pStrHTTPMethod)][$lStrRouteName];
        }
    }

    /**
     * Returns First Route name which matches with URI.
     *
     * @param string $pStrURIRequest   URI Requested eg. : typedocument/tdoc-1/createmeta/mtoc
     * @param string $pStrHTTPMethod    HTTP Method (eg. PUT/POST/GET/DELETE)
     *
     * @return string    Name of Specific Route (null if not found)
     */
    protected static function getSpecificRouteIndex($pStrURIRequest,$pStrHTTPMethod)
    {
        foreach (static::$_aSpecificRoute[strtoupper($pStrHTTPMethod)] as $lStrRegExpRoute => $lArrRouteDef)
        {
            if(preg_match( $lStrRegExpRoute,$pStrURIRequest))
            {
                return $lStrRegExpRoute;
            }
        }
        return null;
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
     * Test
     * @param string $pStrHTTPMethod            HTTP Method (eg. PUT|GET|POST|DELETE)
     * @param string $pStrSpecificRouteRegExp   RegExp matching route (eg.  '^document/[0-9A-Za-z]?/addmeta/')
     * @param string $pStrCallBack              Method name to call on current object.
     * @param string $pStrClassName
     */
    protected static function setSpecificRoute($pStrHTTPMethod,$pStrSpecificRouteRegExp,$pStrCallBack,$pStrClassName)
    {
        static::$_aSpecificRoute[strtoupper($pStrHTTPMethod)][$pStrSpecificRouteRegExp] = ['classname' => $pStrClassName, 'callback' => $pStrCallBack];
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
