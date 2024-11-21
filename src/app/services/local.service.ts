import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class LocalService {
  key = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  // key = "123";

  constructor() { }

  public saveData(key: string, value: any) {
    localStorage.setItem(key, this.encrypt(JSON.stringify(value)));
  }

  public getData(key: string) {
    let data = localStorage.getItem(key)|| "";
    return this.decrypt(data);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    try {
      return JSON.parse(CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8));
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}
