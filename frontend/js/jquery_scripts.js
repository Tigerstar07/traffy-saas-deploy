function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
    
   }

$(document).ready(function(){

     /* Paroles stipruma pārbaude */
        $('#password').keyup(function () {  
            $('#password_good').html(checkStrength($('#password').val()))  
        })  
        function checkStrength(password) {  
            var strength = 0  
            if (password.length < 6) {  
                $('#password').removeClass()  
                $('#password').addClass('Short')  
                return 'Parole ir parāk īsa'  
            }  
            if (password.length > 10) strength += 1
            // If password contains both lower and uppercase characters, increase strength value.  
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1  
            // If it has numbers and characters, increase strength value.  
            if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1  
            // If it has one special character, increase strength value.  
            if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1  
            // If it has two special characters, increase strength value.  
            if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1  
            // Calculated strength value, we can return messages  
            // If value is less than 2  
            if (strength < 2) {  
                $('#password').removeClass()  
                $('#password').addClass('Weak')  
                return 'Parole ir vāja'  
            } else if (strength == 2) {  
                $('#password').removeClass()  
                $('#password').addClass('Good')  
                return 'Parole ir spēcīga'  
            } else {  
                $('#password').removeClass()  
                $('#password').addClass('Strong')  
                return 'Parole ir ļoti spēcīga'  
            }  
        }

/* Reģistrācijas formas pārbaude*/

  $("#signupForm").submit(function(e) {
    
    var kluda = "";

/*E-pasta formāta pārbaude*/

if (isEmail($("#email").val()) == false) {

               
              emailError = "Ievadītā epasta adrese nav derīga.";
              $("#email_error").html(emailError);
              kluda += " ";
              $("#email_error").show();
                                        
    }else {
              
        $("#email_error").hide();
              
    }
/*Pārbauda vai paroles ir vienādas*/    

 if ($("#password").val() != $("#password_conf").val()) {
					
           kluda = "Ievadītās paroles nav vienādas!";
           alert(kluda);
 }       
        

     if (kluda != "") {
              
              return false;	     
              
          } else {
                                   
              return true;
                          
          }

    });

});