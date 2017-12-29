'use strict';

const buffer = require('buffer');
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';

export default class Login extends Component<{}> {
	constructor(props) {
		super(props);
		this.state = {
			showProgress: false
		}
	}
	onPress = () => {
		this.setState({showProgress: true});
    	console.log('Attempting to log in with user name ' + this.state.username);
    	// encode username and password for Basic Auth
    	let b = new buffer.Buffer(this.state.username + ':' + this.state.password);
    	const encodedAuth = b.toString('base64');

    	fetch('https://api.github.com/user', {
    		headers: {
    			'Authorization': 'Basic ' + encodedAuth
    		}
    	})
    	.then((response) => {
    		if ((response.status >= 200 && response.status < 300)) {
    			this.setState({goodLogin: true});
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
    		console.log(results);
    		this.setState({showProgress: false});
    	})
    	.catch((err) => {
    		console.log('Error: ' + err);
    		this.setState(err);
    	})
    	.finally(() => {
    		this.setState({showProgress: false});
    	});
  	}

	render() {
		let errorCtrl = <View />

		if (!this.state.goodLogin && this.state.badCredentials) {
			errorCtrl = <Text style={styles.error}>
							The username and password are incorrect
						</Text>
		}

		if (!this.state.goodLogin && this.state.unknownError) {
			errorCtrl = <Text style={styles.error}>
							The username and password are incorrect
						</Text>
		}
    	return (
			<View style={styles.container}>
			<Image style={styles.logo} source={images.header}></Image>
			<Text style={styles.heading}>Github Browser</Text>
			<TextInput style={styles.input} 
						placeholder='Github Username' 
						onChangeText={(text) => this.setState({username: text})}/>
			<TextInput style={styles.input} 
						placeholder='Github Password' 
						secureTextEntry={true}
						onChangeText={(text) => this.setState({password: text})}  />
			<TouchableHighlight style={styles.button}
						onPress={this.onPress}>
				<Text style={styles.buttonText}>Log in</Text>
			</TouchableHighlight>

			{errorCtrl}

			<ActivityIndicator style={styles.loader}
						animating={this.state.showProgress}
						size='large' />
		</View>    	
    );
  }
};

var styles = StyleSheet.create({
	container: {
		backgroundColor: '#F5FCFF',
		flex: 1,
		paddingTop: 40,
    	alignItems: 'center',
    	padding: 2
	},
	logo: {
		width: 66,
		height: 55
	},
	heading: {
		fontSize: 30,
		marginTop: 10
	},
	input: {
		height: 50,
		width: 300,
		marginTop: 10,
		padding: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48bbec'
	},
	button: {
		width: 300,
		marginRight:40,
	    marginLeft:40,
	    marginTop:10,
	    paddingTop:20,
	    paddingBottom:20,
	    backgroundColor:'#68a0cf',
	    borderRadius:10,
	    borderWidth: 1,
	    borderColor: '#fff'
	},
	buttonText: {
	    color:'#fff',
	    textAlign:'center',
	    backgroundColor:'#68a0cf',
	    fontSize: 22
	},
	loader: {
		marginTop: 20
	},
	error: {
		color: 'red',
		paddingTop: 10
	}
});

var images =  {
	header: {
		uri: 'Octocat'
	}
}