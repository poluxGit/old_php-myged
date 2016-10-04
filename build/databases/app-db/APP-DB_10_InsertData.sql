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
 * Default Data - Data inserted after db structure generation
 *
 * Author:  polux
 * Created: 21 août 2016
 */

/* Categories */
INSERT INTO app_categories(cat_id,cat_title,cat_code,cat_desc) VALUES ('cat-administratif','Administratif','CAT-ADMIN','Documents administratifs.');


/* Tiers */
INSERT INTO app_tiers(tier_id,tier_title,tier_code,tier_desc) VALUES ('tie-edf','Electricité de France','EDF','Fournisseur d électricité');
INSERT INTO app_tiers(tier_id,tier_title,tier_code,tier_desc) VALUES ('tie-gdf','GDF Suez','GDF','Fournisseur de Gaz.');
INSERT INTO app_tiers(tier_id,tier_title,tier_code,tier_desc) VALUES ('tie-bouygues','Bouygues Telecom','BTCOM','FAI.');
INSERT INTO app_tiers(tier_id,tier_title,tier_code,tier_desc) VALUES ('tie-deficis','Agence Immo - DEFICIS','DEFICIS','Agence immobilière Nicolas DEFICIS.');


/* Type de Document */
INSERT INTO app_typesdoc(tdoc_id,tdoc_title,tdoc_code,tdoc_desc) VALUES ('tdoc-factures','Facture','FACT','Tous les types de factures.');
INSERT INTO app_typesdoc(tdoc_id,tdoc_title,tdoc_code,tdoc_desc) VALUES ('tdoc-bullpaies','Bulletin de paie','BPAI','Bulletins de salaires.');
