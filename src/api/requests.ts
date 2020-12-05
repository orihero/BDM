import axios from "axios";
import { formData } from "../utils/formData";
import { userLoggedIn } from "../redux/actions";

// export let url = "http://192.168.1.9:8282/api";
export let url = "http://api-mobile.24m.uz/api";

export let configureAxios = storeInstance => {
	axios.interceptors.request.use(res => {
		let token = storeInstance.getState().user.accessToken;
		if (token) {
			res.headers.Authorization = `Bearer ${token}`;
		}
		// TODO navigate(login)
		return res;
	});

	let interceptor = axios.interceptors.response.use(
		res => {
			return Promise.resolve(res);
		},
		error => {
			console.warn(error.response);
			if (!error || !error.response || error.response.status !== 401) {
				return Promise.reject(error);
			}
			axios.interceptors.response.eject(interceptor);
			return requests.auth
				.refreshToken({
					refreshToken: storeInstance.getState().user.refreshToken
				})
				.then(res => {
					error.response.config.headers = {
						Authorization: `Bearer ${res.data.data}`
					};
					storeInstance.dispatch(userLoggedIn(res.data));
					return axios(error.response.config);
				})
				.catch(response => {
					console.warn(response.response);
					return Promise.reject(response);
				})
				.finally(() => configureAxios(storeInstance));
		}
	);
};

export let requests = {
	auth: {
		login: data =>
			axios.post(
				`${url}/auth/login?type=${data.userName ? 2 : 1}`,
				data,
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			),
		refreshToken: refreshToken =>
			axios.post(`${url}/auth/token/refresh`, refreshToken),
		setDeviceToken: data => axios.post(`${url}/firebase/save`, data)
	},
	documents: {
		getDocuments: ({ boxType, status, page, perPage }) =>
			axios.get(
				`${url}/document/get/data?boxType=${boxType}&state=${status}&page=${page}&perPage=${perPage}`
			),
		filterDocuments: filters =>
			axios.get(`${url}/document/get/data${filters}`),
		getDocumentsCount: () =>
			axios.get(`${url}/document/get/counts/by/status`),
		getDocumentTypes: type =>
			axios.get(`${url}/user/get/document/types?type=${type}`),
		create: (type, data) =>
			axios.post(`${url}/document/create/${type}`, data),
		uploadFile: data =>
			axios.post(`${url}/document/get/path/for/view/pdf`, formData(data)),
		getSignMessageForAccept: docId =>
			axios.get(`${url}/document/get/signed/content/${docId}`),
		getSignMessage: docId =>
			axios.get(`${url}/document/get/content/${docId}`),
		sign: credentials => axios.post(`${url}/document/accept`, credentials),
		delete: id => axios.get(`${url}/document/delete/${id}`),
		reject: credentials =>
			axios.post(`${url}/document/reject`, credentials),
		getReason: docId => axios.get(`${url}/document/get/reason/${docId}`),
		getInvoiceId: () => axios.get(`${url}/invoice/get/id`),
		getJsonContent: id => axios.get(`${url}/document/get/content/${id}`),
		getTimestamp: signatureHex =>
			axios.post(`${url}/invoice/get/timestamp`, {
				signatureHex
			}),
		cancelInvoice: (id, credentials) =>
			axios.post(`${url}/document//cancel/invoice/${id}`, credentials),
		sendPush: data => axios.post(`${url}/firebase/send`, data),
		uploadExcel: credentials =>
			axios.post(`${url}/excel/multiple/upload`, formData(credentials))
	},
	user: {
		me: () => axios.get(`${url}/user`),
		changeTariff: credentials =>
			axios.put(`${url}/user/billing/plan`, credentials),
		create1CAccount: credentials =>
			axios.post(`${url}/user/1c/account/password`, credentials),
		change1CAccount: credentials =>
			axios.put(`${url}/user/1c/account/password`, credentials),
		search: tin => axios.get(`${url}/info/users/requisite/list/${tin}`),
		update: credentails => axios.put(`${url}/user`, credentails),
		getRequisite: tin =>
			axios.get(`${url}/info/users/requisite/list/${tin}`)
	},
	helper: {
		getRegions: id =>
			axios.get(`${url}/info/regions/list${id ? `/${id}` : ""}`),
		getDistricts: id =>
			axios.get(`${url}/info/districts/list${id ? `/${id}` : ""}`),
		getMeasures: () => axios.get(`${url}/info/measuries/list`)
	}
};
