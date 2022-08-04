// Theme.routes = {
// 	cart_add: "{{ routes.cart_add_url }}",
// 	cart_change: '{{ routes.cart_change_url }}',
// 	cart_update: '{{ routes.cart_update_url }}',
// 	predictive_search_url: '{{ routes.predictive_search_url }}'
// };

// Theme.settings = {
// 	cart_action: "{{ settings.cart_action }}",
// 	cart_message: "{{ settings.cart_message }}",
// 	display_special_instructions: "{{ settings.display_special_instructions }}",
// };

const Theme = {
	Settings: {
		locale: {
			product: {
				available: 'In stock and ready to ship',
				sold_out_out: 'Sold out'
			},
			product_form: {
				add_to_cart: 'Add to bag',
				available: 'Available',
				quantity: 'Quantity',
				sold_out: 'Sold out',
				unavailable: 'Not available',
			},
		},
		money_format: '{{ shop.money_format }}',
	},
	Routes: {
		cart_add: '#',
		cart_change: '#',
		cart_update: '#',
	},
};

export default Theme;
