import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {Opcvm} from "../../../../core/models/opcvm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../core/modules/auth";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {ProfilcommissionsousrachService} from "../../../services/profilcommissionsousrach.service";
import {Detailprofil} from "../../../models/detailprofil.model";
import {DetailprofilService} from "../../../services/detailprofil.service";
import {LocalService} from "../../../../services/local.service";

@Component({
  selector: 'app-profilcommissionsousrach-add-edit',
  templateUrl: './profilcommissionsousrach-add-edit.component.html',
  styleUrl: './profilcommissionsousrach-add-edit.component.scss'
})
export class ProfilcommissionsousrachAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  personne: any;
  detailProfil: Detailprofil;
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
        borneInferieur: [null],
        borneSuperieur: [null],
        montantMinimum: [null],
        taux: [null],
        standard: [false],
      }
    );

    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de profil'")
      const sb = this.entityService.afficherSelonProfilOpcvm(this.id,
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
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({codeProfil:
      entity.codeProfil});
    this.entityForm.patchValue({libelleProfil: entity.libelleProfil});
    this.entityForm.patchValue({id: entity.codeProfil});
    this.entityForm.patchValue({typeCommission: entity.typeCommission});
    this.entityForm.patchValue({standard: entity.standard});
    this.detailProfilService.afficherSelonProfilOpcvm(entity.codeProfil,
      this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe(
      (data)=>{
        this.detailProfil$=data.data;
        let i=0;
        for(i===0;i<this.detailProfil$.length;i++){
          this.tableau = document.getElementById("table_DetailProfil");
          var tr = document.createElement('tr'); //On créé une ligne
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.detailProfil$[i].borneInferieur
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          // td.hidden = true;
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.detailProfil$[i].borneSuperieur;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }

          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML =this.detailProfil$[i].montantMinimum;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }

          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.detailProfil$[i].taux;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }

          var buttonElement = document.createElement('button');
          // buttonElement.className="buttonSupprimer";
          buttonElement.style.alignContent = "center";
          buttonElement.style.borderStyle = "none";
          buttonElement.style.marginTop = "5 px";
          // @ts-ignore
          // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
          var _this = this;
          buttonElement.addEventListener("click", function (evt) {
            return _this.removeLine(tr.rowIndex);
          });
          // buttonElement.onclick=this.removeLine(tr.rowIndex);
          tr.appendChild(buttonElement);
          buttonElement.innerHTML = "X";

          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.entityForm.controls; }
  addRow(id: string) {
        // @ts-ignore
        this.tableau = document.getElementById(id);
        var nbreLigne = this.tableau.getElementsByTagName('tr').length
        var ajouter = true;

        // if(nbreLigne==0){
        //   ajouter=true;
        // }
        // for (let i = 1; i < nbreLigne; i++) {
        //   if (this.tableau.getElementsByTagName('tr')[i].cells[0].innerHTML===this.personne.idPersonne.toString()) {
        //     ajouter = false;
        //   }
        // }
        if (ajouter) {
          var tr = document.createElement('tr'); //On créé une ligne
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.entityForm.value.borneInferieur
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
          // td.hidden = true;
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.entityForm.value.borneSuperieur;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }

          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.entityForm.value.montantMinimum;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }

          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.entityForm.value.taux;
          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }

          var buttonElement = document.createElement('button');
          // buttonElement.className="buttonSupprimer";
          buttonElement.style.alignContent = "center";
          buttonElement.style.borderStyle = "none";
          buttonElement.style.marginTop = "5 px";
          // @ts-ignore
          // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
          var _this = this;
          buttonElement.addEventListener("click", function (evt) {
            return _this.removeLine(tr.rowIndex);
          });
          // buttonElement.onclick=this.removeLine(tr.rowIndex);
          tr.appendChild(buttonElement);
          buttonElement.innerHTML = "X";

          // @ts-ignore
          if (this.tableau.firstChild.tagName == 'TBODY') {
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          } else {
            this.tableau.appendChild(tr);
          }
        }
  }
  removeLine(index: number) {
    // @ts-ignore
    this.tableau = document.getElementById("table_PersonneOpcvm");
    var length = this.tableau.getElementsByTagName('tr').length
    if (length == 2) {
      var tr = this.tableau.getElementsByTagName('tr')[1];
      tr.remove();
    } else {
      var tr = this.tableau.getElementsByTagName('tr')[index];
      tr.remove();
    }
    //  console.log(tr);
    // console.log(index);

  }

  onSaveEntity()
  {
    this.tableau = document.getElementById("table_DetailProfil");
    let length = this.tableau.getElementsByTagName('tr').length
    if (length == 1) {
      alert("Veuillez ajouter le détails profil")
      return;
    }
    this.isLoading = true;
    this.submitted = true;
    if(this.entityForm.invalid) return;
    const sb = this.saveEntity()
      .pipe(
        catchError((err) => {
          return of(undefined);
        }),
        finalize(() => {
          this.submitted = false;
          this.isLoading = false;
          this.router.navigate(['/opcvm/standard/profilopc']);
        })
      )
      .subscribe(
        (data)=>{

          this.nbreLigne = document.getElementById("table_DetailProfil").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
          let i: number = 1;
          this.detailProfilService.supprimer(this.entityForm.value.codeProfil,
            this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe();
          //        console.log(this.nbreLigne);
          for (i === 1; i < this.nbreLigne; i++) {
            this.detailProfil=new Detailprofil();
            this.detailProfil.opcvm=new Opcvm();
            this.detailProfil.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
            this.detailProfil.codeProfil=this.entityForm.value.codeProfil;
            // @ts-ignore
            this.detailProfil.borneInferieur=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[0].innerHTML;
            // @ts-ignore
            this.detailProfil.borneSuperieur=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[1].innerHTML;
            // @ts-ignore
            this.detailProfil.montantMinimum=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[2].innerHTML;
            // @ts-ignore
            this.detailProfil.taux=document.getElementById("table_DetailProfil").getElementsByTagName('tr')[i].cells[3].innerHTML;
            console.log("detailProfil"+i,this.detailProfil)
            this.detailProfilService.create(this.detailProfil).subscribe();
          }
        }
      );
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
      ? this.entityService.modifier(this.entityForm.value.codeProfil,
        this.localStore.getData("currentOpcvm")?.idOpcvm,entity)
      : this.entityService.create(entity);
  }
}

