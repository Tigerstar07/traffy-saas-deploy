<?php include "../php/includes/functions.php"; ?>
<?php include "../php/includes/db.php"; ?>

<?php print_r(get_included_files());

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sign Up - Traffy</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="icon" type="image/svg+xml" href="images/Traffy1 icon.png" />
</head>

<body>
    <canvas id="stars-canvas"></canvas>
    <header class="top-nav" style="position:fixed; top:0; left:0; width:100vw; z-index:1000;">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="index.html">Traffy</a>
            </div>
            <nav class="nav-menu">
                <a href="index.html#features">Features</a>
                <a href="index.html#apps">Apps</a>
                <a href="index.html#pricing">Pricing</a>
                <a href="index.html#updates">Updates</a>
                <a href="signup.html">Signup</a>
                <span id="nav-user-status"
                    style="margin-left:18px; color:#7fd0ff; font-weight:600; font-size:13px;"></span>
                <a href="#" id="logoutBtn"
                    style="display:none; margin-left:10px; color:#f55; font-size:13px; font-weight:600;">Log out</a>
            </nav>
        </div>
    </header>

    <section class="signup-section">
        <div class="signup-box">
            <h2>Welcome to Traffy</h2>
            <p class="signup-subtitle">Sign up or log in to start your journey to an easier every day!</p>
            <div id="user-status" style="margin-bottom: 16px;"></div>
            <form id="signupForm" action="" method="post">
                <div class="name-row">
                    <div class="input-group">
                        <label for="c_name">Company name</label>
                        <div class="glow-wrapper">
                            <input type="text" id="c_name" placeholder="SIA Piemērs" name="c_name"/>
                            <div class="glow"></div>
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="c_r_number">Registration number</label>
                        <div class="glow-wrapper">
                            <input type="text" id="c_r_number" onKeyPress="if(this.value.length==11) return false;" placeholder="00000000000" name="c_r_number"/>
                            <div class="glow"></div>
                        </div>
                    </div>
                </div>
                <div class="name-row">
                    <div class="input-group">
                        <label for="first">First name</label>
                        <div class="glow-wrapper">
                            <input type="text" id="first" placeholder="Jānis" name="first"/>
                            <div class="glow"></div>
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="last">Last name</label>
                        <div class="glow-wrapper">
                            <input type="text" id="last" placeholder="Ozoliņš" name="last"/>
                            <div class="glow"></div>
                        </div>
                    </div>
                </div>
                <div class="input-group">
                    <label for="email">Email Address</label>
                    <div class="glow-wrapper">
                        <input type="email" id="email" placeholder="piemers@piemers.lv" required name="email"/>
                        <div class="glow"></div>
                    </div>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <div class="glow-wrapper">
                        <input type="password" id="password" placeholder="••••••••" required name="password"/>
                        <div class="glow"></div>
                    </div>
                </div>
                    <div class="col-9" style="margin-bottom: 10px;">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="yes" id="commercials" name="news">
                                <label class="form-check-label" for="ligumaNoteikumi">
                                    Vēlos saņemt jaunumus epastā.
                                </label>                                       
                            </div>
                        </div>
                <div class="glow-wrapper">
                    <button type="submit" name="register">Sign up →</button>
                    <div class="glow"></div>
                </div>
                <div style="margin-top: 18px; text-align: center;">
                    <span>Already have an account? <a href="#" id="showLogin">Log in</a></span>
                </div>
                <div class="divider"></div>
                <div style="display: flex; justify-content: center; margin-top: 10px;">
                    <div id="google-signin-btn" style="width: 100%; max-width: 360px;"></div>
                </div>
            </form>
        </div>
        <!-- Login Modal -->
        <div id="loginModal"
            style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); z-index:2000; align-items:center; justify-content:center;">
            <div
                style="background:#181828; color:#fff; border-radius:16px; padding:32px; min-width:320px; max-width:90vw; box-shadow:0 8px 32px #000; position:relative;">
                <button id="closeLogin"
                    style="position:absolute; top:12px; right:16px; background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">&times;</button>
                <h3 style="margin-top:0;">Log in to Traffy</h3>
                <form id="loginForm">
                    <div class="input-group">
                        <label for="loginEmail">Email</label>
                        <div class="glow-wrapper">
                            <input type="email" id="loginEmail" required />
                            <div class="glow"></div>
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="loginPassword">Password</label>
                        <div class="glow-wrapper">
                            <input type="password" id="loginPassword" required />
                            <div class="glow"></div>
                        </div>
                    </div>
                    <div class="glow-wrapper">
                        <button type="submit">Log in</button>
                        <div class="glow"></div>
                    </div>
                    <div id="loginError" style="color:#f55; margin-top:10px;"></div>
                </form>
            </div>
        </div>
    </section>

    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script src="js/script.js"></script>
</body>

</html>