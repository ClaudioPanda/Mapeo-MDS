import { render, toast } from "./lib/utils.js";
import { login } from "./lib/database.js";
import { form } from "./loginTemplates.js";

export function logIn(view, model) {
	// clear view
	view = {};
	// create form data
	let formData = {};
	// crate form
	view.form = form();
	// call render graphics
	render(view, true);
	// add listeners
	document.querySelector('#enterBtn').onclick = event => {
		// capture form values
		formData.email = document.getElementById('inputEmail').value;
		formData.pass = document.getElementById('inputPassword').value;
		// try to login
		login(formData).then(result => {
			console.log(`Error code: ${result.error} - Message: ${result.message}`);
			if (result.error == "auth/wrong-password") {
				document.getElementById('toast').innerHTML = toast({title: "Error", id: `contraseña incorrecta`, content: "La contraseña no es válida o el usuario no tiene una contraseña."});
				$('#myToast').toast({ delay: 5000 });
				$('#myToast').toast('show');
			} else if (result.error == "auth/too-many-requests") {
				document.getElementById('toast').innerHTML = toast({title: "Error", id: `demasiadas solicitudes`, content: "Demasiados intentos de inicio de sesión fallidos. Por favor, inténtelo de nuevo más tarde."});
				$('#myToast').toast({ delay: 5000 });
				$('#myToast').toast('show');
			} else if (result.error == "auth/invalid-email") {
				document.getElementById('toast').innerHTML = toast({title: "Error", id: `email inválido`, content: "La dirección de correo electrónico está mal formateada."});
				$('#myToast').toast({ delay: 5000 });
				$('#myToast').toast('show');
			} else if (result.error == "auth/user-not-found") {
				document.getElementById('toast').innerHTML = toast({title: "Error", id: `Usuario no encontrado`, content: "No hay registro de usuario correspondiente a este identificador. El usuario puede haber sido eliminado."});
				$('#myToast').toast({ delay: 5000 });
				$('#myToast').toast('show');
			}
			else {
				// location.reload(true);
			}
		});

	};

}