export default function ApiResult (response, error, result) {
	if (error)
		response.status(200).json({ Success: false, Message: error.message ? error.message : error, Result: null })
	else response.status(200).json({ Success: true, Message: 'Ok', Result: result })
}
