<?php include "php/includes/functions.php"; ?>
<?php include "php/includes/db.php"; ?>

<?php 

register_user();

?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="lv" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

<h2>Testa forma</h2>

<form id="signupForm" action="" method="post">
    <label for="c_name">Kompānijas nosaukums</label><br>
    <input type="text" id="c_name" placeholder="SIA Piemērs" name="c_name"/><br></br>
    <label for="c_r_number">Reģistrācijas numurs</label><br>
    <input type="number" id="c_r_number" onKeyPress="if(this.value.length==11) return false;" placeholder="00000000000" name="c_r_number"/><br></br>
    <label for="first">Vārds</label></br>
    <input type="text" id="first" placeholder="Jānis" name="first"/><br></br>
    <label for="last">Uzvārds</label></br>
    <input type="text" id="last" placeholder="Ozoliņš" name="last"/><br></br>
    <label for="email">E-pasta adrese</label></br>
    <input type="email" id="email" placeholder="piemers@piemers.lv" required name="email"/>
    <span><small><p id="email_error"></p></small></span><br></br>
    <label for="password">Parole</label></br>
    <input type="password" id="password" placeholder="••••••••" required name="password"/><br></br>
    <label for="password">Parole atkārtoti</label></br>
    <input type="password" id="password_conf" placeholder="••••••••" required name="password_conf"/>
    <span><small><p id="password_confirm_error"></p></small></span>
    <input class="form-check-input" type="checkbox" value="yes" id="commercials" name="news">
    <label class="form-check-label" for="ligumaNoteikumi">Vēlos saņemt jaunumus epastā.</label><br></br>
    <button type="submit" name="register">Reģistrēties</button>
</form>

<script src="js/scripts.js"></script>

</body>
</html>