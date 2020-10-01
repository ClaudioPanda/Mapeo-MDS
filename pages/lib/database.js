export function getFirebase(props) {
	let result = new Promise((resolve, reject) => {
		firebase.database().ref(props.name).once('value').then(snapshot => {
			//get object data
			let obj = snapshot.val();
			//if obj is not null
			if (obj !== null) {
				// convert obj data to array
				let array = Object.keys(obj).map(key => {
					return obj[key];
				});
				// return result
				resolve(array);
			}
		});
	});
	// return the promise
	return result;
}

export function setFirebase(props) {
	let fb = firebase.database().ref(props.name);
	fb.set(props.data);
}

export function removeFirebase(props) {
	let result = new Promise((resolve, reject) => {
		let fb = firebase.database().ref(props.name);
		fb.remove().then(() => resolve('removed!'));
	})
	return result;
}

export function login(form) {
	let result = new Promise((resolve, reject) => {
		firebase.auth().signInWithEmailAndPassword(form.email, form.pass).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			resolve({ error: errorCode, message: errorMessage });
		});
	});
	return result;
}

export function logout() {
	let result = new Promise((resolve, reject) => {
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  resolve({ message: "Cierre de sesión exitoso." });
		}).catch(function(error) {
		  // An error happened.
		  reject({ message: "Ocurrió un error" });
		});

	})
	return result;
}