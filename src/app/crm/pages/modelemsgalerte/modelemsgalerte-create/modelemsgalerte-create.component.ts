import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {of, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, first} from "rxjs/operators";
import {ModeleMsgAlerte} from "../../../models/modelemsgalerte.model";
import {ModeleMsgAlerteService} from "../../../services/modelemsgalerte.service";
import {PageInfoService} from "../../../../template/_metronic/layout";
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import {Typemodele} from "../../../models/typemodele.model";
import {TypemodeleService} from "../../../services/typemodele.service";
import {TypemodelemessageService} from "../../../services/typemodelemessage.service";
import tinymce from "tinymce";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import {SweetAlertOptions} from "sweetalert2";
import {RdvService} from "../../../services/rdv.service";
import {data} from "jquery";
import {RDV} from "../../../models/rdv.model";


@Component({
  selector: 'app-modelemsgalerte-create',
  templateUrl: './modelemsgalerte-create.component.html',
  styleUrls: ['./modelemsgalerte-create.component.scss']
})
export class ModelemsgalerteCreateComponent implements OnInit, OnDestroy{
  declare  tinymce: any;
  id?: string;
  isLoading = false;
  submitting = false;
  submitted = false;
  formData: FormGroup;
  rdv:RDV[];
  typeModele:Typemodele;
  modeleMsgAlerte:ModeleMsgAlerte;
  typeModele$:any;
  entity: any;
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  private subscriptions: Subscription[] = [];

  constructor(
    private modelemsgalerteService: ModeleMsgAlerteService,
    private typeModeleService: TypemodeleService,
    private RDVService: RdvService,
    private typeModeleMessageService: TypemodelemessageService,
    private pageInfo: PageInfoService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    /*this.tinymce.init({
      skin_url: '/skins' // Or loaded from your environments config
    });*/
    this.id = this.route.snapshot.params['id'];
    this.formData = this.fb.group(
      {
        objet: [null, Validators.required],
        contenu: [null, Validators.required],
        typeModele: [null, Validators.required],
        defaut: [false],
        critere: [false],
      }
    );
    this.afficherTypeModele()
    if(this.id)
    {
      this.pageInfo.updateTitle("Modification de modele message alerte")
      const sb = this.modelemsgalerteService.getEntityById(this.id)
        .pipe(first())
        .subscribe((x) => {
          this.loadvalues(x)});
      this.subscriptions.push(sb);
    }
    else
      this.pageInfo.updateTitle("Ajout de modele message alerte")
  }
  loadvalues(entity:any){
    this.entity=entity;
    this.formData.patchValue({contenu:entity.contenu})
    this.formData.patchValue({objet:entity.objet})
    this.formData.patchValue({typeModele:entity.typeModele})
    this.formData.patchValue({defaut:entity.defaut})
  }
  ajouter()
  {
    tinymce.activeEditor.execCommand('mceInsertContent', false, "{"+this.formData.value.critere+"}");
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
  afficherTypeModele(){
    this.typeModeleService.afficherTous().subscribe(
      (data)=>{
        this.typeModele$=data.data;
      }
    )
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get f() { return this.formData.controls; }

  onSaveModele()
  {
    this.isLoading = true;
    if(this.formData.invalid) return;


    //return this.id
    if(this.id)
    {
      this.RDVService.afficherRDVSelonModeleMsgAlerte(this.id).subscribe(
        (data)=>{
          this.rdv=data;
//          console.log(this.rdv)
          if(this.rdv.length==0)
          {
            const modelemsgalerte: ModeleMsgAlerte = {
              ...this.formData.value,
              defaut:this.formData.value.defaut,
              id: this.id ? this.id : null
            };

             this.modelemsgalerteService.updateRow(modelemsgalerte).subscribe(
               {next: (resp) => {
                         this.isLoading = false;
                         this.router.navigate(['/crm/notifications/modelemsgalerte']);
                      }
               }
             )
          }
          else {
            const modelemsgalerte: ModeleMsgAlerte = {
              ...this.formData.value,
              defaut:true,
              id: this.id ? this.id : null
            };

            const modelemsgalerte_UP: any = {
              defaut:false,
              id: this.id ? this.id : null
            };
            this.modelemsgalerteService.modifier(
              this.formData.value.typeModele.idTypeModele,modelemsgalerte_UP).subscribe();

            this.modelemsgalerteService.createRow(modelemsgalerte).subscribe(
              {
                next: (resp) => {
                  this.isLoading = false;
                  this.router.navigate(['/crm/notifications/modelemsgalerte']);
                }
              }
            )
          }
          /*else
          {
            alert('Enregistrement effectué avec succès');
            // console.log("pass")
            // const successAlert: SweetAlertOptions = {
            //   icon: 'success',
            //   title: 'Success!',
            //   text: 'Enregistrement effectué avec succès',
            // };
            // this.showAlert(successAlert);

          }*/
        }
      )
    }
    else
    {
      const modelemsgalerte_UP: any = {
        defaut:false,
        id: this.id ? this.id : null
      };
      this.modelemsgalerteService.modifier(this.formData.value.typeModele.idTypeModele,modelemsgalerte_UP).subscribe();
      const modelemsgalerte: ModeleMsgAlerte = {
        ...this.formData.value,
        defaut:true,
        id: this.id ? this.id : null
      };
       this.modelemsgalerteService.createRow(modelemsgalerte).subscribe(
         {next: (resp) => {
             alert('Enregistrement effectué avec succès');
           }
         }
       );

    }

    //this.subscriptions.push(sb);
  }

  saveMonnaie() {

  }
}

