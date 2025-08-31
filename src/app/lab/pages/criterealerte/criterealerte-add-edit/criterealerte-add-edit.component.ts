import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {delay, of, Subscription, tap} from "rxjs";
import {NgbActiveModal, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {DegreService} from "../../../../crm/services/degre.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {Degre} from "../../../../crm/models/degre.model";
import {CritereAlerteService} from "../../../services/criterealerte.service";
import {CritereAlerte} from "../../../models/criterealerte.model";
import * as CryptoJS from 'crypto-js';
import {CryptageService} from "../../../services/cryptage.service";
import {executeBrowserBuilder} from "@angular-devkit/build-angular";
import {SweetAlertOptions} from "sweetalert2";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";

@Component({
    selector: 'app-criterealerte-add-edit',
    templateUrl: './criterealerte-add-edit.component.html',
    styleUrl: './criterealerte-add-edit.component.scss',
    standalone: false
})
export class CriterealerteAddEditComponent implements OnInit, OnDestroy {
  id?: number;
  isLoading = false;
  submitting = false;
  submitted = false;
  expression:string;
  express:string[];
  critereAlerteForm: FormGroup;
  dateAlerte:Date;
  message:string;
  encryptSecretKey:string="AAAAA";
  swalOptions: SweetAlertOptions = {};
  private subscriptions: Subscription[] = [];
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  @Input() entity: any;
  @Input() isModal: boolean = false;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    private critereAlerteService: CritereAlerteService,
    private cryptageService: CryptageService,
    private pageInfo: PageInfoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dateAlerte = new Date();

    this.id = this.route.snapshot.params['id'];
    this.empecherSaisie()
    this.critereAlerteForm = this.fb.group(
      {
        dateAlerte: [new NgbDate(
          this.dateAlerte.getFullYear(), this.dateAlerte.getMonth()+1, this.dateAlerte.getDate()),
          Validators.required],
        id: [null],
        description: [null, Validators.required],
        expression: [null, Validators.required],
        critere: [null],
        operateur: [null],
        valeur: [null],
        etat: [null, Validators.required],
      }
    );

    if (this.id) {
      console.log(this.id)
      this.pageInfo.updateTitle("Modification de critère alerte")
      const sb = this.critereAlerteService.getById(this.id)
        .pipe(first())
        .subscribe((entity) =>
        { console.log(entity.data)
          this.loadFormValues(entity.data)
        });
      this.subscriptions.push(sb);
    }
    else {
      this.pageInfo.updateTitle("Ajout de critère alerte")
      this.critereAlerteForm.patchValue({valeur:' '})
      this.critereAlerteForm.patchValue({etat: 'Actif'});
    }
  }
  loadFormValues(entity: any)
  {
    this.entity = entity;
    this.critereAlerteForm.patchValue({description: entity.description});
    this.critereAlerteForm.patchValue({etat: entity.etat});
    this.critereAlerteForm.patchValue({expression: entity.expression});
    let dateAlerte = new Date(entity.dateAlerte);
    this.critereAlerteForm.patchValue({dateAlerte: new NgbDate(
        dateAlerte.getFullYear(), dateAlerte.getMonth()+1, dateAlerte.getDate())});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() {
    return this.critereAlerteForm.controls;
  }
  empecherSaisie()
  {
    // @ts-ignore
    document.getElementById("expression").addEventListener("keydown",function(e){
      e.preventDefault()},{passive:false})
    // @ts-ignore
    document.getElementById("expression").addEventListener("paste",function(e){
      e.preventDefault()},{passive:false})
  }
  requeteSql()
  {
    // @ts-ignore
    this.expression=this.critereAlerteForm.get('expression')?.value
    this.expression=this.expression.replaceAll("Type de client=","LibelleTypePersonne like "
    ).replaceAll("client=","denomination like ").replaceAll("Montant de la transaction","montant").replaceAll(
      "Quantité de part","QtePart"
    ).replaceAll("Pays de résidence=","nomPays like ").replaceAll(
      "devise=","codeMonnaie like "
    ).replaceAll("ET","AND").replaceAll("OU","OR")
  }

  et()
  {
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: this.message,
    };
    // @ts-ignore
    this.expression=this.critereAlerteForm.get('expression')?.value
    let valeur="";
    if(this.expression!=null)
    {
      this.expression=this.expression.trim()
      console.log("expression",this.expression)
      this.express=this.expression.split(' ');
      // let valeur=this.expression.substring(this.expression.length-1,this.expression.length);
      valeur=this.express[this.express.length-1]
      console.log("valeur",valeur)
    }
    if(valeur==="OU" || valeur==="(" || valeur==="ET" || this.expression===null ||this.expression.trim()===""){
      // alert("Expression incorrecte")
      errorAlert.text="Expression incorrecte";
      this.showAlert(errorAlert);
    }
    else
    {
      // @ts-ignore
      this.critereAlerteForm.patchValue({expression:this.expression+" ET "})
    }
  }

  ou()
  {
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: this.message,
    };
    // @ts-ignore
    this.expression=this.critereAlerteForm.get('expression')?.value
    let valeur="";
    if(this.expression!=null)
    {
      this.expression=this.expression.trim()
      console.log("expression",this.expression)
      this.express=this.expression.split(' ');
      // let valeur=this.expression.substring(this.expression.length-1,this.expression.length);
      valeur=this.express[this.express.length-1]
      console.log("valeur",valeur)
    }
    if(valeur==="ET" || valeur==="(" || valeur==="OU" || this.expression===null||this.expression.trim()===""){
      // alert("Expression incorrecte")
      errorAlert.text="Expression incorrecte";
      this.showAlert(errorAlert);
    }
    else
    {
      // @ts-ignore
      this.critereAlerteForm.patchValue({expression:this.expression+" OU "})
    }
  }
  parentheseOuvrante()
  {
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: this.message,
    };
    // @ts-ignore
    this.expression=this.critereAlerteForm.get('expression')?.value
    let valeur="";
    if(this.expression!=null)
    {
      this.expression=this.expression.trim()
      console.log("expression",this.expression)
      this.express=this.expression.split(' ');
      // let valeur=this.expression.substring(this.expression.length-1,this.expression.length);
      if(this.expression!="")
        valeur=this.express[this.express.length-1]
      else
        valeur="OU"

      console.log("valeur",valeur)
    }
    else
      valeur="OU";

    if(valeur!="OU" && valeur!="(" && valeur!="ET"){
      // alert("Expression incorrecte")
      errorAlert.text="Expression incorrecte";
      this.showAlert(errorAlert);
    }
    else
    {
      // @ts-ignore
      if(this.expression!=null)
        this.critereAlerteForm.patchValue({expression:this.expression+" ( "})
      else
        this.critereAlerteForm.patchValue({expression:"( "})
    }
  }

  parentheseFermante()
  {
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: this.message,
    };
    // @ts-ignore
    this.expression=this.critereAlerteForm.get('expression')?.value
    let valeur="";
    if(this.expression!=null)
    {
      this.expression=this.expression.trim()
      console.log("expression",this.expression)
      this.express=this.expression.split(' ');
      // let valeur=this.expression.substring(this.expression.length-1,this.expression.length);
      valeur=this.express[this.express.length-1]
      console.log("valeur",valeur)
    }

    if(valeur==="OU" || valeur==="(" || valeur==="ET" || this.expression===null||this.expression.trim()===""){
      // alert("Expression incorrecte")
      errorAlert.text="Expression incorrecte";
      this.showAlert(errorAlert);
    }
    else
    {
      // @ts-ignore
      this.critereAlerteForm.patchValue({expression:this.expression+" ) "})
    }
  }
  ajouter()
  {
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: this.message,
    };
    // @ts-ignore
    this.expression=this.critereAlerteForm.get('expression')?.value
    let valeur="";
    if(this.expression!=null)
    {
      this.expression=this.expression.trim()
      console.log("expression",this.expression)
      this.express=this.expression.split(' ');
      // let valeur=this.expression.substring(this.expression.length-1,this.expression.length);
      valeur=this.express[this.express.length-1]
      console.log("valeur",valeur)
    }
    else
    {
      if(this.critereAlerteForm.get('critere')?.value==="Montant de la transaction"||
      this.critereAlerteForm.get('critere')?.value==="Quantité de part")
      {
        if((this.critereAlerteForm.get('operateur')?.value)===null)
        {
          // console.log("pass")
          // alert("veuillez choisir un opérateur")
          // this.message="veuillez choisir un opérateur";
          errorAlert.text="veuillez choisir un opérateur";
          // errorAlert.text = this.extractText(errorAlert);
          this.showAlert(errorAlert);
          return;
        }
        if((<string>this.critereAlerteForm.get('valeur')?.value).trim()==="")
        {
          // alert("veuillez saisir une valeur")
          // this.message="veuillez saisir une valeur";
          errorAlert.text="veuillez saisir une valeur";
          // errorAlert.text = this.extractText(errorAlert);
          this.showAlert(errorAlert);
          return;
        }

        this.expression=this.critereAlerteForm.get('critere')?.value+this.critereAlerteForm.get('operateur')?.value
          + (<string>this.critereAlerteForm.get('valeur')?.value).trim();
      }
      else
      {
        // if(this.critereAlerteForm.get('critere')?.value==="client")
        //   this.expression=this.critereAlerteForm.get('critere')?.value+" like "
        //   +"'%"+ (<string>this.critereAlerteForm.get('valeur')?.value).trim()+"%'";
        // else
          this.expression=this.critereAlerteForm.get('critere')?.value+"="
            +"'%"+ (<string>this.critereAlerteForm.get('valeur')?.value).trim()+"%'";
      }

      this.critereAlerteForm.patchValue({expression:this.expression});
      return;
    }
    if(valeur!="OU" && valeur!="(" && valeur!="ET" && this.expression.trim()!=""){
      // alert("Expression incorrecte")
      // this.message="Expression incorrecte";
      errorAlert.text="Expression incorrecte";
      // errorAlert.text = this.extractText(errorAlert);
      this.showAlert(errorAlert);
    }
    else
    {
      // @ts-ignore
      if(this.critereAlerteForm.get('critere')?.value==="Montant de la transaction"||
        this.critereAlerteForm.get('critere')?.value==="Quantité de part") {
        if((this.critereAlerteForm.get('operateur')?.value)===null)
        {
          // console.log("pass")
          // alert("veuillez choisir un opérateur")
          // this.message="veuillez choisir un opérateur";
          errorAlert.text="veuillez choisir un opérateur";
          // errorAlert.text = this.extractText(errorAlert);
          this.showAlert(errorAlert);
          return;
        }
          if((<string>this.critereAlerteForm.get('valeur')?.value).trim()==="")
          {
            // alert("veuillez saisir une valeur")
            // this.message="veuillez saisir une valeur";
            errorAlert.text="veuillez saisir une valeur";
            // errorAlert.text = this.extractText("veuillez saisir une valeur");
            this.showAlert(errorAlert);
            return;
          }
          this.expression += " " + this.critereAlerteForm.get('critere')?.value + this.critereAlerteForm.get('operateur')?.value
            + (<string>this.critereAlerteForm.get('valeur')?.value).trim();
      }
      else
      {
        // if(this.critereAlerteForm.get('critere')?.value==="client")
        //   this.expression+=" "+this.critereAlerteForm.get('critere')?.value+" like "
        //     +"'%"+ (<string>this.critereAlerteForm.get('valeur')?.value).trim()+"%'";
        // else
          this.expression+=" "+this.critereAlerteForm.get('critere')?.value+"="
            +"'%"+ (<string>this.critereAlerteForm.get('valeur')?.value).trim()+"%'";
      }

      this.critereAlerteForm.patchValue({expression:this.expression});

      // this.critereAlerteForm.patchValue({expression:this.expression+" ) "})
    }
  }
  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
  extractText(obj: any): string {
    // var textArray: string[] = [];
    //
    // for (var key in obj) {
    //   if (typeof obj[key] === 'string') {
    //     // If the value is a string, add it to the 'textArray'
    //     textArray.push(obj[key]);
    //   } else if (typeof obj[key] === 'object') {
    //     // If the value is an object, recursively call the function and concatenate the results
    //     textArray = textArray.concat(this.extractText(obj[key]));
    //   }
    // }
    //
    // // Use a Set to remove duplicates and convert back to an array
    // var uniqueTextArray = Array.from(new Set(textArray));
    //
    // // Convert the uniqueTextArray to a single string with line breaks
    // var text = uniqueTextArray.join('\n');

    return obj;
  }


  effacer()
  {
    this.critereAlerteForm.patchValue({expression:""})
  }
  onSaveCritereAlerte() {
    const errorAlert: SweetAlertOptions = {
      icon: 'error',
      title: 'Error!',
      text: this.message,
    };
    this.isLoading = true;
    if (this.critereAlerteForm.invalid) return;

    this.expression=this.critereAlerteForm.get('expression')?.value

    let i=0;
    let nbreParentheseOuverte=0;
    let nbreParentheseFermante=0;
    for(i===0;i<this.expression.length;i++)
    {
      if(this.expression.charAt(i)==="(")
        nbreParentheseOuverte+=1;

      if(this.expression.charAt(i)===")")
        nbreParentheseFermante+=1;
    }
    if(nbreParentheseFermante!=nbreParentheseOuverte)
    {
      // alert("Parenthèse de trop");
      errorAlert.text="Parenthèse de trop";
      this.showAlert(errorAlert)
      return;
    }
    this.expression=this.expression.trim()
    this.express=this.expression.split(' ');
    let valeur=this.express[this.express.length-1]
    if(valeur=="OU" || valeur=="ET"){
      // alert("Expression incorrecte")
      errorAlert.text="Expression incorrecte";
      this.showAlert(errorAlert)
      return;
    }
    const sb = this.saveCritereAlerte().pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap((resp) => {
        this.passEntry.emit(resp.data);
        this.modal.close();
      }),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        if (!this.isModal) this.router.navigate(['/lab/notifications/alertes']);
      })
    )
      .subscribe();
    this.subscriptions.push(sb);
  }

  saveCritereAlerte() {
    let dateAlerte: any;
    if(this.critereAlerteForm.controls.dateAlerte.value)
    {
      dateAlerte = new Date(
        this.critereAlerteForm.controls.dateAlerte.value.year,
        this.critereAlerteForm.controls.dateAlerte.value.month-1,
        this.critereAlerteForm.controls.dateAlerte.value.day+1);
    }
    this.requeteSql()
    console.log(this.expression)

    let route="/lab/transactions"//?critere="+this.cryptageService.encryptData(this.expression)
    const critereAlerte: CritereAlerte = {
      ...this.critereAlerteForm.value,
      dateAlerte:dateAlerte,
      idCritereAlerte: this.id ? this.id : null,
      id: this.id ? this.id : null,
      sql:this.expression,
      route:route
    };
    console.log(critereAlerte)
    return this.id
      ? this.critereAlerteService.update(critereAlerte)
      : this.critereAlerteService.create(critereAlerte);
  }
}
