import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {
  Verificationniveau1modalvdeComponent
} from "../verificationniveau1modalvde/verificationniveau1modalvde.component";

@Component({
    selector: 'app-verificationniveau1vde',
    templateUrl: './verificationniveau1vde.component.html',
    styleUrl: './verificationniveau1vde.component.scss',
    standalone: false
})
export class Verificationniveau1vdeComponent  implements OnInit{
  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(Verificationniveau1modalvdeComponent);

    dialogRef.afterClosed().subscribe(() => {
      // Une fois la modale fermée, revenir en arrière ou rediriger
      this.router.navigate(['../'], { replaceUrl: true });
    });
  }
}
