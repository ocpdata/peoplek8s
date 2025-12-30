Para importar las bases de datos hacia mysql en el cluster desde otro mysql, hay que hacer lo siguiente:

1.- Cargar el archivo de la base de datos a importar a un directorio temporal del pod de mysql
kubectl cp /Users/ocarrillo/Downloads/ormprueba.sql mysql-deployment-65649c8977-ngzc4:/tmp/ormprueba.sql

ormprueba.sql es el archivo de la base de datos a importar
/Users/ocarrillo/Downloads/ es la ruta donde esta dicho archivo
mysql-deployment-65649c8977-ngzc4 es el pod de mysql
/tmp/ es la ruta del directorio temporal en el pod de mysql

2.- Ingresar al pod de mysql
kubectl exec -it mysql-deployment-65649c8977-ngzc4 -- bash

mysql-deployment-65649c8977-ngzc4 es el pod de mysql

3.- Importar el archivo
mysql -u root -p ormfabricantes < /tmp/ormfabricantes.sql

root es el usuario de la base de datos
ormfabricante es la base de datos
/tmp/ormfabricantes.sql es la ubicacion y el archivo de la base de datos a importar

Se debe ingresar el password del usuario cuando sea solicitado

Nota: Antes de importar las bases de datos, estas deben crearse en mysql a traves de phpmyadmin
Nota: Tambien deben dar permiso al usuario que accederá a las bases de datos
Hya que ingresar al pod, luego a mysql y luego ingresar los comandos para dar privilegios

kubectl exec -it mysql-deployment-65649c8977-ngzc4 -- bash
mysql -u root -p
GRANT ALL PRIVILEGES ON configuraciones_2.* TO 'ocarrillo'@'%';
FLUSH PRIVILEGES;

configuraciones_2 es la base de datos
ocarrillo es el usuario