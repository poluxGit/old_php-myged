/*
 * Copyright 2016 polux.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Author:  polux
 * Created: 21 août 2016
 */

-- Création des tables

-- Table Fichiers
CREATE TABLE vault_files
(
    file_id VARCHAR(20) not null,
    file_path VARCHAR(4000) not null unique,
    file_originalname VARCHAR(500) default 'todef',
    file_size INT,
    file_mime VARCHAR(50),
    primary key (file_id)
);
