window.addEventListener('load', () => {
	[...document.querySelectorAll('[data-drawer-control]')].forEach((control) => {
		control.addEventListener('click', (event) => {
			const id = event.currentTarget.dataset.drawerControl;
			document.getElementById(id).classList.toggle('display');
		});
	});
});
