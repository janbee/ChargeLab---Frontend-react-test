import { BehaviorSubject, Subject } from 'rxjs';
import { UserCred } from "@interfaces/interfaces";

class PortalStoreService {
  /*
  * store user cred to be accessed by the whole site
  * */
  $UserCredentials = new BehaviorSubject<UserCred | null>(null);
}

export const $PortalStore = new PortalStoreService();
