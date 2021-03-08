import React, { forwardRef, memo, useCallback, useState } from 'react';
import { Button, Icon, Input, Message } from "semantic-ui-react";
import logo from "@assets/images/logo.svg";
import { Link, useHistory } from "react-router-dom";
import './login.component.scss';
import { $FirebaseService } from "@services/firebase.service";

interface Props {
}

interface State {
	loading: boolean;
	email: string;
	password: string;

	response?: {
		status: 'success' | 'fail' ;
		message: string;
	};
}

export interface Ref {
}

const initialState = (props: Props) => {
	return {
		loading: true,
		email: '',
		password: '',
	};
};

export const LoginComponent = memo(
	forwardRef<Ref, Props>((props, ref) => {
		const [state, setState] = useState<State>(initialState(props));
		const history = useHistory();

		const handleInputChange = useCallback((name) => {
			return (e: React.ChangeEvent<HTMLInputElement>) => {
				setState((prevState) => ({
					...prevState,
					[name]: e.target.value,
				}));
			};
		}, []);


		const handleSubmit = useCallback(() => {
			/*
			* you can do form validation here
			* but assuming this data is valid
			* */

			$FirebaseService.signInWithEmailAndPassword(state.email, state.password).subscribe(res => {
				console.log('gaga-------------------------------------', res);
				history.replace('/portal');
			}, (e) => {

				console.log('ee-------------------------------------', e);
				setState(prevState => ({
					...prevState,
					response: {
						status: 'fail',
						message: e.message,
					},
				}));


				removeResponseMessage();

			});
		}, [state]);



		const removeResponseMessage = useCallback(() => setTimeout(() => {
			setState(prevState => ({
				...prevState,
				response: undefined,
			}));
		}, 4000), []);


		return (

			<div className="login-wrap">
				<div className="container">
					<div>
						<img
							src={logo}
							className="App-logo"
							alt="logo"/>
					</div>


					{
						!!(state.response) && (
							<Message color={'red'} >
								<Message.Header>Sorry</Message.Header>
								<p>{state.response?.message}</p>
							</Message>
						)
					}

					<div className="input-wrap">
						<Input
							iconPosition='left'
							placeholder='Email'>
							<Icon name='at'/>
							<input
								type={'email'}
								value={state.email}
								onChange={handleInputChange('email')}/>
						</Input>
						<Input
							iconPosition='left'
							placeholder='Password'>
							<input
								type={'password'}
								value={state.password}
								onChange={handleInputChange('password')}/>
							<Icon name='lock'/>
						</Input>
					</div>

					<div className="btn-wrap">
						<Button onClick={handleSubmit} primary>Login</Button>
						<Link to="/register">Create Account</Link>
					</div>

				</div>
			</div>
		);
	}),
);


