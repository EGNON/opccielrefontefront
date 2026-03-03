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
  selector: 'app-detachementeffectue',
  standalone: false,
  templateUrl: './detachementeffectue.html',
  styleUrl: './detachementeffectue.scss'
})
export class Detachementeffectue implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
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
  dividendeActionnaire$:any;
  detacementCoupon$:any;
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
     montantDistribue:[0],
     regul:[0],
     totalADistribuer:[0],
     couponUnitaire:[0],
     nombrePartEnCirculaion:[0],
     totalDistribuer:[0],
     reste:[0],
     typeArrondi:[null],
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
    this.codeExercice=""
  }
//   get totalMontantArecevoir(): number {
//     return this.precalculPhaseDetachement$
//       ?.reduce((sum, l) => sum + (Number(l.montantARecevoir) || 0), 0) || 0;
//   }
// get reste(): number {
//   // this.totalAdistribuer=Number(this.form.value.totalADistribuer)-this.totalMontantArecevoir
//     return Number(this.form.value.totalADistribuer)-this.totalMontantArecevoir
//   }
  actualiser() {
    if(this.codeExercice===""){
      alert("Veuillez choisir un exercice")
      return
    }
    this.submitting=true
    let idOpcvm = this.currentOpcvm?.idOpcvm;

     this.libService.detachementCoupon(this.codeExercice,idOpcvm).subscribe
              ((data)=>{
                let regul :number=0
                this.detacementCoupon$=data.data
                console.log(this.detacementCoupon$)
                if(this.detacementCoupon$.length!=0)
                {
                  this.form.patchValue({regul:this.detacementCoupon$[0].regBeneficeEnInstanceAffectation})
                  this.form.patchValue({totalDistribuer:((this.detacementCoupon$[0].totalDistribue))})
                  this.form.patchValue({totalADistribuer:((this.detacementCoupon$[0].totalADistribuer))})
                  this.form.patchValue({montantDistribue:((this.detacementCoupon$[0].montantDistribue))})
                  this.form.patchValue({nombrePartEnCirculaion:((this.detacementCoupon$[0].nombrePartEnCirculaion))})
                  this.form.patchValue({couponUnitaire:((this.detacementCoupon$[0].couponUnitaire))})
                  this.form.patchValue({reste:((this.detacementCoupon$[0].reste))})

                      const sb = this.libService.dividendeActionnaire(this.codeExercice,idOpcvm)
                      .subscribe(resp => {
                        // console.log("Retour releve === ", resp.data);
                        this.dividendeActionnaire$=resp.data
                        this.submitting=false
                        if(this.dividendeActionnaire$.length===0){
                          this.enregsitrer_Enabled=true
                        }
                        else
                          this.enregsitrer_Enabled=false
                      });
                    this.subscriptions.push(sb);
                  }
                  else
                  {
                     this.form.patchValue({regul:"0"})
                      this.form.patchValue({totalDistribuer:(("0"))})
                      this.form.patchValue({totalADistribuer:(("0"))})
                      this.form.patchValue({montantDistriue:(("0"))})
                      this.form.patchValue({nombrePartEnCirculaion:(("0"))})
                      this.form.patchValue({couponUnitaire:(("0"))})
                      this.form.patchValue({reste:(("0"))})
                      this.submitting=false
                  }
              })

          // this.enregsitrer_Enabled=false
        
  }

  exportExcel() {
      this.export=true

      // 1️⃣ Définir les entêtes
      const headers = ['ID','N° COMPTE SGI','ACTIONNAIRE','PART ACTUEL','MONT. A RECEVOIR'];
      let idOpcvm = this.currentOpcvm?.idOpcvm;
      
          const sb = this.libService.dividendeActionnaire(this.codeExercice,idOpcvm).subscribe(
        (data)=>{
          this.allData=data.data;
          const exportData = this.allData.map(item => ({
            'ID': item.idActionnaire,
            'N° COMPTE SGI':item.numCompteSgi,
            'ACTIONNAIRE': item.actionnaire,
            'PART ACTUEL': item.nombrePart,
            'MONT. A RECEVOIR': item.montantARecevoir
          }));
  
          // 3️⃣ Convertir en feuille Excel
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headers });
  
          // 4️⃣ Créer le classeur
          const wb: XLSX.WorkBook = { Sheets: { 'Données': ws }, SheetNames: ['Données'] };
  
          // 5️⃣ Exporter
          const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
          saveAs(blob, 'phase de detachement de coupon '+this.codeExercice+'.xlsx');
          this.export=false
        }
      )
      // 2️⃣ Mapper les données avec les entêtes
  
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
  telecharger() {
    this.downloading = true;
    const formValue = this.form.value;
    let idOpcvm = this.currentOpcvm?.idOpcvm;
    let param = {
      idOpcvm: idOpcvm,
      ...this.form.value,
      codeExercice:this.codeExercice,
      nbrePartEnCirculation:this.form.value.nombrePartEnCirculaion,
      typeForm:'liste'
    };
    // console.log(param)
    // param = {
    //   ...param,
    //   idOp:this.idOperationTab,
    //   dateDeb: new Date(param.dateDebut.year, param.dateDebut.month - 1, param.dateDebut.day + 1),
    //   dateFin: new Date(param.dateFin.year, param.dateFin.month - 1, param.dateFin.day + 1),
    // }
    //.subscribe
    const sb = this.libService.imprimerPhaseDetachement(param)
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
        a.download = 'liste_detachement_coupon_effectue.pdf';
        a.click();
      });
    this.subscriptions.push(sb);
  }

}