export function navbar(props) {
	return `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
				<a class="navbar-brand" href="#">CAJAS NAP</a>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>

				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav mr-auto">
						<li class="nav-item active">
							<button id="newButton" class="btn btn-primary" type="button"><i class="fas fa-file"></i> Nuevo</button>
						</li>
						<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								Zonas
							</a>
							<div id="searchZones" class="dropdown-menu" aria-labelledby="navbarDropdown">

							</div>
						</li>
					</ul>
					<form class="form-inline my-2 my-lg-0">
						<div class="text-white mr-2 ">${ props.userEmail }</div>
						<input id="identify" class="form-control mr-sm-2" type="search" placeholder="Identificador" aria-label="Search">
						<button id="searchButton" class="btn btn-success my-2 my-sm-0" type="submit">Buscar</button>
						<button id="openMap" class="btn btn-primary ml-2"><i class="fas fa-globe-americas"></i></button>
						<button id="exitButton" class="btn btn-secondary ml-2" type="button">Salir <i class="fas fa-sign-out-alt"></i></button>
					</form>
				</div>
			</nav>`;
}

export function table(props) {
	// create rows from array of OSBs
	let rows = ``;
	props.array.forEach((item, index) => {
		rows += `<tr>
					<th scope="row">${ index }</th>
					<td>${ item.zone }</td>
					<td>${ item.identify }</td>
					<td>${ item.port }</td>
					<td>${ item.seal }</td>
					<td>
						<button id="${ index }" type="button" class="btn btn-primary viewBtn"><i class="fas fa-eye"></i></button>
						<button id="${ index }" type="button" class="btn btn-warning editBtn"><i class="fas fa-edit"></i></button>
						<button id="${ index }" type="button" class="btn btn-danger deleteBtn"><i class="fas fa-trash-alt"></i></button>
					</td>
				</tr>`;
	});
	// return the table
	return `<table class="table table-striped table-hover">
			<thead>
				<tr>
					<th scope="col">#</th>
					<th scope="col">Zona</th>
					<th scope="col">Identificador</th>
					<th scope="col">Puertos</th>
					<th scope="col">Precinto</th>
					<th scope="col">Opciones</th>
				</tr>
			</thead>
			<tbody>
				${ rows }
			</tbody>
			</table>`;
}

export function modal() {
	return `<div class="modal fade" id="formModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
				<div class="modal-dialog modal-lg" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="modalTitle">Title</h5>
							
						</div>
						<div class="modal-body">
							<div class="container-fluid">
								<div id="map"></div>
							</div>
							<form>
								<div id="zoneContainer" class="form-group">
									<label for="zoneOption" class="col-form-label">Zonas</label>
									<select id="zoneOption" class="form-control">
		                      			
		                    		</select>
								</div>
								<div class="form-group">
									<label for="identifyName" class="col-form-label">Identificador</label>
									<input type="text" class="form-control" id="identifyName">
								</div>
								<div id="portContainer" class="form-group">
									<label for="port" class="col-form-label">Puertos</label>
									<select id="port" class="form-control">
		                      			<option >4</option>
		                      			<option >8</option>
		                      			<option >16</option>
		                    		</select>
								</div>
								<div class="form-group">
									<label for="seal" class="col-form-label">Precinto</label>
									<select id="seal" class="form-control">
		                      			
		                    		</select>
								</div>
								<br>
								<div class="form-inline">
								    <label for="contactLat" class="mr-2">Latitud</label>
								    <input class="form-control mr-2" id="contactLat" name="contactLat" readonly>
								    <label for="contactLng" class="mr-2">Longitud</label>
								    <input class="form-control mr-2" id="contactLng" name="contactLng" readonly>
								</div>
								<br>
								<div class="form-group">
								    <label for="observation">Observación</label>
								    <textarea class="form-control" id="observation" rows="3"></textarea>
								</div>
							</form>
						</div>
						<div class="modal-footer">
							<button id="closeModalButton" type="button" class="btn btn-secondary">Cerrar</button>
							<button id="saveModalButton" type="button" class="btn btn-primary">Grabar</button>
						</div>
					</div>
				</div>
			</div>`;
}

export function fullMapModal() {
	return `<div class="modal fade bd-example-modal-xl" id="formModal2" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
			  <div class="modal-dialog modal-xl" role="document">
			    <div class="modal-content">
				    <div class="modal-header">
						<h5 class="modal-title" id="modalTitle2">Mapa completo de cajas NAP</h5>
					</div>
					<div class="modal-body">
						<div class="container-fluid">
							<div id="map2"></div>
						</div>
					</div>
			    </div>
			  </div>
			</div>`;
}