import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription, forkJoin} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, switchMap} from "rxjs/operators";
import {ProfilcommissionsousrachService} from "../../../services/profilcommissionsousrach.service";
import {Detailprofil} from "../../../models/detailprofil.model";
import {DetailprofilService} from "../../../services/detailprofil.service";
import {LocalService} from "../../../../services/local.service";

@Component({
    selector: 'app-profilcommissionsousrach-add-edit',
    templateUrl: './profilcommissionsousrach-add-edit.component.html',
    styleUrl: './profilcommissionsousrach-add-edit.component.scss',
    standalone: false
})
export class ProfilcommissionsousrachAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  personne: any;
  detailProfil: Detailprofil;
  details: Detailprofil[] = [];
  detailProfil$: any;
  isLoading = false;
  submitting = false;
  paysSelect:any;
  idPays:number;
  idPersonne:number;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  nbreLigne: number;
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
    private localStore: LocalService,
    public entityService: ProfilcommissionsousrachService,
    public detailProfilService: DetailprofilService,
    public authService: AuthService,
    public pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
      {
        id: [this.id],
        codeProfil: [null,Validators.required],
        libelleProfil: [null,Validators.required],
        typeCommission: [null,Validators.required],
        // borneInferieur: [null],
        // borneSuperieur: [null],
        // montantMinimum: [null],
        // taux: [null],
        standard: [false],
      }
    );

    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de profil'")
      const sb = this.entityService.afficherSelonProfilOpcvm(encodeURIComponent(this.id),
        this.localStore.getData("currentOpcvm")?.idOpcvm)
        .subscribe((entity)=>{
          console.log("profil=",entity.data)
          this.entity=entity.data;
          this.loadFormValues(entity.data);
        });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de profil")
  }
  // loadFormValues(entity: any)
  // {
  //   this.entity = entity;
  //   this.entityForm.patchValue({codeProfil:
  //     entity.codeProfil});
  //   this.entityForm.patchValue({libelleProfil: entity.libelleProfil});
  //   this.entityForm.patchValue({id: entity.codeProfil});
  //   this.entityForm.patchValue({typeCommission: entity.typeCommission});
  //   this.entityForm.patchValue({standard: entity.standard});
  //   this.detailProfilService.afficherSelonProfilOpcvm(encodeURIComponent(entity.codeProfil.trim()),
  //     this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe(
  //     (data)=>{
  //       this.detailProfil$=data.data;
  //       let i=0;
  //       for(i===0;i<this.detailProfil$.length;i++){
  //         this.tableau = document.getElementById("table_DetailProfil");
  //         var tr = document.createElement('tr'); //On créé une ligne
  //         var td = document.createElement('td');
  //         tr.appendChild(td);
  //         td.innerHTML = this.detailProfil$[i].borneInferieur
  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }
  //         // td.hidden = true;
  //         var td = document.createElement('td');
  //         tr.appendChild(td);
  //         td.innerHTML = this.detailProfil$[i].borneSuperieur;
  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }

  //         var td = document.createElement('td');
  //         tr.appendChild(td);
  //         td.innerHTML =this.detailProfil$[i].montantMinimum;
  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }

  //         var td = document.createElement('td');
  //         tr.appendChild(td);
  //         td.innerHTML = this.detailProfil$[i].taux;
  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }

  //         var buttonElement = document.createElement('button');
  //         // buttonElement.className="buttonSupprimer";
  //         buttonElement.style.alignContent = "center";
  //         buttonElement.style.borderStyle = "none";
  //         buttonElement.style.marginTop = "5 px";
  //         // @ts-ignore
  //         // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
  //         var _this = this;
  //         buttonElement.addEventListener("click", function (evt) {
  //           return _this.removeLine(tr.rowIndex);
  //         });
  //         // buttonElement.onclick=this.removeLine(tr.rowIndex);
  //         tr.appendChild(buttonElement);
  //         buttonElement.innerHTML = "X";

  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }
  //       }
  //     }
  //   )
  // }
  loadFormValues(entity: any): void {
  this.entity = entity;

  this.entityForm.patchValue({
    codeProfil: entity.codeProfil,
    libelleProfil: entity.libelleProfil,
    id: entity.codeProfil,
    typeCommission: entity.typeCommission,
    standard: entity.standard
  });

  const sb = this.detailProfilService
    .afficherSelonProfilOpcvm(
      encodeURIComponent(entity.codeProfil.trim()),
      this.localStore.getData("currentOpcvm")?.idOpcvm
    )
    .subscribe({
      next: (data) => {
        this.details = (data.data || []).map((detail: Detailprofil) => ({
          ...detail
        }));
      },
      error: (err) => {
        console.error("Erreur lors du chargement des détails :", err);
        this.details = [];
      }
    });

  this.subscriptions.push(sb);
}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }
  // addRow(id: string) {
  //       // @ts-ignore
  //       this.tableau = document.getElementById(id);
  //       var nbreLigne = this.tableau.getElementsByTagName('tr').length
  //       var ajouter = true;

        
  //       if (ajouter) {
  //         var tr = document.createElement('tr'); //On créé une ligne
  //         var td = document.createElement('td');
  //         tr.appendChild(td);
  //         td.innerHTML = this.entityForm.value.borneInferieur
  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }
  //         // td.hidden = true;
  //         var td = document.createElement('td');
  //         tr.appendChild(td);
  //         td.innerHTML = this.entityForm.value.borneSuperieur;
  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }

  //         var td = document.createElement('td');
  //         tr.appendChild(td);
  //         td.innerHTML = this.entityForm.value.montantMinimum;
  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }

  //         var td = document.createElement('td');
  //         tr.appendChild(td);
  //         td.innerHTML = this.entityForm.value.taux;
  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }

  //         var buttonElement = document.createElement('button');
  //         // buttonElement.className="buttonSupprimer";
  //         buttonElement.style.alignContent = "center";
  //         buttonElement.style.borderStyle = "none";
  //         buttonElement.style.marginTop = "5 px";
  //         // @ts-ignore
  //         // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
  //         var _this = this;
  //         buttonElement.addEventListener("click", function (evt) {
  //           return _this.removeLine(tr.rowIndex);
  //         });
  //         // buttonElement.onclick=this.removeLine(tr.rowIndex);
  //         tr.appendChild(buttonElement);
  //         buttonElement.innerHTML = "X";

  //         // @ts-ignore
  //         if (this.tableau.firstChild.tagName == 'TBODY') {
  //           // @ts-ignore
  //           this.tableau.firstChild.appendChild(tr);
  //         } else {
  //           this.tableau.appendChild(tr);
  //         }
  //       }
  // }
  // removeLine(index: number) {
  //   // @ts-ignore
  //   this.tableau = document.getElementById("table_DetailProfil");
  //   var length = this.tableau.getElementsByTagName('tr').length
  //   if (length == 2) {
  //     var tr = this.tableau.getElementsByTagName('tr')[1];
  //     tr.remove();
  //   } else {
  //     var tr = this.tableau.getElementsByTagName('tr')[index];
  //     tr.remove();
  //   }
  //   //  console.log(tr);
  //   // console.log(index);

  // }
 addRow(): void {
  let borneInferieur = 0;

  if (this.details.length > 0) {
    const derniereLigne = this.details[this.details.length - 1];

    const borneSuperieur = Number(derniereLigne.borneSuperieur);

    if (
      derniereLigne.borneSuperieur === null ||
      derniereLigne.borneSuperieur === undefined ||
      
      !Number.isFinite(borneSuperieur)
    ) {
      alert("Veuillez renseigner la borne supérieure de la dernière ligne.");
      return;
    }

    borneInferieur = borneSuperieur + 1;
  }

  const detail = new Detailprofil();

  detail.borneInferieur = borneInferieur;
  detail.borneSuperieur = null;
  detail.montantMinimum = 0;
  detail.taux = 0;

  this.details = [...this.details, detail];
}

  removeLine(index: number): void {
    this.details = this.details.filter((_, i) => i !== index);
  }
  // onSaveEntity()
  // {
  //   this.tableau = document.getElementById("table_DetailProfil");
  //   let length = this.tableau.getElementsByTagName('tr').length
  //   if (length == 1) {
  //     alert("Veuillez ajouter le détails profil")
  //     return;
  //   }
  //   this.isLoading = true;
  //   this.submitted = true;
  //   if(this.entityForm.invalid) return;
  //   const sb = this.saveEntity()
  //     .pipe(
  //       catchError((err) => {
  //         return of(undefined);
  //       }),
  //       finalize(() => {
  //         this.submitted = false;
  //         this.isLoading = false;
  //         this.router.navigate(['/opcvm/standard/profilopc']);
  //       })
  //     )
  //     .subscribe(
  //       (data)=>{

  //         this.nbreLigne = document.getElementById("table_DetailProfil").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
  //         let i: number = 1;
  //         this.detailProfilService.supprimer(encodeURIComponent(this.entityForm.value.codeProfil),
  //           this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe();
  //         //        console.log(this.nbreLigne);
  //         for (i === 1; i < this.nbreLigne; i++) {
  //           this.detailProfil=new Detailprofil();
  //           this.detailProfil.opcvm=new Opcvm();
  //           this.detailProfil.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
  //           this.detailProfil.codeProfil=this.entityForm.value.codeProfil;
  //           // @ts-ignore
  //           this.detailProfil.borneInferieur=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[0].innerHTML;
  //           // @ts-ignore
  //           this.detailProfil.borneSuperieur=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[1].innerHTML;
  //           // @ts-ignore
  //           this.detailProfil.montantMinimum=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[2].innerHTML;
  //           // @ts-ignore
  //           this.detailProfil.taux=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[3].innerHTML;
  //           console.log("detailProfil"+i,this.detailProfil)
  //           this.detailProfilService.create(this.detailProfil).subscribe();
  //         }
  //       }
  //     );
  //   this.subscriptions.push(sb);
  // }
onSaveEntity(): void {
  this.submitted = true;

  if (this.entityForm.invalid) {
    return;
  }

  if (this.details.length === 0) {
    alert("Veuillez ajouter le détail du profil");
    return;
  }

  this.isLoading = true;

  const idOpcvm = this.localStore.getData("currentOpcvm")?.idOpcvm;
  const codeProfil = this.entityForm.value.codeProfil;

  const sb = this.saveEntity().pipe(
    switchMap(() =>
      this.detailProfilService.supprimer(
        encodeURIComponent(codeProfil),
        idOpcvm
      )
    ),
    switchMap(() => {
      const demandes = this.details.map((detail) => {
        const nouveauDetail = new Detailprofil();

        nouveauDetail.opcvm = new Opcvm();
        nouveauDetail.opcvm.idOpcvm = idOpcvm;
        nouveauDetail.codeProfil = codeProfil;
        nouveauDetail.borneInferieur =  Number(detail.borneInferieur.toString().replace(',','.'));;
        nouveauDetail.borneSuperieur =  Number(detail.borneSuperieur.toString().replace(',','.'));
        nouveauDetail.montantMinimum = Number(detail.montantMinimum.toString().replace(',','.'));
        nouveauDetail.taux = Number(detail.taux.toString().replace(',','.'));

        return this.detailProfilService.create(nouveauDetail);
      });

      return demandes.length > 0 ? forkJoin(demandes) : of([]);
    }),
    catchError((err) => {
      console.error("Erreur lors de l'enregistrement :", err);
      alert("Une erreur est survenue lors de l'enregistrement.");
      return of(undefined);
    }),
    finalize(() => {
      this.submitted = false;
      this.isLoading = false;
    })
  ).subscribe((result) => {
    if (result !== undefined) {
      this.router.navigate(['/opcvm/standard/profilopc']);
    }
  });

  this.subscriptions.push(sb);
}
  saveEntity() {
    this.opcvm=new Opcvm();
    this.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;

    const entity: any = {
      codeProfil:this.entityForm.value.codeProfil,
      libelleProfil:this.entityForm.value.libelleProfil,
      typeCommission:this.entityForm.value.typeCommission,
      standard:this.entityForm.value.standard,
      opcvm:this.opcvm
    };
    console.log("act1",entity)
    return this.id
      ? this.entityService.modifier(encodeURIComponent(this.entityForm.value.codeProfil),
        this.localStore.getData("currentOpcvm")?.idOpcvm,entity)
      : this.entityService.create(entity);
  }
}

