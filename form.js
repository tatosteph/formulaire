

 var Meeting = Parse.Object.extend("meeting");
var query = new Parse.Query(Meeting);
query.find().then(function(meetings) {
  // Ajouter les options à la liste déroulante
  var select = document.getElementById("meeting-select");
  meetings.forEach(function(meeting) {
    var option = document.createElement("option");
    option.value = meeting.id;
    option.text = meeting.get("date").toUTCString() + " - " + meeting.get("adresse");
    select.appendChild(option);
  });
});
// annescolaire
  var Anneescolaire = Parse.Object.extend("anneescolaire");
var querys = new Parse.Query(Anneescolaire);
querys.find().then(function(annees) {
  // Ajouter les options à la liste déroulante
  var select = document.getElementById("annee-scolaire-select");
  annees.forEach(function(annee) {
    var option = document.createElement("option");
    option.value = annee.id;
    option.text = annee.get("classekids");
    select.appendChild(option);
  });
});

// Gérer la soumission du formulaire d'inscription
document.getElementById("signup-form").addEventListener("submit", function(event) {
  event.preventDefault();

  
 var username = document.getElementById("username").value;
 var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var meetingId = document.getElementById("meeting-select").value;
  var anneescolaireId = document.getElementById("annee-scolaire-select").value;
 
  // Créer un nouvel objet "user"
 var User = Parse.Object.extend("User");
  var user = new User();
  user.set("username", username);
  user.set("email", email);
  user.set("password", password);
//tato
  // Générer un lien unique pour l'utilisateur
  var uniqueLink = "http://192.168.1.229:5500/form.html";

  user.signUp().then(function () {
  console.log("Inscription réussie");
  });

  // Récupérer l'objet "meeting" sélectionné
  var Meeting = Parse.Object.extend("meeting");
  var meetingQuery = new Parse.Query(Meeting);
  var Anneescolaire = Parse.Object.extend("anneescolaire");
  var anneescolaireQuery = new Parse.Query(Anneescolaire);
  var meeting;
  var anneescolaire;

  meetingQuery.get(meetingId).then(function(meetingResult) {
    meeting = meetingResult;
    return anneescolaireQuery.get(anneescolaireId);
    }).then(function(anneescolaireResult) {
      anneescolaire = anneescolaireResult;
    // Créer un nouvel objet "enregistrement" et lier les objets "user", "meeting" et "anneescolaire"
    var Enregistrement = Parse.Object.extend("enregistrement");
    var enregistrement = new Enregistrement();
    enregistrement.set("user", user);
    enregistrement.set("meeting", meeting);
    enregistrement.set("anneescolaire", anneescolaireResult);
    // Sauvegarder les objets dans la base de données
    return enregistrement.save();
  }).then(function() {

    var templateParams = {
      to_name : username,
      to_email: email,
      user_link: uniqueLink
    };
    
    emailjs.send('service_e7432dl', 'template_as6qnpk',templateParams )
      .then(function(response) {
        console.log("E-mail de confirmation envoyé");
      }, function(error) {
        console.log("Erreur lors de l'envoi de l'e-mail de confirmation: " + error);
      });

  }).then(function() {
    document.getElementById("signup-form").reset()
  }).catch(function(error) {
    // Afficher une erreur si quelque chose a échoué
    alert("Error: " + error.message);
  });
   /* document.getElementById("signup-form").reset()
  }).catch(function(error) {
    // Afficher une erreur si quelque chose a échoué
    alert("Error: " + error.message);
  });*/
});
// Gérer la soumission du formulaire de connexion
document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  var usernames = document.getElementById("usernames").value;
  var passwords = document.getElementById("passwords").value;
   var emails = document.getElementById("emails").value;
   const modifyButton = document.querySelector("#modify-button");
   const updateForm = document.querySelector("#update-form");
  // Connecter l'utilisateur
  Parse.User.logIn(usernames, passwords,emails).then(function(user) {
    var currentUser = Parse.User.current();
if (currentUser) {
  // L'utilisateur est connecté
  modifyButton.style.display = "block";
} else {
  // L'utilisateur n'est pas connecté
  console.log("L'utilisateur n'est pas connecté");
  window.location.href = "/login";
}
    // Récupérer les informations d'inscription de l'utilisateur
    var Enregistrement = Parse.Object.extend("enregistrement");
    var query = new Parse.Query(Enregistrement);
    query.include("meeting");
    query.equalTo("user", user);
    return query.first();
  }).then(function(enregistrement) {
    // Afficher les informations d'inscription de l'utilisateur
    var meeting = enregistrement.get("meeting");
    var date = meeting.get("date");
    var address = meeting.get("adresse");
    document.getElementById("result").innerHTML = "Vous êtes inscrit à la réunion du " +  date.toUTCString().slice(0, -3) + " à l'adresse " + " :" + address
    document.getElementById("login-form").reset();
  }).catch(function(error) {
    // Afficher une erreur si la connexion a échoué
    alert("Error: " + error.message);
  });
});
var mail = document.getElementById("mail")
document.getElementById("modify-button").onclick = function() {
  document.getElementById("update-form").style.display = "block";
}
var currentUser = Parse.User.current();

if (currentUser) {
  // Mettre à jour l'adresse email de l'utilisateur
  currentUser.set("email", "mail");
  currentUser.set("newPasswords", "password");

  // Sauvegarder les modifications
  currentUser.save(null, {
    success: function(user) {
      // Mise à jour réussie
      console.log("Adresse email mise à jour avec succès");
      console.log("Mot de passe mis à jour avec succès");
    },
    error: function(user, error) {
      // Mise à jour échouée
      console.error("Erreur lors de la mise à jour de l'adresse email: " + error.message);
      console.error("Erreur lors de la mise à jour du mot de passe: " + error.message);
    }
  });
} else {
  console.error("Aucun utilisateur actuellement connecté");
}
// Référencez le formulaire dans votre code JavaScript
var form = document.getElementById("update-form");

// Écoutez l'événement de soumission de formulaire
form.addEventListener("submit", function(event) {
  event.preventDefault();
  
  // Récupérer l'objet de l'utilisateur connecté
  var currentUserMail = Parse.User.current();
  var currentUserPass = Parse.User.current();
  
  // Récupérer la nouvelle adresse email du formulaire
  var email = form.elements.email.value;
  var newPass = form.elements.password.value;
  
  // Mettre à jour l'adresse email de l'utilisateur
  currentUserMail.set("email", email);
  currentUserPass.set("password", newPass);
  
  // Sauvegarder les modifications
  currentUserMail.save(null, {
    success: function(user) {
      // Mise à jour réussie
      console.log("Adresse email mise à jour avec succès");
    },
    error: function(user, error) {
      // Mise à jour échouée
      console.error("Erreur lors de la mise à jour de l'adresse email: " + error.message);
    }
  });
  currentUserPass.save(null, {
    success: function(user) {
      // Mise à jour réussie
      console.log("Mot de passe mis à jour avec succès");
    },
    error: function(user, error) {
      // Mise à jour échouée
      console.error("Erreur lors de la mise à jour du Mot de passe: " + error.message);
    }
  });
});



