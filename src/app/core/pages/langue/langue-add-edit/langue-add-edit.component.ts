import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription} from "rxjs";
import {PaysService} from "../../../../crm/services/pays.service";
import {MonnaieService} from "../../../../crm/services/monnaie.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {LangueService} from "../../../services/langue.service";
import {Detailmodele} from "../../../models/detailmodele.model";
import {Formule} from "../../../models/formule";
import {PayslangueService} from "../../../services/payslangue.service";
import {Payslangue} from "../../../models/payslangue.model";
import {Langue} from "../../../models/langue.model";
import {Pays} from "../../../../crm/models/pays.model";

@Component({
  selector: 'app-langue-add-edit',
  templateUrl: './langue-add-edit.component.html',
  styleUrl: './langue-add-edit.component.scss'
})
export class LangueAddEditComponent implements OnInit, AfterViewInit, OnDestroy{
  id?: number;
  idPays?: number;
  pays$: any;
  pays: any;
  langue: any;
  public paysSettings = {};
  paysSelectionne: Pays[] = [];
  payslangue: Payslangue;
  payslangue$: any;
  nbreLigne: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  entityForm: FormGroup;
  tableau:HTMLElement;
  entity:any;
  private subscriptions: Subscription[] = [];

  constructor(
      public entityService: LangueService,
      public paysService: PaysService,
      public paysLangueService: PayslangueService,
      public pageInfo: PageInfoService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.entityForm = this.fb.group(
        {
          id: [this.id],
          idLangue: [this.id],
          libelleLangue: [null, Validators.required],
          codeLangue: [null, Validators.required],
          pays: [null],
          paysLangues: [null],
        }
    );

    this.getPaysAll();
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de langue")
      const sb = this.entityService.getById(this.id)
          .subscribe((entity)=>{
            this.entity=entity.data;
            this.loadFormValues(entity.data);
          });
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de langue")

    this.paysSettings = {
      singleSelection: false,
      idField: 'idPays',
      textField: 'libelleFr',
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
  createItem(data: any): FormGroup {
    return this.fb.group(data);
  }
  get payss(): FormArray { return <FormArray>this.entityForm.get('personnePhysiquePaysDtos')}
  get paysLangues(): FormArray { return <FormArray>this.entityForm.get('paysLangues')}

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

  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.entityForm.patchValue({libelleLangue:
      entity.libelleLangue});
    this.entityForm.patchValue({codeLangue: entity.codeLangue});
   // console.log(entity.paysLangues)
    if(entity.paysLangues != null && entity.paysLangues.length > 0)
    {
      this.paysSelectionne=[];
      for (let i = 0; i < entity.paysLangues.length; i++) {
        this.paysSelectionne.push(entity.paysLangues[i].pays)
      }
      this.paysLangues.patchValue(this.paysSelectionne);
    }
    else
    {
      this.paysSelectionne=[];
      this.paysLangues.patchValue(this.paysSelectionne);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getPaysAll()
  {
    this.paysService.afficherPaysListe().subscribe(
        (data)=>{
          this.pays$=data;
          this.pays=data;
        }
    )
  }
  addRow(id: string) {
    if(this.entityForm.value.pays.idPays!=undefined ||
        this.entityForm.value.pays.idPays!=null)
    {
      this.idPays=this.entityForm.value.pays.idPays;
    }
    else
    {
      return
    }
    this.paysService.getEntityById(this.idPays).subscribe(
        (data) => {
          //this.personnel2$ = data;
          this.pays = data;
          // @ts-ignore
          this.tableau = document.getElementById(id);
          let nbreLigne = this.tableau.getElementsByTagName('tr').length
          let ajouter = true;
          // if(nbreLigne==0){
          //   ajouter=true;
          // }
          for (let i = 1; i < nbreLigne; i++) {
            if (this.tableau.getElementsByTagName('tr')[i].cells[0].innerHTML.indexOf(this.pays.idPays.toString()) != -1) {
              ajouter = false;
            }
          }
          if (ajouter) {
            var tr = document.createElement('tr'); //On créé une ligne
            var td = document.createElement('td');
            tr.appendChild(td);
            td.innerHTML = this.pays.idPays.toString();
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
            td.innerHTML = this.pays.libelleFr;
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
            alert("ce pays a déjà été ajouté")
          }
        }
    );

  }
  removeLine(index: number) {
    // @ts-ignore
    this.tableau = document.getElementById("table_Pays");
    let length = this.tableau.getElementsByTagName('tr').length
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

  get f() { return this.entityForm.controls; }

  onSaveEntity()
  {
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
              this.router.navigate(['/app/standard/parametre/langue']);
            })
        )
        .subscribe(
            (data)=> {
              /*this.langue=data.data;
              // @ts-ignore
              this.nbreLigne = document.getElementById("table_Pays").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
              let i: number = 1;
              //        console.log(this.nbreLigne);
              this.paysLangueService.supprimerSelonLangue
              (this.langue.idLangue).subscribe(
                  (data)=>{
                    // console.log("delete==",data);
                  }
              );*/
              /*for (i === 1; i < this.nbreLigne; i++) {
                this.payslangue = new Payslangue();
                this.payslangue.langue = new Langue();
                  this.payslangue.langue=this.langue;
                // @ts-ignore
                this.payslangue.pays=new class implements Pays {}();
                // @ts-ignore
                this.payslangue.pays.idPays = document.getElementById("table_Pays").getElementsByTagName('tr')[i].cells[0].innerHTML;
                // @ts-ignore
                // console.log("pays langue"+i+"==",this.payslangue);
                this.paysLangueService.create(this.payslangue).subscribe();
              }*/
            }
        );
    this.subscriptions.push(sb);
  }

  saveEntity() {
    let entity: any ;
    if(this.entityForm.value.paysLangues!=null)
    {
      entity={
        ...this.entityForm.value,
        paysLangues: this.entityForm.value.paysLangues.map((u: any) => {
          return {langue: null, pays: u};
        })}
    }
    else
    {
      entity={
        ...this.entityForm.value
      }

    }

//    console.log("langue=",entity)
    if(this.id){
      this.paysLangueService.supprimerSelonLangue(this.id).subscribe();
    }
    return this.id
        ? this.entityService.update(entity)
        : this.entityService.create(entity);
  }

  ngAfterViewInit(): void {
    $('.select2').select2();
  }
}
