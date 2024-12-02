import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Monnaie} from "../../../../crm/models/monnaie.model";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {ActionnaireopcvmService} from "../../../services/actionnaireopcvm.service";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {AuthService} from "../../../../core/modules/auth";
import {Opcvm} from "../../../../core/models/opcvm";
import {Personne} from "../../../../crm/models/personne/personne.model";
import {Actionnaireopcvm} from "../../../models/actionnaireopcvm.model";
import {LocalService} from "../../../../services/local.service";

@Component({
  selector: 'app-actionnaireopcvm-add-edit',
  templateUrl: './actionnaireopcvm-add-edit.component.html',
  styleUrl: './actionnaireopcvm-add-edit.component.scss'
})
export class ActionnaireopcvmAddEditComponent implements OnInit, OnDestroy{
  id?: number;
  public personneSettings = {};
  monnaies$: Observable<Monnaie[]>;
  opcvm:Opcvm;
  personne$: any;
  personne: any;
  actionnaireOpcvm: Actionnaireopcvm;
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
      public entityService: ActionnaireopcvmService,
      public personneService: PersonneService,
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
          personne: [null],
        }
    );
    this.getPersonne()
    // this.paysSelect = document.getElementById("ComboPaysLab");
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification d'actionnaire'")
      const sb = this.entityService.getById(this.id)
          .subscribe((entity)=>{
            this.entity=entity;
            this.loadFormValues(entity);
          });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout d'actionnaire à un OPCVM")

    this.personneSettings = {
      singleSelection: false,
      idField: 'idPersonne',
      textField: 'denomination',
      enableCheckAll: true,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }

  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({libelleFr: entity.libelleFr});
    this.entityForm.patchValue({libelleEn: entity.libelleEn});
    this.entityForm.patchValue({id: entity.idPays});
    this.entityForm.patchValue({indicatif: entity.indicatif});
    this.entityForm.patchValue({monnaieDto: entity.monnaieDto});
    this.entityForm.patchValue({paysDto: entity});
    this.entityForm.patchValue({estGafi: entity.estGafi});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  get personnes(): FormArray { return <FormArray>this.entityForm.get('personne')}

  getPersonne()
  {
    alert("Lol !!");
    const sb  = this.personneService.afficherPersonneNotInOpcvm(
        this.localStore.getData("currentOpcvm")?.idOpcvm).subscribe(
        (data)=>{
          this.personne$=data
          this.personne=data
        }
    )
  }

  public onFilterChange(item: any) {
    // console.log('onFilterChange', item);
  }

  public onDropDownClose(item: any) {
    // console.log('onDropDownClose', item);
  }

  public onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }

  get f() { return this.entityForm.controls; }

  addRow(id: string) {
    if(this.entityForm.value.personne.idPersonne!=undefined ||
        this.entityForm.value.personne.idPersonne!=null)
    {
      this.idPersonne=this.entityForm.value.personne.idPersonne;
    }
    else
    {
      return;
    }
    this.personneService.getById(this.idPersonne).subscribe(
        (data) => {
          //this.personnel2$ = data;
          this.personne = data;
          // @ts-ignore
          this.tableau = document.getElementById(id);
          var nbreLigne = this.tableau.getElementsByTagName('tr').length
          var ajouter = true;
          // if(nbreLigne==0){
          //   ajouter=true;
          // }
          for (let i = 1; i < nbreLigne; i++) {
            if (this.tableau.getElementsByTagName('tr')[i].cells[0].innerHTML===this.personne.idPersonne.toString()) {
              ajouter = false;
            }
          }
          if (ajouter) {
            var tr = document.createElement('tr'); //On créé une ligne
            var td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = this.personne.idPersonne.toString();
            // @ts-ignore
            if (this.tableau.firstChild.tagName == 'TBODY') {
              // @ts-ignore
              this.tableau.firstChild.appendChild(tr);
            } else {
              this.tableau.appendChild(tr);
            }
            td.hidden = true;
            var td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = this.personne.denomination;
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
          } else {
            alert("cette personne a déjà été ajoutée")
          }
        }
    );
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
    /*this.tableau = document.getElementById("table_PersonneOpcvm");
    var length = this.tableau.getElementsByTagName('tr').length
    if (length == 1) {
      alert("Veuillez ajouter au moins un actionnaire")
      return;
    }*/
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
              this.router.navigate(['/opcvm/standard/actionnaireopcvm']);
            })
        )
        .subscribe(
          (data)=>{
          /*  this.nbreLigne = document.getElementById("table_PersonneOpcvm").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
            var i: number = 2;
            //        console.log(this.nbreLigne);
            for (i === 2; i < this.nbreLigne; i++) {
              this.actionnaireOpcvm=new Actionnaireopcvm();
              this.actionnaireOpcvm.opcvm=new Opcvm();
              this.actionnaireOpcvm.opcvm.idOpcvm=this.authService.LocalStorageManager.getValue("currentOpcvm").idOpcvm;
              this.actionnaireOpcvm.personne=new Personne();
              // @ts-ignore
              this.actionnaireOpcvm.personne.idPersonne=document.getElementById("table_PersonneOpcvm").getElementsByTagName('tr')[i].cells[0].innerHTML;
              // console.log("act"+i,this.actionnaireOpcvm)
              this.entityService.create(this.actionnaireOpcvm).subscribe();
            }*/
          }
      );
    this.subscriptions.push(sb);
  }

  saveEntity() {
     this.opcvm=new Opcvm();

     let actionnaireOpcvmTab:any[]=[];

    let personne= this.entityForm.value.personne.map((u: any) => {
      return {personne: u};
    })
    console.log("personneMap==",personne)
    console.log("length=",this.entityForm.value.personne.length)

    // @ts-ignore
    let i:number=0;
    let total:number=this.entityForm.value.personne.length
    for( i===0;i<total;i++){
      this.actionnaireOpcvm=new Actionnaireopcvm();
      this.actionnaireOpcvm.opcvm=new Opcvm();
      this.actionnaireOpcvm.opcvm.idOpcvm=this.localStore.getData("currentOpcvm")?.idOpcvm;
      this.actionnaireOpcvm.personne=new Personne();

      this.actionnaireOpcvm.personne=this.entityForm.value.personne[i];
      //console.log("personne "+i,this.entityForm.value.personne[i])
      actionnaireOpcvmTab.push(this.actionnaireOpcvm);
    }
    // @ts-ignore
     //this.actionnaireOpcvm.personne.idPersonne=document.getElementById("table_PersonneOpcvm").getElementsByTagName('tr')[1].cells[0].innerHTML;
    const entity: any = {
      ...this.entityForm.value,
      opcvm:this.opcvm
    };
     console.log("act1",actionnaireOpcvmTab)
    return this.id
        ? this.entityService.update(actionnaireOpcvmTab)
        : this.entityService.create (actionnaireOpcvmTab);
  }
}

