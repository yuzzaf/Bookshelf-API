const responseSuccess = (data, message = 'Success') => {
	return {
		status: 'success',
		message: message,
		data: data
	}
}

const responseError = (message = 'Error') => {
	return {
		status: 'fail',
		message: message,
	}
}

module.exports = {
	responseSuccess,
	responseError
}