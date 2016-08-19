<?php

/**
 * Default including framework definition
 * 
 * @todo Autoload ...
 */
require_once 'classes/app.class.php';

//require_once 'classes/exceptions-handler.sclass.php';

require_once 'classes/core/db-object.class.php';

require_once 'classes/business/document.class.php';
require_once 'classes/business/tier.class.php';
require_once 'classes/business/categorie.class.php';

require_once 'classes/exceptions/application.exception.class.php';
require_once 'classes/exceptions/generic.exception.class.php';

require_once 'data/database.sclass.php';
require_once 'data/filesystem.sclass.php';
require_once 'data/vault.sclass.php';
require_once 'data/vaultdb.sclass.php';
require_once 'data/vaultfs.sclass.php';
