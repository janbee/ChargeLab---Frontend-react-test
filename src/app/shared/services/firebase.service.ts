import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { defer, Observable, Subject } from "rxjs";
import { finalize, map, mergeMap } from "rxjs/operators";
import { StationList, UserCred } from "@interfaces/interfaces";
import { $PortalStore } from "@services/store.service";

const firebaseConfig = {
	apiKey: "AIzaSyCGRmPs4cs8eEU2nZsPJfoF-atL4jNWrBA",
	authDomain: "chargelab-567e2.firebaseapp.com",
	projectId: "chargelab-567e2",
};

firebase.default.initializeApp(firebaseConfig);
const db = firebase.default.firestore();

class FirebaseService {

	createUser(basic: { firstname: string, lastname: string, phone: string }, email: string, password: string) {
		return defer(() => firebase.default.auth().createUserWithEmailAndPassword(email, password)).pipe(
			mergeMap(userCred => {
				console.log('userCred-------------------------------------', userCred);
				return defer(() => (
					db.collection('userDetails')
						.doc(email)
						.set({
							...basic,
							favStations: [],
							uid: userCred.user?.uid,
							email,
							created: firebase.default.firestore.FieldValue.serverTimestamp(),
						})
				));
			}),
		);
	}


	checkSignedUser(): Observable<UserCred | null> {

		return defer((): Promise<UserCred | null> => new Promise((resolve, reject) => {

			const unsubscribe = firebase.default.auth().onAuthStateChanged((user) => {
				unsubscribe();
				if (user) {
					const email = user?.email || '';
					defer(() => db.collection('userDetails').doc(email).get()).pipe(
						map(docRef => docRef.data()),
					).subscribe(res => {
						/*
						* this will store userCred data to $UserCredentials
						* and can be access though out the site
						* much like redux data
						* */
						$PortalStore.$UserCredentials.next(res as UserCred);
						resolve(res as UserCred);
					});
				} else {
					resolve(null);
				}
			}, reject);

		}));
	}

	getStationListLive(): any {
		const live = new Subject();
		const unsub = db.collection("chargingStations").onSnapshot(res => {
			console.log('onSnapshot-------------------------------------', res.docs.map(doc => doc.data()));
			live.next(res.docs.map(doc => doc.data()));
		});
		return live.pipe(
			finalize(() => {
				unsub();
			}),
		);


		/*return defer(() => );*/
	}

	updateUser(email: string, update: UserCred) {
		return defer(() => db.collection('userDetails').doc(email).update(update));
	}

	signInWithEmailAndPassword(email: string, password: string) {
		return defer(() => firebase.default.auth().signInWithEmailAndPassword(email, password)).pipe(
			mergeMap(() => this.checkSignedUser()),
		);
	}

	signOut() {
		return defer(() => firebase.default.auth().signOut());
	}

	changeStationStatus(email: string, station: StationList, status: 'online' | 'offline' | 'in-use') {
		return defer(() => db.collection('chargingStations').doc(station.id).update({
			...station,
			status,
			email: status === 'online' ? '' : email,
		}));
	}


}

export const $FirebaseService = new FirebaseService();
