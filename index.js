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

let chatDatabaseReference = firebase.database().ref();

let listgrp = document.getElementById("lstgrp");
let message_box = document.getElementById("message");

loadMessages();

function loadMessages() {
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			let userId = user.uid;

			var fb_ref = firebase.database().ref().child("chats").child(userId);
			fb_ref.on("child_added", (snap) => {
				if (snap.exists()) {
					element = snap.val();
					if (element.id == 1) {
						let msg_ = element.message;
						listgrp.innerHTML += `<div class="chat-item-right">
					<p class="message">${element.message}</p>
					<p class="time">${element.time}</p>
				</div>`;
					} else {
						if (element.type == "stock") {
							let close = element.close;
							let percent = element.percent;
							let high = element.high;
							let low = element.low;
							let open = element.open;
							let volume = element.volume;
							let graph = element.website;

							listgrp.innerHTML += `<div class="chat-item-stock-right">
				<div class="stock-head">
					<div class="stock-name-sym">
						<p class="stock-name">${element.name}</p>
						<p class="stock-sym">(${element.symbol})</p>
					</div>

					<div class="graph">
						<a href="${graph}" target="_blank"><img  src="img/graph.png" alt="" width="30" /></a>
					</div>
				</div>
				<hr />
				<div class="stock-body-one">
					<div class="stock-item">
						<img src="img/close.png" alt="" width="30" />
						<p>Close</p>
						<p>${close.toFixed(2)}</p>
					</div>

					<div class="stock-item">
						<img src="img/percent_negative.png" alt="" width="30" />
						<p>Percentage</p>
						<p>${percent.toFixed(2)}</p>
					</div>

					<div class="stock-item">
						<img src="img/high.png" alt="" width="30" />
						<p>High</p>
						<p>${high.toFixed(2)}</p>
					</div>
				</div>
				<div class="stock-body-two">
					<div class="stock-item">
						<img src="img/low.png" alt="" width="30" />
						<p>Low</p>
						<p>${low.toFixed(2)}</p>
					</div>

					<div class="stock-item">
						<img src="img/open.png" alt="" width="30" />
						<p>Open</p>
						<p>${open.toFixed(2)}</p>
					</div>

					<div class="stock-item">
						<img src="img/volume.png" alt="" width="30" />
						<p>Volume</p>
						<p>${volume.toFixed(2)}</p>
					</div>
				</div>
				<hr />
				<div class="stock-tail">
					<p class="time">${element.time}</p>
				</div>
			</div>`;
						} else if (element.type == "loading") {
							listgrp.innerHTML += `<div class="chat-loading">
				<div class="dot-typing"></div>
			</div>`;
						} else {
							let msg_ = element.message;
							// 			listgrp.innerHTML += `<div class="chat-item-left">
							// 	<p class="message">${element.message}</p>
							// 	<p class="time">${element.time}</p>
							// </div>`;
							if (msg_.includes("https")) {
								console.log("hhhih");
								listgrp.innerHTML += `<div class="chat-item-left">
					<a href="${msg_}" target="_blank"><p class="message">${element.message}</p></a>
					<p class="time">${element.time}</p>
				</div>`;
							} else {
								listgrp.innerHTML += `<div class="chat-item-left">
					<p class="message">${element.message}</p>
					<p class="time">${element.time}</p>
				</div>`;
							}
						}
					}

					scrollBottom();
				} else {
					console.log("No data available");
				}
			});
		} else {
			window.location = "login.html";
		}
	});
}

function logout() {
	firebase
		.auth()
		.signOut()
		.then(() => {
			window.location = "login.html";
		})
		.catch((error) => {
			// An error happened.
		});
}

function getMessage() {
	getLoading();
	let mes = message_box.value;
	var key = firebase.database().ref().child("chats").push().key;
	message_box.value = "";
	var userId = firebase.auth().currentUser.uid;
	let date = new Date();
	let time = date.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	firebase
		.database()
		.ref("chats/" + userId + "/" + key + "aaa")
		.set({
			id: 1,
			message: mes,
			time: time,
			type: "text",
		});
	if (mes != "") {
		if (mes.includes("_")) {
			$.ajax({
				method: "POST",
				url: "https://amstatbot.herokuapp.com/predict/",
				data: { message: mes, type: 2 },
			}).then((response) => {
				getStockResponse(response);
			});
		} else {
			$.ajax({
				method: "POST",
				url: "https://amstatbot.herokuapp.com/predict/",
				data: { message: mes, type: 1 },
			}).then((response) => {
				getChatResponse(response);
			});
		}
	} else {
		alert("Ask Bot Something!");
	}
}

function visitGraph(graph) {
	window.location = graph;
}

function getLoading() {
	var userId = firebase.auth().currentUser.uid;
	firebase
		.database()
		.ref("chats/" + userId + "/loading")
		.set({
			id: 0,
			message: "",
			type: "loading",
		});
}

function removeLoading() {
	var userId = firebase.auth().currentUser.uid;
	firebase
		.database()
		.ref("chats/" + userId + "/loading")
		.remove();
}

function getStockResponse(response) {
	let date = new Date();
	let time = date.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	var userId = firebase.auth().currentUser.uid;
	var key = firebase.database().ref().child("chats").push().key;
	firebase
		.database()
		.ref("chats/" + userId + "/" + key + "aaa")
		.set({
			id: 0,
			close: response.response.close,
			high: response.response.high,
			low: response.response.low,
			name: response.response.name,
			open: response.response.open,
			percent: response.response.percent,
			symbol: response.response.symbol,
			volume: response.response.volume,
			website: response.response.website,
			time: time,
			type: "stock",
		});
	loadMessages();
	removeLoading();
	scrollBottom();
}

function getChatResponse(response) {
	let date = new Date();
	let time = date.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	var userId = firebase.auth().currentUser.uid;
	var key = firebase.database().ref().child("chats").push().key;
	firebase
		.database()
		.ref("chats/" + userId + "/" + key + "aaa")
		.set({
			id: 0,
			message: response.response,
			time: time,
			type: "chat",
		});
	loadMessages();
	removeLoading();
	scrollBottom();
}

function scrollBottom() {
	$(document).ready(function () {
		$(document).scrollTop($(document).height());
	});
}
