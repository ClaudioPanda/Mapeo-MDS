// render graphics
export function render(obj, Login = false) {
	// create content object
	let content = document.getElementById('content');
	// clear content
	content.innerHTML = ``;
	// render all childs
	Object.values(obj).forEach(item => {
		content.innerHTML += item;
	});
}

export function toast(props) {
	return `<div aria-live="polite" aria-atomic="true" style="position: relative;" >
			  <div id="myToast" class="toast" style="position: absolute; top: 0; right: 0;" data-autohide="true">
			    <div class="toast-header bg-success">
			      <img src="" class="rounded mr-2" alt="">
			      <strong class="mr-auto text-white">${props.title}</strong>
			      <small class="text-white">${props.id}</small>
			      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
			        <span aria-hidden="true">&times;</span>
			      </button>
			    </div>
			    <div class="toast-body">
			      ${props.content}
			    </div>
			  </div>
			</div>`;
}

export function smallSpinner() {
	return `<div class="spinner-border spinner-border-sm" role="status"></div>`;
}