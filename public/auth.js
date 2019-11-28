$('#loginButton').click(function(e) {
    e.preventDefault();
    handleLogin();
});

function handleLogin() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and password
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            return;
        });
        // User is authenticated
        console.log("user authenticated");
        location.href = "home.html";
    }
}

function sendPasswordReset() {
    var email = document.getElementById('email').value;
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        alert('Password Reset Email Sent!')
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
    });
}

function initApp() {
    console.log('Initializing app...');
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var email = user.email;
        } else {
            // User is signed out
        }
    });
}

window.onload = function() {
    initApp();
};