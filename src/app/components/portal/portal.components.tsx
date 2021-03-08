import React, { forwardRef, memo, useCallback, useState } from 'react';
import { Button, Card, Dimmer, Icon, Image, Input, Loader } from "semantic-ui-react";
import './portal.component.scss';
import { useRxEffect } from "@utilities/utils";
import { $PortalStore } from "@services/store.service";
import { UserCred } from "@interfaces/interfaces";
import { $FirebaseService } from "@services/firebase.service";
import { useHistory } from "react-router-dom";
import { StationListComponent } from "@components/station-list/station-list.components";

interface Props {
}

interface State {
	loading: boolean;
	user: UserCred | null;
	update: UserCred | null;
	editMode: boolean;
}

export interface Ref {
}

const initialState = (props: Props) => {
	return {
		loading: false,
		update: null,
		user: null,
		editMode: false,
	};
};

export const PortalComponent = memo(
	forwardRef<Ref, Props>((props, ref) => {
		const [state, setState] = useState<State>(initialState(props));
		const history = useHistory();

		useRxEffect(() => $PortalStore.$UserCredentials.subscribe(user => {
			setState(prevState => ({...prevState, user, update: user}));
		}), []);

		const handleInputChange = useCallback((name) => {
			return (e: React.ChangeEvent<HTMLInputElement>) => {


				const update = {
					...state.update,
					[name]: e.target.value,
				} as UserCred;

				setState((prevState) => ({
					...prevState,
					update,
				}));
			};
		}, [state]);


		const handleEditMode = useCallback(() => {
			setState(prevState => ({...prevState, editMode: true}));
		}, []);


		const handleUpdate = useCallback(() => {
			if (state.user && state.update) {

				setState(prevState => ({...prevState, loading: true}));

				$FirebaseService.updateUser(state.user.email, state.update).subscribe(res => {
					setState(prevState => ({
						...prevState,
						user: state.update,
						editMode: false,
						loading: false,
					}));
				});
			}
		}, [state]);


		const handleSignOut = useCallback(() => {
			$FirebaseService.signOut().subscribe(res => {
				history.replace('/');
			});
		}, []);

		return (

			<div className="portal-wrap">


				<div className="container">


					<div>
						{
							!!(state.user) && (
								<Card>
									<Card.Content>
										<Image
											floated='right'
											size='mini'
											src='https://react.semantic-ui.com/images/avatar/large/matthew.png'
										/>
										<Card.Header>
											{`${state.user.firstname} ${state.user.lastname}`}
										</Card.Header>
										<Card.Meta>{state.user.email}</Card.Meta>
										<Card.Description>
											<Icon name='phone'/>
											{state.user.phone}
										</Card.Description>
									</Card.Content>
									<Card.Content extra>
										<div className={'card-btn-wrap'}>
											<Button
												onClick={handleEditMode}
												basic
												color='green'>
												Edit
											</Button>
											<Button
												onClick={handleSignOut}
												negative>Sign Out</Button>
										</div>

									</Card.Content>
								</Card>
							)
						}


						{
							state.editMode && (
								<div className={'edit-wrap'}>
									<Input
										iconPosition='left'
										placeholder='Email'>
										<Icon name='at'/>
										<input
											type="text"
											disabled={true}
											value={state.update?.email}/>
									</Input>
									<Input
										iconPosition='left'
										placeholder='Firstname'>
										<Icon name='user'/>
										<input
											type="text"
											value={state.update?.firstname}
											onChange={handleInputChange('firstname')}/>
									</Input>
									<Input
										iconPosition='left'
										placeholder='Lastname'>
										<Icon name='user'/>
										<input
											type="text"
											value={state.update?.lastname}
											onChange={handleInputChange('Lastname')}/>
									</Input>
									<Input
										iconPosition='left'
										placeholder='Phone'>
										<Icon name='phone'/>
										<input
											type="text"
											value={state.update?.phone}
											onChange={handleInputChange('phone')}/>
									</Input>

									<div>
										<Button
											onClick={handleUpdate}
											positive>Update</Button>
									</div>
								</div>
							)
						}

					</div>

					<div style={{width:'100%', paddingLeft: '20px'}}>
						<StationListComponent/>
					</div>


					{
						state.loading && (
							<Dimmer active>
								<Loader/>
							</Dimmer>
						)
					}


				</div>
			</div>
		);
	}),
);


