import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';
import saveAs from 'file-saver';
import { Subject, Subscription, catchError, of, finalize } from 'rxjs';
import { AuthService } from '../../../../core/modules/auth';
import { JournalService } from '../../../../core/services/journal.service';
import { Personne } from '../../../../crm/models/personne/personne.model';
import { LibrairiesService } from '../../../../services/librairies.service';
import { LocalService } from '../../../../services/local.service';
import { ExerciceService } from '../../../services/exercice.service';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-paiementdividende',
  standalone: false,
  templateUrl: './paiementdividende.html',
  styleUrl: './paiementdividende.scss'
})
export class Paiementdividende implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  form: FormGroup;

  currentOpcvm: any;
  currentSeance: any;
  currentUser: any;
 libelle:string;
  id:number;
  downloading = false;
  export = false;
  saveBouton = false;
  downloaded = false;
  submitting = false;
  submitted = false;
  dateDebut:any;
  dateFin:any;
  titreSolde:any;
  annee:number;
  idOperationTab:any[]
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];

  //DataTable Config
  datatableConfig: Config = {};
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;

  isLoading: boolean = false;
  enregsitrer_Enabled: boolean = false;
  subscriptions: Subscription[] = [];
   public journalSettings = {};
  actionnaireSelectionne: Personne[];  
  exercice$: any;
  exercice: any;
  journal: any;
  codeJournal:any;
  actionnaire:any;
  phasePAiement$:any;
  detachementCoupon$:any;
  codeExercice:any;
  totalAdistribuer:number
 public exerciceSettings = {};
  allData:any;
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStore: LocalService,
    public journalService: JournalService,
     private route: ActivatedRoute,
    private libService: LibrairiesService,
    private exerciceService: ExerciceService,
    public renderer: Renderer2) {
    this.currentUser = this.authService.currentUserValue;
    this.currentOpcvm = this.localStore.getData("currentOpcvm");
    this.currentSeance = this.localStore.getData("currentSeance");

   this.afficherexercice();
   
    
  }
 
 
  ngAfterContentInit(): void {
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {

    const dateOuv = new Date(this.currentSeance?.dateOuverture);
    this.dateDebut=new Date(this.currentSeance?.dateFermeture);
    this.dateFin = new Date(this.currentSeance?.dateFermeture);
    // this.route.paramMap.subscribe(params => {
    //   this.libelle = params.get('libelle') ?? '';
    // });
    this.form = this.fb.group({
     exercice:[null],
     solde:[0],
     banque:[null],
     totalDistribuer:[0],
    });
    this.exerciceSettings = {
      singleSelection: true,
      idField: 'codeExercice',
      textField: 'codeExercice',
      enableCheckAll: false,
      selectAllText: 'Sélectionnez tous',
      unSelectAllText: 'Ne pas tout sélectionné',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Rechercher un élément',
      noDataAvailablePlaceholderText: 'Aucune donnée à afficher',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    this.enregsitrer_Enabled=true
    this.titreSolde="SOLDE DU COMPTE"
    this.codeExercice=""
    this.idOperationTab=[]
  }
  
  get totalDistribuer(): number {
    if(this.enregsitrer_Enabled===false)
      return this.phasePAiement$
        ?.reduce((sum, l) => sum + (Number(l.reste) || 0), 0) || 0;
    else
      return this.phasePAiement$
        ?.reduce((sum, l) => sum + (Number(l.montantPayer) || 0), 0) || 0;
  }

  actualiser() {
    if(this.codeExercice===""){
      alert("Veuillez choisir un exercice")
      return
    }
    this.submitting=true
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    
          const sb = this.libService.paiementDividende(this.codeExercice,idOpcvm)
            .subscribe(resp => {
              console.log("Retour releve === ", resp.data);
              this.phasePAiement$=resp.data
                  
              this.submitting=false
            });
          this.subscriptions.push(sb);
        
  }
  
  exportExcel() {
      this.export=true

      // 1️⃣ Définir les entêtes
      const headers = ['ID','N° COMPTE SGI','ACTIONNAIRE','MONTANT PAYE'];
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      
          const sb = this.libService.paiementDividende(this.codeExercice,idOpcvm).subscribe(
        (data)=>{
          this.allData=data.data;
          const exportData = this.allData.map(item => ({
            'ID': item.idActionnaire,
            'N° COMPTE SGI':item.numCompteSgi,
            'ACTIONNAIRE': item.intitule,
            'MONTANT PAYE': item.montantPayer,
          }));
  
          // 3️⃣ Convertir en feuille Excel
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });
  
          // 4️⃣ Créer le classeur
          const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };
  
          // 5️⃣ Exporter
          const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
          saveAs(blob, 'avis paiement'+this.codeExercice+'.xlsx');
          this.export=false
        }
      )
      // 2️⃣ Mapper les données avec les entêtes
  
    }
    getIdOperation(isSelected, idOperation){
    console.log(isSelected, idOperation)

    if(isSelected==true)
      this.idOperationTab.push(idOperation)
    else
    {
      let index=this.idOperationTab.indexOf(idOperation)
      if(index!==-1)
        this.idOperationTab.splice(index,1)
    }
    console.log(this.idOperationTab)
  }
afficherexercice(){
    this.exerciceService.afficherExercice(this.currentOpcvm.idOpcvm).subscribe(
      (data)=>{
        this.exercice$=data
        this.exercice=data
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
    this.codeExercice=item.codeExercice
  
  }
  public onDeSelect(item: any) {
    // console.log('onDeSelect', item);
   this.codeExercice=""
  }

  public onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }
  public onDeSelectAll(items: any) {
    // console.log('onDeSelectAll', items);
  }
  generatePdf(){
    //this.nbreLigne = document.getElementById("table_AvisOperation").getElementsByTagName('tr').length;//[0].getElementsByTagName('td').length;
   if(this.idOperationTab.length===0){
     alert("Veuillez cocher les opérations s'il vous plait")
     return
   }
   this.downloading=true
    let id=""
    let l=0
    for(l===0;l<this.idOperationTab.length;l++){
      if(l===0)
        id=this.idOperationTab[l]
      else
        id+=","+this.idOperationTab[l]
    }
    this.libService.imprimerAvisPaiement(id).pipe(
        catchError((err) => {
          this.downloading = false;
          return of(err.message);
        }),
        finalize(() => {
          this.downloading = false;
          this.downloaded = false;
        })
      ).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'avis_paiement.pdf';
        a.click();
      });
    

}
  telecharger() {
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
    };
    param = {
      ...param,
      idOp:this.idOperationTab,
      dateDeb: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
      dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    }
    //.subscribe
    const sb = this.libService.avistransfertpartEtat(param)
      .pipe(
        catchError((err) => {
          this.downloading = false;
          return of(err.message);
        }),
        finalize(() => {
          this.downloading = false;
          this.downloaded = false;
        })
      )
     .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'avis_transfert_part.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }

   onSaveEntity()
    {
      
      this.isLoading = true;
      this.submitted = true;
      this.saveBouton=true
      
      const sb = this.saveEntity()
          .pipe(
              catchError((err) => {
                return of(undefined);
              }),
              finalize(() => {
                this.submitted = false;
                this.isLoading = false;
                this.saveBouton=false
                
              })
          )
          .subscribe(
            (data)=>{
              alert(data.data)
              window.location.reload();
            }
        );
      this.subscriptions.push(sb);
    }
  
    saveEntity() {
       
     let idOpcvm = this.currentOpcvm?.idOpcvm;
        // let param = {
        //   ...this.form.value,
        //   idOpcvm: idOpcvm,
        //    codeExercice:this.codeExercice,
        //    userLogin:this.currentUser.username
        // };
       
      
      return this.id
          ? this.libService.enregsitrerOperationPaiementDividende(this.codeExercice,
            idOpcvm,this.currentUser.username)
          :   this.libService.enregsitrerOperationPaiementDividende(this.codeExercice,
            idOpcvm,this.currentUser.username);
    }
}

