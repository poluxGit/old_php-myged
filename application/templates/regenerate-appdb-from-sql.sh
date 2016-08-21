rm -f ./app_template.db && sqlite3 ./app_template.db < ./sql-scripts/01-CreateDatabase_appdb.sql && sqlite3 ./app_template.db < ./sql-scripts/02-InsertData.sql
