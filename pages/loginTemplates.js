export function form() {
	return `<div id="signin" class="text-center">
				<form class="form-signin">
					<img class="mb-4" src="img/logo1.png" width="200">
					<h1 class="h3 mb-3 font-weight-normal">Iniciar sesión</h1>
					<label for="inputEmail" class="sr-only">Correo</label>
					<input type="email" id="inputEmail" class="form-control" placeholder="Correo" required autofocus>
					<label for="inputPassword" class="sr-only">Contraseña</label>
					<input type="password" id="inputPassword" class="form-control" placeholder="Contraseña" required>
					<div class="checkbox mb-3">
						<label>
							<input type="checkbox" value="remember-me"> Recordar
						</label>
					</div>
					
				</form>
				<div class="form-signin">
					<button class="btn btn-lg btn-primary btn-block" id="enterBtn">Entrar</button>
					<p class="mt-5 mb-3 text-muted">&copy; Servisat 2020</p>
				</div>
			</div>`;
}