const buffer = require('buffer');
import { 
  AsyncStorage
} from 'react-native'; 

// key constants
const authKey = 'auth';
const userKey = 'user';

export class AuthService {
	constructor() {
	}

    getAuthInfo(cb) {
        AsyncStorage.multiGet([authKey, userKey], (err, val) => {
            /*  
                sample val to get user and key from storage
                [
                  [
                    "auth",
                    "xxxxxxxxxxxxxx="
                  ],
                  [
                    "user",
                    "{}"
                  ]
                ]
            */
            // return error if exists
            if (err) {
                return cb(err);
            }

            // return empty callback if no values are present
            if (!val) {
                return cb();
            }
            // if not value exists return empty callback
            if (!val['1']['1']) {
                return cb();
            }

            var authInfo = {
                header: {
                    Authorization: `Basis ${val['0']['1']}`
                },
                user: val['1']['1']
            }

            return cb(null, authInfo);
        });
    }

	login(creds, cb) {
		// encode username and password for Basic Auth
    	let b = new buffer.Buffer(creds.username + ':' + creds.password);
    	const encodedAuth = b.toString('base64');

		fetch('https://api.github.com/user', {
    		headers: {
    			'Authorization': 'Basic ' + encodedAuth
    		}
    	})
    	.then((response) => {
    		if ((response.status >= 200 && response.status < 300)) {
    			return response;
    		}

    		throw {
    			badCredentials: response.status === 401,
    			unknownError: response.status !== 401
    		}
    	})
    	.then((response) => {
    		return response.json();
    	})
    	.then((results) => {
            AsyncStorage.multiSet([
                [authKey, encodedAuth],
                [userKey, JSON.stringify(results)]
            ]).then((err) => {
                // if err exists while storing creds throw it
                if (err) {
                    throw err;
                }
                else {
                    return cb({showProgress: false, goodLogin: true, results});
                }
            });
    	})
    	.catch((err) => {
    		console.log('Error: ' + err);
    		return cb(err);
    	})
    	.finally(() => {
    		return cb({showProgress: false});
    	});
	}
}

module.exports = AuthService;