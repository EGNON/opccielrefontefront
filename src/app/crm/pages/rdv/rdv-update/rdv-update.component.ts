import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription, tap} from "rxjs";
import {Personnel} from "../../../models/personne/personnel.model";
import {Personnephysiquemorale} from "../../../models/personne/personnephysiquemorale.model";
import {AgentConcerne} from "../../../models/agentconcerne.model";
import {PieceJointe} from "../../../models/piece-jointe.model";
import {PersonnelService} from "../../../services/personne/personnel.service";
import {RdvService} from "../../../services/rdv.service";
import {AgentConcerneService} from "../../../services/agentconcerne.service";
import {PersonneService} from "../../../services/personne/personne.service";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize} from "rxjs/operators";
import {Time} from "@angular/common";
import {Personne} from "../../../models/personne/personne.model";
import {Pays} from "../../../models/pays.model";
import {Quartier} from "../../../models/quartier.model";
import {RDV} from "../../../models/rdv.model";
import {Commune} from "../../../models/commune.model";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ModeleMsgAlerte} from "../../../models/modelemsgalerte.model";

@Component({
    selector: 'app-rdv-update',
    templateUrl: './rdv-update.component.html',
    styleUrls: ['./rdv-update.component.scss'],
    standalone: false
})
export class RdvUpdateComponent implements OnInit, OnDestroy{
  id?: number;
  idRdv:number;
  nbreLigne:number;
  isLoading = false;
  submitting = false;
  submitted = false;
  formData: FormGroup;
  agentConcerneData: FormGroup;
  personne$:any;
  idPersonne:number;
  selectElmt:any;
  selectPersonnel:any;
  afficherVilleDansVue:boolean;
  valeurselectionnee:any;
  personnelSelectionnee:any;
  personnel$:any;
  entity:any;
  personnel2$:any;
  personnel:Personnel;
  personnePhysiqueMorale:Personnephysiquemorale;
  agentConcerne:AgentConcerne;
  agentConcerne$:AgentConcerne[];
  tableau:HTMLElement;
  selectElementTableau:any;
  rdvDto:any;
  // pieceJointeSelonRDV:PieceJointe[];
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  previews = new Array<string>();

  private subscriptions: Subscription[] = [];

  constructor(
    public personnelService: PersonnelService,
    private rdvService: RdvService,
    private agentConcerneService: AgentConcerneService,
    private personneService: PersonneService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.pageInfo.updateTitle("Infos réelles")
    this.id = this.route.snapshot.params['id'];
    this.formData = this.fb.group(
      {
        id:[this.id],
        idRdv:[this.id],
        dateDebReelle: [this.formatDate(new Date()), Validators.required],
        dateFinReelle: [this.formatDate(new Date()), Validators.required],
        heureFinReelle: [[
          (new Date().getHours()),
          (new Date().getMinutes()),
          new Date().getSeconds(),
        ].join(':'), Validators.required],
        heureDebReelle: [[
          (new Date().getHours()),
          (new Date().getMinutes()),
          new Date().getSeconds(),
        ].join(':'), Validators.required]
      }
    );

    // this.afficherPersonne();
    // @ts-ignore

    if(this.id)
    {
      const sb = this.rdvService.getEntityById(this.id)
        .pipe(tap(
          entity => {

            this.loadAGentConcerne(entity);
          }
        ))
        .subscribe((entity)=>{
          this.entity=entity;
          // console.log(this.entity)
          let heureFinReelle=this.entity.heureFinReelle
          // console.log("heureFin==",heureFinReelle)
          if(heureFinReelle===null)
          {
            heureFinReelle=[
              (new Date().getHours()),
              (new Date().getMinutes()),
              new Date().getSeconds(),
            ].join(':');
          }

          let heureDebReelle=this.entity.heureDebReelle
          // console.log("heuredeb==",heureDebReelle)
          if(heureDebReelle===null)
          {
            heureDebReelle=[
              (new Date().getHours()),
              (new Date().getMinutes()),
              new Date().getSeconds(),
            ].join(':');
          }

          this.formData.patchValue({heureFinReelle: heureFinReelle});
          this.formData.patchValue({heureDebReelle: heureDebReelle});
          let dateDebReelle = this.entity.dateDebReelle;// new Date();
          let dateFinReelle = this.entity.dateFinReelle;//new Date();
          // console.log("dateDebReelle==",dateDebReelle)
          // console.log("dateFinReelle==",dateFinReelle)

          if(dateDebReelle===null)
            dateDebReelle=new Date()

          if(dateFinReelle===null)
            dateFinReelle=new Date()

          this.formData.patchValue({dateDebReelle:
                this.formatDate(dateDebReelle)});
          this.formData.patchValue({dateFinReelle: this.formatDate(dateFinReelle)});
        });
      this.subscriptions.push(sb);
    }
  }
  loadAGentConcerne(entity:any)
  {
    this.agentConcerneService.afficherAgentConcerneSelonRRDV(entity.idRdv).subscribe(
      (data)=>{
        this.agentConcerne$=data;
        let i=0;
        for(i=0;i<this.agentConcerne$.length;i++)
        {
          // @ts-ignore
          this.tableau = document.getElementById("table_Charge");
          //Calcul du nombre de cellule par ligne dans le tableau -> on regarde combien il y a de td dans le premier tr

          var tr = document.createElement('tr'); //On créé une ligne
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.agentConcerne$[i].personnelDto.idPersonne.toString();

          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }
          td.hidden=true;
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.agentConcerne$[i].personnelDto.denomination;
          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }

          var checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = 'car'+i;
          checkbox.name = 'check'+i;
          checkbox.checked = this.agentConcerne$[i].etat;
          tr.appendChild(checkbox);
          // checkbox.value = String(false);
          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }

          // var buttonElement = document.createElement('button');
          // // buttonElement.className="buttonSupprimer";
          // buttonElement.style.alignContent="center";
          // buttonElement.style.borderStyle="none";
          // buttonElement.style.marginTop="5 px";
          // console.log(tr.rowIndex);
          // // @ts-ignore
          // // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
          // var _this = this;
          // buttonElement.addEventListener("click", function (evt)
          // { return _this.removeLine(tr.rowIndex); });
          // // buttonElement.onclick=this.removeLine(tr.rowIndex);
          // tr.appendChild(buttonElement);
          // buttonElement.innerHTML = "X";
          // // @ts-ignore
          // if(this.tableau.firstChild.tagName == 'TBODY'){
          //   // @ts-ignore
          //   this.tableau.firstChild.appendChild(tr);
          // }
          // else{
          //   this.tableau.appendChild(tr);
          // }
        }
      }
    );
  }
  private formatDate(date:Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.formData.controls; }

  onSaveRdv()
  {
    // @ts-ignore
    this.tableau = document.getElementById("table_Charge");
    var length = this.tableau.getElementsByTagName('tr').length
    if(length==1)
    {
      alert("Veuillez ajouter au moins un chargé")
    }
    else {
      this.isLoading = true;
      this.submitted = true;
      if (this.formData.invalid) return;
      const sb = this.saveRDV()
        .pipe(
          catchError((err) => {
            return of(undefined);
          }),
          finalize(() => {
            this.submitted = false;
            this.isLoading = false;
            this.router.navigate(['/crm/rendezvous/rdv']);
          })
        )
        .subscribe((data) => {

          this.rdvDto = data;

          // @ts-ignore
          // this.tableau=document.getElementById("table_Charge");
          this.nbreLigne = document.getElementById("table_Charge").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
          // @ts-ignore
          var i: number = 1;
           var l=1;
           var col="";
           // @ts-ignore
           // var nbreColonne=document.getElementById("table_Charge").getElementsByTagName('tr')[0].cells.length;
           // for (i === 1; i < this.nbreLigne; i++) {
           //   // for ( l == 0; l < nbreColonne; l++) {
           //       // @ts-ignore
           //   col="car".concat(i-1);
           //   // console.log(col);
           //   // @ts-ignore
           //   console.log(document.getElementById(col).value);
           //   // }
           // }
           // i=1;
          //        console.log(this.nbreLigne);
          // @ts-ignore
          // this.agentConcerneService.supprimerAgentConcerne(this.id).subscribe();
          for (i === 1; i < this.nbreLigne; i++) {

            // @ts-ignore
            // console.log(document.getElementById("table_Charge").getElementsByTagName('tr')[i].cells[2].innerHTML);
            this.agentConcerne = new class implements AgentConcerne {
              dateDebReelle: Date;
              dateFinReelle: Date;
              heureDebReelle: Time;
              heureFinReelle: Time;
              id: any;
              personnelDto: Personnel;
              rdvDto: RDV;
              etat:boolean;
            }
            if (this.id != null) {
              this.agentConcerne.rdvDto=new class implements RDV {
                dateDebRdv: Date;
                dateFinRdv: Date;
                denomination: string;
                documents: PieceJointe[];
                heureFinRdv: Time;
                heureDebutRdv: Time;
                id: any;
                idPersonne: number;
                idRdv: number;
                libelleVille: string;
                objetRdv: string;
                paysDto: Pays;
                personnePhysiqueMoraleDto: Personnephysiquemorale;
                personne: Personne;
                quartierDto: Quartier;
                communeDto: Commune;
                dateDebReelle:Date;
                heureDebReelle:Time;
                dateFinReelle:Date;
                heureFinReelle:Time;
                modeleMsgAlerteDto:ModeleMsgAlerte;
                agentConcerneDtos:AgentConcerne[];
              };
              this.agentConcerne.rdvDto.idRdv = this.id;
            }
            this.agentConcerne.personnelDto = new  Personnel();
            // @ts-ignore
            this.agentConcerne.personnelDto.idPersonne = document.getElementById("table_Charge").getElementsByTagName('tr')[i].cells[0].innerHTML;
            let idPersonne=this.agentConcerne.personnelDto.idPersonne;
            let idRDv=this.id;
            // @ts-ignore
            // this.selectElementTableau=document.getElementById("car"+i-1);

            // console.log(this.selectElementTableau.options[this.selectElementTableau.selectedIndex].value);
            this.agentConcerne.etat = document.getElementById("car".concat(i-1)).checked;
            this.agentConcerneService.updateAgent(this.agentConcerne,idPersonne,idRDv).subscribe();
          }
        });
      this.subscriptions.push(sb);
    }
  }

  saveRDV() {
    const entity: any = {
      ...this.formData.value
    };

    return this.id
      ? this.rdvService.modifierUnePartieDeRDV(entity,this.id)
      : this.rdvService.create(entity);

  }
  addRow(id: string){
    this.personnelService.afficherPersonnelSelonId(this.idPersonne).subscribe(
      (data) => {
        this.personnel2$=data;
        this.personnel=data;
        // this.retournerPersonnePhysique(data);
        //Calcul du nombre de cellule par ligne dans le tableau -> on regarde combien il y a de td dans le premier tr
        //var tds = this.tableau.getElementsByTagName('tr')[0].getElementsByTagName('td').length;
        // @ts-ignore
        this.tableau = document.getElementById(id);
        var nbreLigne = this.tableau.getElementsByTagName('tr').length
        var ajouter=true;
        // if(nbreLigne==0){
        //   ajouter=true;
        // }
        for(let i=1;i<nbreLigne;i++)
        {
          if(this.tableau.getElementsByTagName('tr')[i].
            cells[0].innerHTML.indexOf(this.personnel.idPersonne.toString())!=-1)
          {
            ajouter=false;
          }
        }
        if(ajouter)
        {
          var tr = document.createElement('tr'); //On créé une ligne
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.personnel.idPersonne.toString();


          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }
          td.hidden=true;
          var td = document.createElement('td');
          tr.appendChild(td);
          td.innerHTML = this.personnel.nom+" "+this.personnel.prenom;
          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }
          var buttonElement = document.createElement('button');
          // buttonElement.className="buttonSupprimer";
          buttonElement.style.alignContent="center";
          buttonElement.style.borderStyle="none";
          buttonElement.style.marginTop="5 px";
          // @ts-ignore
          // buttonElement.addEventListener("click",this.removeLine(tr.rowIndex))
          var _this = this;
          buttonElement.addEventListener("click", function (evt)
          { return _this.removeLine(tr.rowIndex); });
          // buttonElement.onclick=this.removeLine(tr.rowIndex);
          tr.appendChild(buttonElement);
          buttonElement.innerHTML = "X";

          // @ts-ignore
          if(this.tableau.firstChild.tagName == 'TBODY'){
            // @ts-ignore
            this.tableau.firstChild.appendChild(tr);
          }
          else{
            this.tableau.appendChild(tr);
          }
        }
        else
        {
          alert("ce chargé a déjà été ajouté")
        }
      }
    );

  }
  removeLine(index:number){
    // @ts-ignore
    this.tableau = document.getElementById("table_Charge");
    var length = this.tableau.getElementsByTagName('tr').length
    if(length==2)
    {
      var tr = this.tableau.getElementsByTagName('tr')[1] ;
      tr.remove();
    }
    else
    {
      var tr = this.tableau.getElementsByTagName('tr')[index];
      tr.remove();
    }
    //  console.log(tr);
    // console.log(index);

  }
  col(){
    // @ts-ignore
    // this.tableau=document.getElementById("table_Charge");
    this.nbreLigne = document.getElementById("table_Charge").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
    // console.log("nbre de colonne")
    // var nbreColonne=document.getElementById("table_Charge").getElementsByTagName('tr')[0].cells.length;
    var i=1;
    var col="";
    for (i === 1; i < this.nbreLigne; i++) {
      // for ( l == 0; l < nbreColonne; l++) {
      // @ts-ignore
      col="car".concat(i-1);
      // }
    }
  }
}
