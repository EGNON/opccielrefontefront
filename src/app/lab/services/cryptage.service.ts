
import {Inject, Injectable, OnDestroy} from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class CryptageService {
  encryptSecretKey:string="AAAAA"
  // @ts-ignore
  encryptData(data) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  // @ts-ignore
  decryptData(data) {

    try {
      // const bytes = CryptoJS.AES.decrypt(JSON.stringify(data), this.encryptSecretKey);
      // if (bytes.toString()) {
      //   return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // }
      // return data;
      return CryptoJS.AES.decrypt(data, this.encryptSecretKey).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.log(e);
    }
  }
}
