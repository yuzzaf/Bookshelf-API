const { nanoid } = require('nanoid')
const books = require('./books')
const { responseSuccess, responseError } = require('./response')

const getAllBooksHandler = (req, h) => {
	try {
		const {
			name,
			reading,
			finished
		} = req.query

		const filteredBooks = books
			.filter((book) => {
				return (name ? (book.name.toLowerCase().includes(name.toLowerCase())) : true)
			})
			.filter((book) => {
				return (reading && ['0', '1'].includes(reading.toString()) ? book.reading == (reading.toString() == '1') : true)
			})
			.filter((book) => {
				return (finished && ['0', '1'].includes(finished.toString()) ? book.finished == (finished.toString() == '1') : true)
			})
			.map((book) => {
				return {
					id: book.id,
					name: book.name,
					publisher: book.publisher
				}
			})

		return h.response(responseSuccess({
			books: filteredBooks
		}))
	} catch (err) {
		console.log(err)
		return h.response(responseError('Buku gagal didapatkan'))
			.code(500)
	}
}

const getSpecificBookHandler = (req, h) => {
	try {
		const { id } = req.params
		const book = books.filter((item) => item.id === id)[0]

		if (book)
			return h.response(responseSuccess({ book }))
		else
			return h.response(responseError('Buku tidak ditemukan')).code(404)
	} catch (err) {
		console.error(err)
		return h.response(responseError('Buku gagal didapatkan'))
			.code(500)
	}
}

const createBookHandler = (req, h) => {
	try {
		const {
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading
		} = req.payload

		const validationError = validateBookPayload(req.payload)
		if (validationError)
			return h.response(responseError(validationError))
				.code(400)

		// processing additional datas and adding new book
		const id = nanoid(16)
		const insertedAt = new Date().toISOString()
		const updatedAt = insertedAt
		const finished = readPage === pageCount

		const newBook = {
			id,
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			finished,
			reading,
			insertedAt,
			updatedAt,
		}
		books.push(newBook)

		return h.response(responseSuccess({
			bookId: id
		}, 'Buku berhasil ditambahkan'))
			.code(201)
	} catch (err) {
		console.log(err)
		return h.response(responseError('Buku gagal ditambahkan'))
			.code(500)
	}
}

const updateBookHandler = (req, h) => {
	try {
		const { id } = req.params
		const {
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading
		} = req.payload

		const validationError = validateBookPayload(req.payload, true)
		if (validationError)
			return h.response(responseError(validationError))
				.code(400)

		const bookIndex = books.findIndex((item) => item.id === id)
		const updatedAt = new Date().toISOString()

		if (bookIndex !== -1) {
			books[bookIndex] = {
				...books[bookIndex],
				name,
				year,
				author,
				summary,
				publisher,
				pageCount,
				readPage,
				reading,
				updatedAt
			}
			return h.response(responseSuccess({}, 'Buku berhasil diperbarui'))
		} else
			return h.response(responseError('Gagal memperbarui buku. Id tidak ditemukan'))
				.code(404)
	} catch (err) {
		console.log(err)
		return h.response(responseError('Buku gagal diedit'))
			.code(500)
	}
}

const deleteBookHandler = (req, h) => {
	try {
		const { id } = req.params
		const bookIndex = books.findIndex((item) => item.id === id)

		if (bookIndex !== -1) {
			books.splice(bookIndex, 1)
			return h.response(responseSuccess({}, 'Buku berhasil dihapus'))
		} else
			return h.response(responseError('Buku gagal dihapus. Id tidak ditemukan'))
				.code(404)
	} catch (err) {
		console.log(err)
		return h.response(responseError('Buku gagal dihapus'))
			.code(500)
	}
}

const validateBookPayload = ({
	name,
	year,
	author,
	summary,
	publisher,
	pageCount,
	readPage,
	reading
}, isEdit = false) => {
	const operation = isEdit ? 'memperbarui' : 'menambahkan'
	// mandatory validation
	if (!name)
		return `Gagal ${operation} buku. Mohon isi nama buku`
	if (!year)
		return `Gagal ${operation} buku. Mohon isi tahun terbit buku`
	if (!author)
		return `Gagal ${operation} buku. Mohon isi penulis buku`
	if (!summary)
		return `Gagal ${operation} buku. Mohon isi ringkasan buku`
	if (!publisher)
		return `Gagal ${operation} buku. Mohon isi penerbit buku`
	if (pageCount === undefined || pageCount === '')
		return `Gagal ${operation} buku. Mohon isi jumlah halaman buku`
	if (readPage === undefined || readPage === '')
		return `Gagal ${operation} buku. Mohon isi jumlah halaman yang sudah dibaca`

	// advance validation
	if (typeof (year) !== 'number')
		return `Gagal ${operation} buku. Tahun terbit harus berisi angka`
	if (typeof (pageCount) !== 'number')
		return `Gagal ${operation} buku. Jumlah Halaman harus berisi angka`
	if (typeof (readPage) !== 'number')
		return `Gagal ${operation} buku. Jumlah Halaman yang dibaca harus berisi angka`
	if (year.toString().length < 4)
		return `Gagal ${operation} buku. Tahun terbit tidak valid`
	if (pageCount < 0)
		return `Gagal ${operation} buku. Jumlah Halaman tidak valid`
	if (readPage < 0)
		return `Gagal ${operation} buku. Jumlah Halaman yang dibaca tidak valid`
	if (readPage > pageCount)
		return `Gagal ${operation} buku. readPage tidak boleh lebih besar dari pageCount`
	if (typeof (reading) !== 'boolean')
		return `Gagal ${operation} buku. Status membaca tidak valid`

	return null
}

module.exports = {
	getAllBooksHandler,
	getSpecificBookHandler,
	createBookHandler,
	updateBookHandler,
	deleteBookHandler
}