import React, {forwardRef, memo, useCallback, useState} from 'react';
import './station-list.component.scss';
import {useRxEffect} from "@utilities/utils";
import {$FirebaseService} from "@services/firebase.service";
import {StationList, UserCred} from "@interfaces/interfaces";
import {Button, Dimmer, Icon, Loader, Table} from "semantic-ui-react";
import {$PortalStore} from "@services/store.service";

interface Props {
}

interface State {
	loading: boolean;
	list: StationList[];
	user: UserCred | null;
}

export interface Ref {
}

const initialState = (props: Props) => {
	return {
		loading: false,
		list: [],
		user: null,
	};
};

export const StationListComponent = memo(
	forwardRef<Ref, Props>((props, ref) => {
		const [state, setState] = useState<State>(initialState(props));

		useRxEffect(() => $PortalStore.$UserCredentials.subscribe(user => {
			setState(prevState => ({...prevState, user}));
		}), []);


		useRxEffect(() => $FirebaseService.getStationListLive().subscribe((list: StationList[]) => {
			console.log('getStationListLive--------------------------------a-----', list);
			setState(prevState => ({...prevState, list}));
		}), []);


		const handleAvailableForUse = useCallback((station: StationList, status: 'online' | 'offline' | 'in-use') => {
			return () => {
				console.log('gaga----------------------state.user---------------', state);
				if (state.user) {
					setState(prevState => ({...prevState, loading: true}));
					$FirebaseService.changeStationStatus(state.user.email, station, status).subscribe(res => {
						setState(prevState => ({...prevState, loading: false}));
					});
				}
			};
		}, [state]);

		const handleFavoriteStation = useCallback((station: StationList) => {
			return () => {
				console.log('gaga----------------------state.user---------------', state);
				if (state.user) {

					const user = state.user;

					/*
					* push or pop array item if existing or not
					* */
					if (user.favStations.includes(station.id)) {
						user.favStations = user.favStations.filter(item => item !== station.id);
					} else {
						user.favStations.push(station.id);
					}

					$FirebaseService.updateUser(state.user.email, user).subscribe(res => {
						setState(prevState => ({...prevState, loading: false}));
					});
				}
			};
		}, [state]);

		return (

			<div className="station-wrap">
				{
					!!state.list.length && (
						<Table singleLine>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Name</Table.HeaderCell>
									<Table.HeaderCell>Location</Table.HeaderCell>
									<Table.HeaderCell>Cost</Table.HeaderCell>
									<Table.HeaderCell>Status</Table.HeaderCell>
									<Table.HeaderCell style={{width: 140}}/>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{
									state.list.map((rowItem, index) => {
										return (
											<Table.Row key={index}>
												<Table.Cell>
													<Icon
														{...state.user?.favStations.includes(rowItem.id) ? {name: 'star'} : {name: 'star outline'}}
														color={'yellow'}
														onClick={handleFavoriteStation(rowItem)}
														className={'clickable'}/>
													{rowItem.name}
												</Table.Cell>
												<Table.Cell>{rowItem.location}</Table.Cell>
												<Table.Cell>{rowItem.cost}</Table.Cell>
												<Table.Cell>

													<Button
														{...rowItem.status === 'online' ? {color: 'green'} : {}}
														{...rowItem.status === 'in-use' ? {color: 'yellow'} : {}}
														size='mini'>{rowItem.status}</Button>
												</Table.Cell>
												<Table.Cell>

													{
														state.user?.email === rowItem.email && rowItem.status !== 'online' && (
															<Button
																color={'red'}
																onClick={handleAvailableForUse(rowItem, 'online')}
																size='mini'>Stop using</Button>
														)
													}

													{
														state.user?.email !== rowItem.email && (
															<Button
																color={'blue'}
																onClick={handleAvailableForUse(
																	rowItem,
																	rowItem.status === 'online' ? 'in-use' : 'online',
																)}
																disabled={rowItem.status !== 'online'}
																size='mini'>Available for use</Button>
														)
													}


												</Table.Cell>
											</Table.Row>
										);
									})
								}
							</Table.Body>
						</Table>
					)
				}


				{
					state.loading && (
						<Dimmer active>
							<Loader/>
						</Dimmer>
					)
				}

			</div>
		);
	}),
);


