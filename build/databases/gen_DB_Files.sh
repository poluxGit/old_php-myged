#!/bin/bash

echo "Generating SQLite3 Database for Application.";
sqlite3 app.db < ./app-db/APP-DB_01_CreateTables.sql
sqlite3 app.db < ./app-db/APP-DB_10_InsertData.sql

echo "Generating SQLite3 Database for Vault.";
sqlite3 vault.db < ./vault-db/VLT-DB_01_CreateTables.sql
