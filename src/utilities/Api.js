import axios from "axios"

let api_url = "http://blognyaroka.com:50134"
let image_api_upload_url = "http://blognyaroka.com:50344"
let image_dir_url = "http://blognyaroka.com:50333" 
// const API_URL = "http://localhost:3000"

if(process.env.NODE_ENV === 'production') {
	api_url = "http://10.6.35.100:4000"
	image_api_upload_url = "http://10.6.35.100:4100"
	image_dir_url = "http://10.6.35.100:4200" 
}

export const API_URL = api_url
export const IMAGE_API_UPLOAD_URL = image_api_upload_url
export const IMAGE_DIR_URL = image_dir_url

const API_OP = {
	login : {url : "/api/user/login", method: "POST"},

	getgroup : {url : "/api/group/all", method: "GET"},
	addgroup : {url : "/api/group/add", method: "PUT"},
	deletegroup : {url : "/api/group/", method: "DELETE"},
	updategroup : {url : "/api/group/", method: "POST"},

	adddevice : {url : "/api/hardware/add/", method: "PUT"},
	getdevicesbygroup : {url : "/api/hardware/byGroupId/", method: "GET"},
	deletedevice : {url : "/api/hardware/byHardwareId/", method: "DELETE"},
	deletedeviceingroup : {url : "/api/hardware/byGroupId/", method: "DELETE"},
	editdevice : {url : "/api/hardware/update/", method: "POST"},
	searchdevice : {url : '/api/hardware/search', method : "GET"},

	getusers : {url : "/api/user/all/", method: "GET"},
	deleteuser : {url : "/api/user/delete/", method: "DELETE"},
	adduser : {url : "/api/user/register/", method: "PUT"},
	updateuser : {url : "/api/user/", method: "POST"},
	searchuser : {url : '/api/user/search', method : "GET"},

	uploadprofpic : {url : "/api/upload/image/profpic", method : "POST"},
	uploaddevice : {url : "/api/upload/image/device", method : "POST"},

	dashboard : {url : "/api/dashboard/", method: "GET"}
}

var sendAPI = function(apiOp, data, successCallback, errorCallback) {
	var finalURL
	if(apiOp.finalURL !== undefined) {
		finalURL = API_URL + apiOp.finalURL
	} else {
		var operationURL = API_URL + apiOp.url
		finalURL = operationURL
	}


	switch(apiOp.method) {
		case "GET" :
			finalURL = (data === null) ? finalURL : finalURL + data
			axios.get(finalURL)
				.then(function(response) {
					if(response.status === 200) {
						if(typeof successCallback === "function") {
							successCallback(response)
						} else {
							errorCallback(response)
						}						
					} else {
						errorCallback(response)
					}
				})
				.catch(function(error) {
					if(typeof errorCallback === "function") {
						errorCallback(error.response)
					} else {
						errorCallback(null)
					}
				})
			break

		case "POST" : 
			let config = {
				headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			}
			axios.post(finalURL, data, config)
				.then(function(response) {
					if(response.status === 200) {
						if(typeof successCallback === "function") {
							successCallback(response)
						} else {
							errorCallback(null)
						}						
					} else {
						errorCallback(response.status)
					}
				})
				.catch(function(error) {
					if(typeof errorCallback === "function") {
						console.log(error)
						errorCallback(error.response)
					} else {
						errorCallback(null)
					}
				})
			break

		case "PUT" : 
			let configs = {
				headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
			}
			axios.put(finalURL, data, configs)
				.then(function(response) {
					if(response.status === 200) {
						if(typeof successCallback === "function") {
							successCallback(response)
						} else {
							errorCallback(null)
						}						
					} else {
						errorCallback(response.status)
					}
				})
				.catch(function(error) {
					if(typeof errorCallback === "function") {
						console.log(error.response)
						errorCallback(error.response)
					} else {
						errorCallback(null)
					}
				})
			break

		case "DELETE" : 
			finalURL = (data === null) ? finalURL : finalURL + data
			axios.delete(finalURL, data)
				.then(function(response) {
					if(response.status === 200) {
						if(typeof successCallback === "function") {
							successCallback(response)
						} else {
							errorCallback(null)
						}						
					} else {
						errorCallback(response.status)
					}
				},function(error) {
					if(typeof errorCallback === "function") {
						console.log(error.response)
						errorCallback(error.response)
					} else {
						errorCallback(null)
					}
				})
			break

		default : 
			break
	}
}

export const login = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.login, data, successCallback,errorCallback)
}

export const getGroup = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.getgroup, data, successCallback,errorCallback)
}

export const getDevicesByGroup = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.getdevicesbygroup, data, successCallback,errorCallback)
}

export const addDevice = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.adddevice, data, successCallback,errorCallback)
}

export const updateDevice = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.editdevice, data, successCallback,errorCallback)
}

export const getAllUsers = function(successCallback, errorCallback) {
	sendAPI(API_OP.getusers, null, successCallback,errorCallback)
}

export const deleteUser = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.deleteuser, data, successCallback,errorCallback)
}

export const deleteDevice = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.deletedevice, data, successCallback,errorCallback)
}

export const deleteDeviceInGroup = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.deletedeviceingroup, data, successCallback,errorCallback)
}

export const addUser = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.adduser, data, successCallback,errorCallback)
}

export const updateUser = function(data, paramsString, successCallback, errorCallback) {
	var apiOperation = API_OP.updateuser
	apiOperation.finalURL = API_OP.updateuser.url + paramsString
	sendAPI(apiOperation, data, successCallback,errorCallback)
}

export const updateGroup = function(data, paramsString, successCallback, errorCallback) {
	var apiOperation = API_OP.updategroup
	apiOperation.finalURL = API_OP.deletegroup.url + paramsString
	sendAPI(apiOperation, data, successCallback,errorCallback)
}

export const deleteGroup = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.deletegroup, data, successCallback,errorCallback)
}

export const addGroup = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.addgroup, data, successCallback,errorCallback)
}

export const uploadProfPic = function(data, successCallback, errorCallback) {
	let config = {
		headers: {'Accept': 'application/json', 'Content-Type': 'multipart/form-data'},
	}

	axios.post(IMAGE_API_UPLOAD_URL + API_OP.uploadprofpic.url, data, config)
		.then(function(response) {
			if(response.status === 200) {
				if(typeof successCallback === "function") {
					successCallback(response)
				} else {
					errorCallback(null)
				}						
			} else {
				errorCallback(response.status)
			}
		})
		.catch(function(error) {
			if(typeof errorCallback === "function") {
				console.log(error)
				errorCallback(error.response)
			} else {
				errorCallback(null)
			}
		})
}

export const uploadDevice = function(data, successCallback, errorCallback) {
		let config = {
		headers: {'Accept': 'application/json', 'Content-Type': 'multipart/form-data'},
	}
	
	axios.post(IMAGE_API_UPLOAD_URL + API_OP.uploaddevice.url, data, config)
		.then(function(response) {
			if(response.status === 200) {
				if(typeof successCallback === "function") {
					successCallback(response)
				} else {
					errorCallback(null)
				}						
			} else {
				errorCallback(response.status)
			}
		})
		.catch(function(error) {
			if(typeof errorCallback === "function") {
				console.log(error)
				errorCallback(error.response)
			} else {
				errorCallback(null)
			}
		})
}

export const getDashboardInfo = function(successCallback, errorCallback) {
	sendAPI(API_OP.dashboard, null, successCallback,errorCallback)
}

export const getUsersBySearch = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.searchuser, data, successCallback, errorCallback)
}

export const getDevicesBySearch = function(data, successCallback, errorCallback) {
	sendAPI(API_OP.searchdevice, data, successCallback, errorCallback)
}