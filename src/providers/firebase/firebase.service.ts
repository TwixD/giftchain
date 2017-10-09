import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseAppService {

    constructor(public db: AngularFireDatabase,
        public afAuth: AngularFireAuth) {

    }

    query(url: string, prop: string, equalValue: any): Promise<any> {
        return new Promise((resolve) => {
            try {
                this.db.list(url,
                    (ref) => ref.orderByChild(prop).equalTo(equalValue)
                ).valueChanges().subscribe((data) => {
                    resolve(data);
                }, (error) => {
                    console.error(`[FirebaseService] [query]`, error);
                    resolve(null);
                });
            } catch (error) {
                console.error(`[FirebaseService] [query]`, error);
                resolve(null);
            }
        });
    }

    getStorageFileUrl(fileName: string): Promise<any> {
        return new Promise((resolve) => {
            try {
                let storageRef = firebase.storage().ref('/' + fileName);
                storageRef.getDownloadURL().then((data) => {
                    resolve(data);
                }).catch((error) => {
                    console.error(`[FirebaseService] [getStorageFileUrl]`, error);
                    resolve(null);
                });
            } catch (error) {
                console.error(`[FirebaseService] [getStorageFileUrl]`, error);
                resolve(null);
            }
        });
    }

}