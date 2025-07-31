<?php include "php/includes/functions.php"; ?>
<?php include "php/includes/db.php"; ?>

<?php 

register_user();

?>

<!DOCTYPE html>
<html>
<body>

<h2>Testa forma</h2>

<form id="signupForm" action="" method="post">
    <label for="c_name">Company name</label><br>
    <input type="text" id="c_name" placeholder="SIA Piemērs" name="c_name"/><br>
    <label for="c_r_number">Registration number</label><br>
    <input type="text" id="c_r_number" onKeyPress="if(this.value.length==11) return false;" placeholder="00000000000" name="c_r_number"/><br>
    <label for="first">First name</label></br>
    <input type="text" id="first" placeholder="Jānis" name="first"/><br>
    <label for="last">Last name</label></br>
    <input type="text" id="last" placeholder="Ozoliņš" name="last"/><br>
    <label for="email">Email Address</label></br>
    <input type="email" id="email" placeholder="piemers@piemers.lv" required name="email"/><br>
    <label for="password">Password</label></br>
    <input type="password" id="password" placeholder="••••••••" required name="password"/><br>
    <input class="form-check-input" type="checkbox" value="yes" id="commercials" name="news">
    <label class="form-check-label" for="ligumaNoteikumi">Vēlos saņemt jaunumus epastā.</label></br>
    <button type="submit" name="register">Sign up →</button>
</form>

</body>
</html>