<?php 
  
  $db['db_host'] = 'localhost';
  $db['db_user'] = 'traffylv_SAAS';
  $db['db_pass'] = '?zr;FuL*!e*}K7*L';
  $db['db_name'] = 'traffylv_SAAS';

  foreach($db as $key => $value){

    define(strtoupper($key), $value);

  }


$connection = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

mysqli_set_charset($connection,"utf8mb3");

    if(!$connection) {

        die("Databse connection failed!" . mysqly_error($connection));

    } else {

        echo "Connection succesfully!"
    }

?>