document.getElementById("sign-in-btn").style.visibility = "hidden";
document.getElementById("pin").style.visibility = "hidden";

var firebaseConfig = {
	apiKey: "AIzaSyCSS2JWgbpYcxuGdU6CshGR2tID0KmrK-w",
	authDomain: "amstatbot-40341.firebaseapp.com",
	databaseURL: "https://amstatbot-40341.firebaseio.com",
	projectId: "amstatbot-40341",
	storageBucket: "amstatbot-40341.appspot.com",
	messagingSenderId: "454296005924",
	appId: "1:454296005924:web:c2436c65ff45efd760d7b1",
	measurementId: "G-HKN4L0EWV4",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function render() {
	window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
		"recaptcha-container"
	);
	recaptchaVerifier.render();
}

render();

function verify() {
	let phone_number = document.getElementById("phone_number").value;
	firebase
		.auth()
		.signInWithPhoneNumber("+91" + phone_number, window.recaptchaVerifier)
		.then(function (confirmationResult) {
			window.confirmationResult = confirmationResult;
			coderesult = confirmationResult;
			console.log(coderesult + "Message Sent");
			document.getElementById("pin").style.visibility = "visible";
			document.getElementById("sign-in-btn").style.visibility = "visible";
			document.getElementById("verify-btn").style.visibility = "hidden";
			document.getElementById("recaptcha-container").style.visibility =
				"hidden";
		})
		.catch(function (error) {
			console.log(error.message);
		});
}

function signIn() {
	var code = document.getElementById("pin").value;
	coderesult
		.confirm(code)
		.then(function (result) {
			console.log("registered");
			window.location = "index.html";
		})
		.catch(function (error) {
			console.log(error.message);
		});
}
