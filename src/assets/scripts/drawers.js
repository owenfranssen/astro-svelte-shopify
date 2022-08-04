window.addEventListener('load', () => {
	document.addEventListener('click', (event) => {
		if (
			event.target.hasAttribute('data-drawer-control') ||
			event.target.closest('[data-drawer-control]')
		) {
			const id =
				event.target.dataset.drawerControl ||
				event.target.closest('[data-drawer-control]').dataset.drawerControl;
			document.getElementById(id).classList.toggle('display');
		}
	});
});
