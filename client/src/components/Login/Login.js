import React, { Component } from 'react';
import {PostData} from '../../services/PostData';

class Login extends Component {

	constructor(props){
		super(props);
		this.state = {
			email: '',
			password: ''
		}
		this.login = this.login.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	login(){
		PostData('/signin', this.state).then((result) => {
			let responseJSON = result;
			console.log(responseJSON);
		});
	}

	// get the values from intput to set/change the state
	onChange(e){
		this.setState({[e.target.name]: e.target.value });
	}

	render(){
		return (
			<div className="row smallup-2 medium-up-3 large-up-4">
				<div className="column">
					<h2>Login Page</h2>
					<label>Email</label>
					<input type="email" name="email" placeholder="email" onChange={this.onChange} />
					<label>Password</label>
					<input type="password" name="password" placeholder="password" onChange={this.onChange} />
					<input type="submit" value="Login" className="button" onClick={this.login} />

				</div>
			</div>
		);
	}
}

export default Login;