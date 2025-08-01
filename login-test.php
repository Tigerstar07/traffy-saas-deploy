<?php include "php/includes/functions.php"; ?>
<?php include "php/includes/db.php"; ?>

<?php 

login_user();

?>

<!DOCTYPE html>
<html>
<body>

<h2>Testa pieteikšanās forma</h2>

<form id="loginForm" action="" method="post">
    
    <label for="c_r_number">Reģistrācijas numurs</label><br>
    <input type="number" id="c_r_number" onKeyPress="if(this.value.length==11) return false;" placeholder="00000000000" name="c_r_number"/><br>
    
    <label for="password">Parole</label></br>
    <input type="password" id="password" placeholder="••••••••" required name="password"/></br>
    
    <button type="submit" name="login">Pieteikties</button>
</form>

</body>
</html>