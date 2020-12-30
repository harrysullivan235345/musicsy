import axios from 'axios'

export default function ({ store, redirect, req }) {

	if (process.server) {
		return axios.get(`${process.env.baseUrl}/api/profile/get_profile`, { 
			headers: {
				"Cookie": req.headers.cookie ? req.headers.cookie : ""
			}
		})
	  	.then((xhr) => {
	  		store.commit('profile/setProfile', xhr.data.profile);
	  	})
	}

  return axios.get(`${process.env.baseUrl}/api/profile/get_profile`, { withCredentials: true })
  	.then((xhr) => {
  		store.commit('profile/setProfile', xhr.data.profile);
  	})
}