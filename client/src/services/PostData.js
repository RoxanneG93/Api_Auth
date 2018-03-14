export function PostData(type, userData){

	let BaseUrl = 'http://localhost:5000/users';

	return new Promise((resolve, reject) => {

		return fetch(BaseUrl+type, {
			method: 'POST',
			body: JSON.stringify(userData)
		})
		    .then((response) => response.json())
		    .then((responseJson) => {
		      resolve(responseJson);
		      // Me trying to figure out what is going on with the 
		      // console.log('userdata', userData);
		      // console.log('response',response);
		    })
		    .catch((error) => {
		    	reject(error);
		      	console.error(error);
		});
	})
}