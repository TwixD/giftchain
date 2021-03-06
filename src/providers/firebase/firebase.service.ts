import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseAppService {

    constructor(public db: AngularFireDatabase,
        public afAuth: AngularFireAuth) {
    }

    query(url: string, prop: string, equalValue: any, retriveObject: boolean = false): Promise<any> {
        return new Promise((resolve) => {
            try {
                if (retriveObject) {
                    this.db.object(url).valueChanges().subscribe((data) => {
                        resolve(data);
                    }, (error) => {
                        console.error(`[FirebaseService] [query]`, error);
                        resolve(null);
                    });
                } else {
                    this.db.list(url, (ref) =>
                        prop && equalValue ?
                            ref.orderByChild(prop).equalTo(equalValue) : ref
                    ).valueChanges().subscribe((data) => {
                        resolve(data);
                    }, (error) => {
                        console.error(`[FirebaseService] [query]`, error);
                        resolve(null);
                    });
                }
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

    insert(url: string, data: Object, createID: boolean = true): Promise<boolean> {
        return new Promise((resolve) => {
            let route: string = url + (createID ? `/${this.db.createPushId()}` : '');
            const itemRef = this.db.object(route);
            itemRef.set(data).then((res) => {
                resolve(true);
            }).catch((error) => {
                console.error(error);
                resolve(false);
            });
        });
    }

    getPushID(): string {
        return this.db.createPushId();
    }

}