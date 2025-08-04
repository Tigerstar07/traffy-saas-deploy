<?php

function redirect($location){
    header("Location:" . $location);
    exit;
}


function query($query){
    global $connection;
    return mysqli_query($connection, $query);
}

function escape($string) {

    global $connection;
    
    return mysqli_real_escape_string($connection, trim($string));
    
    
    }


function confirm($result) {
    
        global $connection;
    
        if(!$result ) {
              
              die("QUERY FAILED ." . mysqli_error($connection));
       
              
          }
        
    
    }

function isMethod($method=null){

    if($_SERVER['REQUEST_METHOD'] == strtoupper($method)){

        return true;

    }

    return false;

}

function register_user(){

    global $connection;

    if(isMethod('post')){

            $kluda="";

            $comp_name = escape($_POST['c_name']);
            $comp_reg_numb = escape($_POST['c_r_number']);
            $name = escape($_POST['first']);
            $surname = escape($_POST['last']);
            $email = escape(strtolower($_POST['email']));            
            $password = escape($_POST['password']);
            $password = password_hash( $password, PASSWORD_BCRYPT, array('cost' => 13));

            if (isset($_POST['news']) && $_POST['news'] == 'yes') 
            {
                $commercials = "yes";
            }
            else
            {
                $commercials = "no";
            }    


            $query = "SELECT * FROM users WHERE comp_reg_number = '$comp_reg_numb' LIMIT 1";
            $result=query($query);
            $row = mysqli_num_rows($result);

            if($row > 0){

               echo "<script>alert('Šāds uzņēmuma numurs jau ir reģistrēts! Reģistrēšanās neveiksmīga.');</script>";
                
            } else {

            $stmt = $connection->prepare("INSERT INTO users (`name`, `surname`, `comp_name`, `comp_reg_number`, `email`, `password`, `commercials`) VALUES (?, ?, ?, ?, ?, ?, ?) ");
            $stmt->bind_param("sssisss", $name,  $surname, $comp_name, $comp_reg_numb, $email, $password, $commercials);
            $stmt->execute();

            if(!$stmt) {
                die('QUERY FAILED'. mysqli_error($connection));
                
                       }
        
            echo "<script type='text/javascript'>alert('Paldies! Reģistrācija veiksmīga.');</script>";

            
            $stmt->close();

                }
     
    }
}

function add_address(){

    global $connection;
    global $info;

    $id = $_SESSION['id'];

    if(isMethod('post')){
        
        if(isset($_POST['city_add'])){

            $address = $_POST['address_add'];
            $city = $_POST['city_add'];
            $country = $_POST['country_add'];
            $zip = $_POST['zip_add'];

            $stmt = $connection->prepare("INSERT INTO `address` (`address`, `city`, `country`, `zip`, `users_id`) VALUES (?, ?, ?, ?, ?) ");
            $stmt->bind_param("ssssi", $address, $city, $country, $zip, $id);
            $stmt->execute();

            if(!$stmt) {
                die('QUERY FAILED'. mysqli_error($connection));
                
                       }
        
            $info = "Jaunā adrese ir pievienota.";
           
            
            $stmt->close();
        }
    }
}

function delete_address(){

    global $connection;
    global $info;

    if(isMethod('post')){
    
    if(isset($_POST['delete_address'])){
    
        $id = $_POST['delete_address'];
        mysqli_query($connection, "DELETE FROM address WHERE id = $id ");

        $info = "Adrese ir dzēsta";

         }
    }
}


function login_user(){

   global $connection;

   $error = "";
    if(isMethod('post')){

        if(isset($_POST['login'])){

        $reg_nr = escape($_POST['c_r_number']);
        $password = escape($_POST['password']);

        $stmt = $connection->prepare("SELECT * FROM users WHERE comp_reg_number = ?");
        $stmt->bind_param("i", $reg_nr);
        $stmt->execute();

        if(!$stmt) {
            die('QUERY FAILED'. mysqli_error($connection));
            
            }

        $result = $stmt->get_result();
        
        $stmt->close();

        if($result->num_rows < 1){

           echo "<script type='text/javascript'>alert('Ievadīti nepareizi pieslēguma dati, pārbaudiet datus un mēģinat vēlreiz!');</script>";
            
       } else {

        
       /* $query = "SELECT * FROM users WHERE comp_reg_number = '$reg_nr' ";
        $select_user_query = mysqli_query($connection, $query);
        if (!$select_user_query) {
   
            die("QUERY FAILED" . mysqli_error($connection));
   
        } */
            while ($row = mysqli_fetch_array($result)) {
   
            $db_user_id = $row['id'];
            $db_email = $row['email'];
            $db_user_password = $row['password'];
            $db_user_firstname = $row['name'];
            $db_user_lastname = $row['surname'];        
   
            if (password_verify($password,$db_user_password)) {
   
             /*   $_SESIION['id'] = $db_user_id;
                $_SESSION['email'] = $db_email;
                $_SESSION['name'] = $db_user_firstname;
                $_SESSION['surname'] = $db_user_lastname;
                
                redirect("shop.php"); */

                echo "<script type='text/javascript'>alert('Esat veiksmīgi ielogjies sistēmā!');</script>";
   
            } else {
   
              echo "<script type='text/javascript'>alert('Ievadīti nepareizi pieslēgšanās dati!');</script>";
                //$error = "Ievadīti nepareizi pieslēgšanās dati!";
            }
   
   
            }

        }  

        }
   
    }
   
}

function change_password(){

    global $connection;
    global $info;

    if(isset($_GET['email'])){

        $email = escape($_GET['email']);
        $token = escape($_GET['forgot']);

        $stmt = $connection->prepare("SELECT email, token FROM users WHERE email = ? AND token = ? ");
        $stmt->bind_param("ss", $email, $token);
        $stmt->execute();

        if(!$stmt) {
            die('QUERY FAILED'. mysqli_error($connection));
            
            }

        $count = $stmt->get_result();
        
        $stmt->close();

    } 

        if($count->num_rows < 1){

            $info = "Nevarēja atjaunot paroli. Mēģiniet veikt paroles atjaunošanu vēlreiz";
            
       } else {
          
            if(isset($_POST['recover'])){

                $tokken_after = "NULL";
                $password = escape($_POST['recover_password']);
                $password = password_hash( $password, PASSWORD_BCRYPT, array('cost' => 12));
                                   
                $stmt = $connection->prepare("UPDATE users SET `password` = ?, `token` = ? WHERE email = ? AND token = ? ");
                $stmt->bind_param("ssss", $password, $tokken_after, $email, $token);
                $stmt->execute();

                if(!$stmt) {
                    die('QUERY FAILED'. mysqli_error($connection));
                    
                    }

                    $info = "Parole nomainīta veiksmīgi!";

                $stmt->close();
            }

    }
}

function edit_address(){

    global $connection;
    global $info;

    
    if(isset($_POST['edit_address'])){

        $id = $_POST['edit_address'];
        $address = $_POST['address_edit'];
        $city = $_POST['city_edit'];
        $country = $_POST['country_edit'];
        $zip = $_POST['zip_edit'];

        $stmt = $connection->prepare("UPDATE `address` SET `address` = ?, `city` = ?, `country` = ?, `zip` = ? WHERE `id` = ? ");
        $stmt->bind_param("ssssi", $address, $city, $country, $zip, $id);
        $stmt->execute();

        if(!$stmt) {
            die('QUERY FAILED'. mysqli_error($connection));
            
                   }
    
        $info = "Adrese ir atjaunota.";
        
        $stmt->close();
    }
}

?>  
               