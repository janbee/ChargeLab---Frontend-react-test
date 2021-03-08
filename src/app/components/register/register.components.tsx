import React, { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import { Button, Divider, Header, Icon, Input, Message } from "semantic-ui-react";
import logo from "@assets/images/logo.svg";
import { Link } from "react-router-dom";
import './register.component.scss';
import { $FirebaseService } from "@services/firebase.service";

interface Props {
}

interface State {
	loading: boolean;
	firstname: string;
	lastname: string;
	phone: string;
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
		firstname: '',
		lastname: '',
		phone: '',
		email: '',
		password: '',
		status: null,
		message: '',
	};
};

export const RegisterComponent = memo(
	forwardRef<Ref, Props>((props, ref) => {
		const [state, setState] = useState<State>(initialState(props));


		useEffect(() => {
			console.log('RegisterComponent-------------------------------------', 123123123);
		});

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

			$FirebaseService.createUser({
				firstname: state.firstname,
				lastname: state.lastname,
				phone: state.phone,
			}, state.email, state.password).subscribe(res => {
				console.log('gaga-------------------------------------', res);

				setState(prevState => ({
					...prevState,
					response: {
						status: 'success',
						message: state.email + ' created',
					},
				}));

				removeResponseMessage();
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

			/*
			* pass state here to always get the updated state
			* */
		}, [state]);



		const removeResponseMessage = useCallback(() => setTimeout(() => {
			setState(prevState => ({
				...prevState,
				response: undefined,
			}));
		}, 3000), []);

		return (

			<div className="register-wrap">
				<div className="container">
					<div>
						<img
							src={logo}
							className="App-logo"
							alt="logo"/>
					</div>


					{
						!!(state.response) && (
							<Message
								{... (state.response.status === "success") ? {color: 'green'} : { color: 'red'} }>
								<Message.Header>
									{state.response.status === 'success'
										? `Account Creation Success`
										: `We're sorry we can't create the account`}
								</Message.Header>
								<p>{state.response?.message}</p>
							</Message>
						)
					}


					<Divider horizontal>
						<Header as='h4'>
							Basic Information
						</Header>
					</Divider>

					<div className={'input-wrap basic-info'}>
						<Input
							placeholder='Firstname'>
							<input
								type="text"
								value={state.firstname}
								onChange={handleInputChange('firstname')}/>
						</Input>
						<Input
							placeholder='Lastname'>
							<input
								type="text"
								value={state.lastname}
								onChange={handleInputChange('lastname')}/>
						</Input>
						<Input
							placeholder='Phone'>
							<input
								type="text"
								value={state.phone}
								onChange={handleInputChange('phone')}/>
						</Input>
					</div>

					<Divider horizontal>
						<Header as='h4'>
							Account
						</Header>
					</Divider>
					<div className="input-wrap">

						<Input
							iconPosition='left'
							placeholder='Email'>
							<Icon name='at'/>
							<input
								type="email"
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
						<Button
							onClick={handleSubmit}
							primary>Register</Button>
						<Link to="/">Login</Link>
					</div>

				</div>
			</div>
		);
	}),
);


