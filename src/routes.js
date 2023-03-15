const {
	getAllBooksHandler,
	getSpecificBookHandler,
	createBookHandler,
	updateBookHandler,
	deleteBookHandler
} = require('./handler')

const routes = [
	{
		method: 'GET',
		path: '/books',
		handler: getAllBooksHandler
	},
	{
		method: 'GET',
		path: '/books/{id}',
		handler: getSpecificBookHandler
	},
	{
		method: 'POST',
		path: '/books',
		handler: createBookHandler
	},
	{
		method: 'PUT',
		path: '/books/{id}',
		handler: updateBookHandler
	},
	{
		method: 'DELETE',
		path: '/books/{id}',
		handler: deleteBookHandler
	},
]

module.exports = routes