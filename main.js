import { logIn } from "./pages/login.js";
import { home } from "./pages/home.js";

// create variables
let view = {};
let model = {};
// init
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	console.log("User is signed in");
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // update model
    model.userEmail = email;
    // init home
    home(view, model);
    // add refresh listener
    document.addEventListener('refresh', event => {
      if (event.detail == 'home') {
        // init home
        home(view, model);
      }
      
    }, false);

  } else {
  	console.log("User is signed out");
    // User is signed out.
    logIn(view, model);
  }
});

