import { render, toast, smallSpinner } from './lib/utils.js';
import { navbar, table, modal, fullMapModal } from './homeTemplates.js';
import { getFirebase, setFirebase, removeFirebase } from './lib/database.js';
import { logout } from "./lib/database.js";

export function home(view, model) {
	model.currentId = null;
	// clear view
	view = {};
	// create navbar html
	view.navbar = navbar(model);
	view.modal = modal();
	view.modal2 = fullMapModal();
	// render view 
	render(view);
	// create table
	getODBs();
	// add functions to navbar
	addNavbarFunctions();

	// get ODBs from firebase
	function getODBs(search = null) {
		if (search == null) {
			getFirebase({ name: 'odb/' }).then(result => {
				model.odbArray = result;
				// create table html
				view.table = table({ array: result });
				// render view 
				render(view);
				// add view, edit, delete functions to all list
				addViewEditDeleteFunctions(result);
				// add navbar function new button, search button and exit button
				addNavbarFunctions();
			});
		} else {
			// create table html
			view.table = ``;
			view.table = table({ array: search });
			// render view 
			render(view);
			// add view, edit, delete functions to all list
			addViewEditDeleteFunctions(search);
			// add navbar function new button, search button and exit button
			addNavbarFunctions();
		}
		
	}

	// add navbar functions
	function addNavbarFunctions() {
		// add listener to port, if changes update seal options
		document.getElementById('port').addEventListener('change', event => {
			let portValue = document.getElementById('port').value;
			let sealOptions = ``;
			for (let i = 0; i < portValue; i++) {
				sealOptions += `<option>${ i + 1 }</option>`;
			}
			document.getElementById('seal').innerHTML = sealOptions;
		}, false);
		// get zone to the search zone dropdown menu
		let searchZones = ``;
		getFirebase({ name: 'zonas1/' }).then(result => {
			result.forEach(zone => {
				searchZones += `<a id="${ zone.description }" class="dropdown-item searchZone" href="#">${ zone.description }</a>`;
			})
		}).finally(() => {
			document.getElementById('searchZones').innerHTML = searchZones;
			// add events to search zone options
			let allZoneOptions = document.querySelectorAll('.searchZone');
			allZoneOptions.forEach(zoneOption => {
				zoneOption.onclick = event => {
					console.log(`click on zone: ${ zoneOption.id }`);
					filterZone(zoneOption.id);
				}
			});
		});
		// search Button
		document.querySelector('#searchButton').onclick = event => {
			console.log("searchButton");
			let identify = document.getElementById('identify').value;
			filterIdentify(identify);
		}
		// openMap function
		document.querySelector('#openMap').onclick = event => {
			console.log("open map with: ", model.odbArray);
			// create arrayLocations
			let arrayLocations = model.odbArray.map(odb => [ odb.identify, Number(odb.lat), Number(odb.lng) ]);
			// init map
			initFullmap(arrayLocations);
			// show modal
			$('#formModal2').modal('show');
		}
		// new Button
		document.querySelector('#newButton').onclick = event => {
			// reset values
			document.getElementById("zoneOption").value  = "";
			document.getElementById("identifyName").value  = "";
			document.getElementById("port").value  = "";
			document.getElementById("seal").value  = "";
			document.getElementById("observation").value = "";
			// init google maps
			initMap();
			// change modal title
			document.getElementById('modalTitle').innerHTML = "Registrar nueva caja NAP";
			// get zonas from firebase
			let zoneOptions = ``;
			getFirebase({ name: 'zonas1/' }).then(result => {
				result.forEach(zone => {
					zoneOptions += `<option selected>${ zone.description }</option>`;
				})
			}).finally(() => {
				document.getElementById('zoneOption').innerHTML = zoneOptions;
			});
			// add exit button function
			document.querySelector('#closeModalButton').onclick = event => {
				$('#formModal').modal('hide');
			}
			// add save button function
			saveButtonFunction();
			// show modal
			$('#formModal').modal('show');
		}
		// exit Button
		document.querySelector('#exitButton').onclick = event => {
			console.log("exitButton");
			logout();
		}
	}

	function filterZone(zone) {
		let search = model.odbArray.filter(odb => odb.zone === zone);
		getODBs(search);
	}

	function filterIdentify(identify) {
		let search = model.odbArray.filter(odb => odb.identify === identify);
		getODBs(search);
	}

	function saveButtonFunction() {
		document.querySelector('#saveModalButton').onclick = event => {
			// create form object
			let form = {
				id: model.currentId == null ? Date.now() : model.currentId,
				zone: document.getElementById("zoneOption").value,
				identify: document.getElementById("identifyName").value,
				port: document.getElementById("port").value,
				seal: document.getElementById("seal").value,
				lat: document.querySelector('#contactLat').value,
				lng: document.querySelector('#contactLng').value,
				observation: document.getElementById("observation").value
			}
			// validate
			if (form.id !== undefined && form.zone !== undefined && form.identify !== undefined && form.port !== undefined && form.seal !== undefined &&
				form.id !== null && form.zone !== null && form.identify !== null && form.port !== null && form.seal !== null &&
				form.id !== "" && form.zone !== "" && form.identify !== "" && form.port !== "" && form.seal !== "") {
				saveODB(form);
			} else {
				// toast alert
				document.getElementById('toast').innerHTML = toast({title: "Firebase", id: `${ form.identify }`, content: "Debe completar todos los campos para poder grabar."});
				$('#myToast').toast({ delay: 5000 });
				$('#myToast').toast('show');
			}
			model.currentId = null;
		}
	}

	function saveODB(form) {
		// save modal form to firebase
		setFirebase({ name: `odb/${ form.id }`, data: form });
		// hide modal
		$('#formModal').modal('hide');
		// update table
		getODBs();
		// toast alert
		document.getElementById('toast').innerHTML = toast({title: "Firebase", id: `${ form.identify }`, content: "Registro de caja NAP realizado con éxito!"});
		$('#myToast').toast({ delay: 5000 });
		$('#myToast').toast('show');
	}

	function addViewEditDeleteFunctions(odbArray) {
		// get all view, edit and delete buttons
		let viewButtons = document.querySelectorAll('.viewBtn');
		let editButtons = document.querySelectorAll('.editBtn');
		let deleteButtons = document.querySelectorAll('.deleteBtn');
		// add onclic listeners
		viewButtons.forEach(button => {
			button.onclick = event => {
				// init google maps
				initMap({ lat: odbArray[button.id].lat, lng: odbArray[button.id].lng });
				// change modal title
				document.getElementById('modalTitle').innerHTML = "Ver caja NAP";
				// disable save button
				document.getElementById("saveModalButton").disabled = true;
				// add values to fields
				// get zonas from firebase
				let zoneOptions = ``;
				getFirebase({ name: 'zonas1/' }).then(result => {
					result.forEach(zone => {
						zoneOptions += `<option selected>${ zone.description }</option>`;
					})
				}).finally(() => {
					document.getElementById('zoneOption').innerHTML = zoneOptions;
					document.getElementById("zoneOption").value  = odbArray[button.id].zone;
				});
				
				document.getElementById("identifyName").value  = odbArray[button.id].identify;
				document.getElementById("port").value  = odbArray[button.id].port;
				// update seal options
				let portValue = odbArray[button.id].port;
				let sealOptions = ``;
				for (let i = 0; i < portValue; i++) {
					sealOptions += `<option>${ i + 1 }</option>`;
				}
				document.getElementById('seal').innerHTML = sealOptions;
				document.getElementById("seal").value  = odbArray[button.id].seal;
				document.getElementById("observation").value = odbArray[button.id].observation;
				// readonly
				document.getElementById("zoneOption").disabled  = true;
				document.getElementById("identifyName").readOnly  = true;
				document.getElementById("port").disabled  = true;
				document.getElementById("seal").disabled  = true;
				document.getElementById("observation").readOnly = true; 
				// add exit button function
				document.querySelector('#closeModalButton').onclick = event => {
					$('#formModal').modal('hide');
					// readonly
					document.getElementById("zoneOption").disabled  = false;
					document.getElementById("identifyName").readOnly  = false;
					document.getElementById("port").disabled  = false;
					document.getElementById("seal").disabled  = false;
					document.getElementById("observation").readOnly = false;
					// disable save button
					document.getElementById("saveModalButton").disabled = false;
				}
				// show modal
				$('#formModal').modal('show');

			}
		});

		editButtons.forEach(button => {
			button.onclick = event => {
				model.currentId = odbArray[button.id].id;
				// init google maps
				initMap({ lat: odbArray[button.id].lat, lng: odbArray[button.id].lng }, true);
				// change modal title
				document.getElementById('modalTitle').innerHTML = "Editar caja NAP";
				// add values to fields
				// get zonas from firebase
				let zoneOptions = ``;
				getFirebase({ name: 'zonas1/' }).then(result => {
					result.forEach(zone => {
						zoneOptions += `<option selected>${ zone.description }</option>`;
					})
				}).finally(() => {
					document.getElementById('zoneOption').innerHTML = zoneOptions;
					document.getElementById("zoneOption").value  = odbArray[button.id].zone;
				});
				
				document.getElementById("identifyName").value  = odbArray[button.id].identify;
				document.getElementById("port").value  = odbArray[button.id].port;
				// update seal options
				let portValue = odbArray[button.id].port;
				let sealOptions = ``;
				for (let i = 0; i < portValue; i++) {
					sealOptions += `<option>${ i + 1 }</option>`;
				}
				document.getElementById('seal').innerHTML = sealOptions;
				document.getElementById("seal").value  = odbArray[button.id].seal;
				document.getElementById("observation").value = odbArray[button.id].observation;
				// add save button function
				saveButtonFunction();
				// add exit button function
				document.querySelector('#closeModalButton').onclick = event => {
					$('#formModal').modal('hide');
					model.currentId = null;
				}
				// show modal
				$('#formModal').modal('show');
			}
		});

		deleteButtons.forEach(button => {
			button.onclick = event => {
				// add spinner to delete button
				button.innerHTML = smallSpinner();
				// remove the current odb list from firebase
				removeFirebase({ name: `odb/${ odbArray[button.id].id }` }).then(result => {
					// toast alert
					document.getElementById('toast').innerHTML = toast({
						title: "Firebase", 
						id: `${ odbArray[button.id].identify }`, 
						content: "La caja NAP ha sido borrada de la base de datos con éxito!"
					});
					$('#myToast').toast({ delay: 5000 });
					$('#myToast').toast('show');
					// dispatch event to main, to refresh the page
					document.dispatchEvent(new CustomEvent('refresh', { detail: 'home' }));
				});
				
			}
		});
	}

	function initMap(positionFB = null, edit = false) {
		model.position = {};
		// get position
		navigator.geolocation.getCurrentPosition(position => {
			console.log("get position map");
			// update model position
			model.position.lat = positionFB == null ? position.coords.latitude : parseFloat(positionFB.lat);
			model.position.lng = positionFB == null ? position.coords.longitude : parseFloat(positionFB.lng);
			// update form values
			document.querySelector('#contactLat').value = model.position.lat;
			document.querySelector('#contactLng').value = model.position.lng;
			// init map
			let map = new google.maps.Map(document.getElementById('map'), {
			  zoom: 15,
			  center: model.position
			});
			
			// let towerIcon = {
			//     url: "../img/signal.png",
			//     scaledSize: new google.maps.Size(50, 50),
			// };
			
			let marker = new google.maps.Marker({
			  position: model.position,
			  map: map,
			  // icon: towerIcon,
			  draggable: positionFB == null || edit ?  true : false
			});
			if (positionFB == null || edit) {
				// marker position changed event 
				marker.addListener('position_changed', function() {
				    model.position.lat = marker.getPosition().lat();
					model.position.lng = marker.getPosition().lng();
				});
				// marker position changed 
				marker.addListener('mouseup', function() {
				    // update form values
				    document.querySelector('#contactLat').value = model.position.lat;
				    document.querySelector('#contactLng').value = model.position.lng;
				});
			}
		});
	}

	function initFullmap(locations) {
		
		    let map = new google.maps.Map(document.getElementById('map2'), {
		      zoom: 10,
		      center: new google.maps.LatLng(locations[0][1], locations[0][2]),
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    });

		    let infowindow = new google.maps.InfoWindow();

		    // let towerIcon = {
		    //     url: "../img/icon.png",
		    //     scaledSize: new google.maps.Size(50, 50),
		    // };

		    let marker, i;

		    for (i = 0; i < locations.length; i++) {  
		      marker = new google.maps.Marker({
		        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
		        map: map,
		       	// icon: towerIcon
		      });

		      google.maps.event.addListener(marker, 'click', (function(marker, i) {
		        return function() {
		          infowindow.setContent(locations[i][0]);
		          infowindow.open(map, marker);
		        }
		      })(marker, i));
		    }

		    // // Define the LatLng coordinates for the polygon's path.
      //       let shapeCoords = locations.map(element => { return { lat: element[1], lng: element[2] } });

      //       // Construct the polygon.
      //       let shape = new google.maps.Polygon({
      //         paths: shapeCoords,
      //         strokeColor: '#FF0000',
      //         strokeOpacity: 0.8,
      //         strokeWeight: 2,
      //         fillColor: '#FF0000',
      //         fillOpacity: 0.35
      //       });
      //       shape.setMap(map);

	}
	
}