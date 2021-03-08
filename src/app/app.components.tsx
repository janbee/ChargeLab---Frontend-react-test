import React, { forwardRef, memo, useState } from 'react';
import { Route, Switch, useHistory } from "react-router-dom";
import { LoginComponent } from "@components/login/login.components";
import { RegisterComponent } from "@components/register/register.components";
import { $FirebaseService } from "@services/firebase.service";
import { Dimmer, Loader } from "semantic-ui-react";
import { PortalComponent } from "@components/portal/portal.components";
import { useRxEffect } from "@utilities/utils";

interface Props {
}

interface State {
	loading: boolean;
}

export interface Ref {
}

const initialState = (props: Props) => {
	return {
		loading: true,
	};
};

export const AppComponent = memo(
	forwardRef<Ref, Props>((props, ref) => {
		const [state, setState] = useState<State>(initialState(props));
		const history = useHistory();

		/*
		* custom hooks together with rxjs
		* this will make sure the if the component is destroyed
		* it will unsubscribe any subscription
		* */

		useRxEffect(() => $FirebaseService.checkSignedUser().subscribe((res) => {
			/*
			* add this to check whether user is still logged id
			* after refresh
			*
			* if not redirect to login
			* */

			console.log('AppComponent-------------------------------------', res);

			if (res === null) {
				history.push('/');
				setState(prevState => ({...prevState, loading: false}));
			} else {
				console.log('history-------------------------------------', history);

				setState(prevState => ({...prevState, loading: false}));
				history.push('/portal');
			}

			/*
			* passing empty array will call the useEffect once
			* ideal on component mount api call check
			* */
		}), []);


		return (
			<>
				<Dimmer
					{...(state.loading) ? {active: true} : {}}>
					<Loader/>
				</Dimmer>

				<Switch>
					<Route
						path={'/'}
						strict={true}
						exact={true}
						component={LoginComponent}/>

					<Route
						path={'/register'}
						strict={true}
						exact={true}
						component={RegisterComponent}/>

					<Route
						path={'/portal'}
						strict={true}
						exact={true}
						component={PortalComponent}/>

					<Route
						path="*"
						component={LoginComponent}/>
				</Switch>
			</>
		);
	}),
);


