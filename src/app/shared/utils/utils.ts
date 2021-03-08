import { Observable, Subject, Subscription } from 'rxjs';
import { DependencyList, useCallback, useEffect, useState } from 'react';


export const useRxEffect = (subscribe: () => Subscription, deps?: DependencyList) => {
	const [sub, setSub] = useState<Subscription | null>(null);

	const unsub = useCallback(() => {
		if (sub) sub.unsubscribe();
	}, [sub]);

	useEffect(() => {
		const subscription = subscribe();
		setSub(subscription);
		return () => {
			console.log('unsubscribeunsubscribeunsubscribe-------------------------------------', );
			subscription.unsubscribe();
		};

	}, deps);

	return unsub;
};

export const useSubject = <T>(func: (objs: Subject<T>) => Observable<any>): Subject<T> => {
	const [subject, setSubject] = useState<Subject<T>>(new Subject<T>());
	useEffect(() => {
		const newSub = new Subject<T>();

		const obs = func(newSub);
		obs.subscribe();
		setSubject(newSub);
		return () => {

			if (newSub) newSub.unsubscribe();
		};
	}, []);

	return subject;
};
