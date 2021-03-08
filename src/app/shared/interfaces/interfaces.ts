export interface UserCred {
	email: string;
	firstname: string;
	lastname: string;
	phone: string;
	created: string;
	uid: string;
	favStations: string[];
}


export interface StationList{
	name: string;
	location: string;
	status: 'online' | 'offline' | 'in-use';
	cost: string;
	id: string;
	email: string;

}
