#!/bin/bash

# Backup File before
cp ../../www/data/app.db ../../www/data/app.db.backup_old
sqlite3 ../../www/data/app.db.new < ../../www/application/templates/sql-scripts/01-CreateDatabase_appdb.sql
cp ../../www/data/app.db.new ../../www/data/app.db
sqlite3 ../../www/data/app.db < ../../www/application/templates/sql-scripts/02-InsertData.sql
chmod uog+rwx ../../www/data/app.db
