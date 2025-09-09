/* eslint-disable @angular-eslint/component-class-suffix */
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subscription, Subject, map, of, concatMap, forkJoin, switchMap, catchError, finalize, fromEvent } from 'rxjs';
import { PlaceService } from '../../../../core/services/place.service';
import { LoaderService } from '../../../../loader.service';
import { CoursTitreService } from '../../../services/cours-titre.service';
import { IndiceBrvmService } from '../../../services/indice-brvm.service';
import { TitreService } from '../../../services/titre.service';
import { DateCoursComponent } from '../../modal/date-cours/date-cours.component';
import * as xls from 'xlsx';
import { Api } from 'datatables.net';
import { AuthService } from '../../../../core/modules/auth';
import { Place } from '../../../../core/models/place.model';

@Component({
  selector: 'app-titres-verif1',
  standalone: false,
  templateUrl: './titres-verif1.html',
  styleUrl: './titres-verif1.scss'
})
export class TitresVerif1 implements OnInit, AfterViewInit, OnDestroy{
  submitting = false;
  submitted = false;
  downloaded=false
  confirmer=false
  placeTab:Place;
  filterForm: FormGroup;
  [key: string]: any;

  coursTitres: [][];
  indicesBrvm: any[] = [];
  idTitre: any;
  dateCours: any;
  dateCoursMin: any;
  dateCoursMax: any;
  dateDebMax: any;
  dateFinMin: any;
  dateFinMax: any;

  isLoading: boolean = false;
  subscriptions: Subscription[] = [];

  //DataTable Config
  datatableConfigInit: any = {};
  datatableConfig: any = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, {static: false}) datatableElement: DataTableDirective;
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  changeTableEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private loadingService: LoaderService,
    private fb: FormBuilder,
    private indiceBrvmService: IndiceBrvmService,
    public titreService: TitreService,
    private authService: AuthService,
    private coursTitreService: CoursTitreService,
    private placeService: PlaceService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,) {
  }

  get f() {
    return this.filterForm.controls;
  }

  get cours(): FormArray {
    return <FormArray>this.filterForm.get('coursTitres');
  }

  ajouterFormControl(fieldName: string, fieldValue: any, validators: any[] = []) {
    this.filterForm.addControl(fieldName, this.fb.control(fieldValue, validators));
  }

  loadEmptyData() {
    this.isLoading = true;
    this.datatableConfig = {
      ...this.datatableConfigInit,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        callback({
          data: [],
          draw: 0,
          recordsFiltered: 0,
          recordsTotal: 0
        });
      },
      columns: [
        {
          title: 'SYMBOLE', data: 'symbolTitre', render: function (data:any, type:any, full:any) {
            return '';
          }
        },
        {
          title: 'DESIGNATION', data: 'designationTitre', render: function (data:any, type:any, full:any) {
            return '';
          }
        },
        {
          title: 'VOL. TRANS.', data: 'volTransiger', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'VAL. TRANS.', data: 'valTransiger', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'COURS PREC.', data: 'coursVeille', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'OUV.', data: 'ouverture', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'CLOT.', data: 'coursSeance', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'VAR(%)', data: 'variation', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'COURS REF.', data: 'coursReference', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'BAS', data: 'bas', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'HAUT', data: 'haut', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'RESTE OF.', data: 'resteOffre', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'RESTE DEM.', data: 'resteDemande', render: function (data:any, type:any, full:any) {
            return 0;
          }
        },
        {
          title: 'NB TRANS.', data: 'nbreTrans', render: function (data:any, type:any, full:any) {
            return 0;
          }
        }
      ],
    };
  }
  private loadData(dataTablesParameters: any, callback: any): void {
    let place = this.filterForm.value.place;
    const params = {
      datatableParameters: dataTablesParameters,
      dateDebut:this.dateCours,
      codePlace:place.codePlace,
      estVerifie1:false,
      estVerifie2:false
    };
    console.log(params)
    const sb = this.coursTitreService.afficherCoursTitreNew(params).pipe(
      map(resp => resp.data),
    ).subscribe(data => {
      callback(data);
      console.log(data)
      //self.loadingService.setLoading(false);
    });
    this.subscriptions.push(sb);
  }
  onFilterChange(): void {
    this.refreshTable();
  }
  chargerCoursTitre() {
    //this.loadingService.setLoading(true);
    this.cours.clear();
    
    const columns: any[] = [
      {
        title: 'SYMBOLE', data: 'symbolTitre', render: function (data:any, type:any, full:any) {
          return data || '';
        }
      },
      {
        title: 'DESIGNATION', data: 'designationTitre', render: function (data:any, type:any, full:any) {
          return full.designationTitre || '';
        }
      },
      {
        title: 'VOL. TRANS.', data: 'volTransiger', render: function (data:any, type:any, full:any) {
          // return full.volTransiger || 0;
          return `<input name="volTransiger" class="form-control form-control-sm" value="${full.volTransiger || 0}"/>`;
        }
      },
      {
        title: 'VAL. TRANS.', data: 'valTransiger', render: function (data:any, type:any, full:any) {
          // return full.valTransiger || 0;
          return `<input name="valTransiger" class="form-control form-control-sm" value="${full.valTransiger || 0}"/>`;
        }
      },
      {
        title: 'COURS PREC.', data: 'coursVeille', render: function (data:any, type:any, full:any) {
          // return full.coursVeille || 0;
          return `<input name="coursVeille" class="form-control form-control-sm" value="${full.coursVeille || 0}"/>`;
        }
      },
      {
        title: 'OUV.', data: 'ouverture', render: function (data:any, type:any, full:any) {
          // return full.ouverture || 0;
          return `<input name="ouverture" class="form-control form-control-sm" value="${full.ouverture || 0}"/>`;
        }
      },
      {
        title: 'CLOT.', data: 'coursSeance', render: function (data:any, type:any, full:any) {
          // return full.coursSeance || 0;
          return `<input name="coursSeance" class="form-control form-control-sm" value="${full.coursSeance || 0}"/>`;
        }
      },
      {
        title: 'VAR(%)', data: 'variation', render: function (data:any, type:any, full:any) {
          // return full.variation || 0;
          return `<input name="variation" class="form-control form-control-sm" value="${full.variation || 0}"/>`;
        }
      },
      {
        title: 'COURS REF.', data: 'coursReference', render: function (data:any, type:any, full:any) {
          // return full.coursReference || 0;
          return `<input name="coursReference" class="form-control form-control-sm" value="${full.coursReference || 0}"/>`;
        }
      },
      {
        title: 'BAS', data: 'bas', render: function (data:any, type:any, full:any) {
          // return full.bas || 0;
          return `<input name="bas" class="form-control form-control-sm" value="${full.bas || 0}"/>`;
        }
      },
      {
        title: 'HAUT', data: 'haut', render: function (data:any, type:any, full:any) {
          // return full.haut || 0;
          return `<input name="haut" class="form-control form-control-sm" value="${full.haut || 0}"/>`;
        }
      },
      {
        title: 'RESTE OF.', data: 'resteOffre', render: function (data:any, type:any, full:any) {
          // return full.resteOffre || 0;
          return `<input name="resteOffre" class="form-control form-control-sm" value="${full.resteOffre || 0}"/>`;
        }
      },
      {
        title: 'RESTE DEM.', data: 'resteDemande', render: function (data:any, type:any, full:any) {
          // return full.resteDemande || 0;
          return `<input name="resteDemande" class="form-control form-control-sm" value="${full.resteDemande || 0}"/>`;
        }
      },
      {
        title: 'NB TRANS.', data: 'nbreTrans', render: function (data:any, type:any, full:any) {
          // return full.nbreTrans || 0;
          return `<input name="nbreTrans" class="form-control form-control-sm" value="${full.nbreTrans || 0}"/>`;
        }
      }
    ];
    //this.loadEmptyData();
    let place = this.filterForm.value.place;
    
    console.log(place)
    if(place !== null && this.dateCours !== null) {
      this.isLoading = true;
      const self = this;
      this.datatableConfig = {
        ...this.datatableConfigInit,
        serverSide: true,
        processing: true,
        destroy: false,
        ajax: (dataTablesParameters: any, callback: any) => {
          place = this.filterForm.value.place;
          const params = {
            datatableParameters: dataTablesParameters,
            dateDebut:this.dateCours,
            codePlace:place.codePlace,
            estVerifie1:false,
            estVerifie2:false
            /* beginEndDateParameter: {
              startDate: this.dateCours,
              endDate: null
            } */
          };
          console.log(params)
          this.confirmer=false
          const sb = this.coursTitreService.afficherCoursTitreNew(params).pipe(
            map(resp => resp.data),
          ).subscribe(data => {
            callback(data);
            console.log(data)
            if(data.data.length!==0)
              this.confirmer=true
            self.loadingService.setLoading(false);
          });
          this.subscriptions.push(sb);
        },
        columns: columns,
        createdRow: function (row, data, dataIndex) {
          /* const coursTitreForm = self.createCoursTitreForm();
          coursTitreForm.patchValue({
            idCoursTitre: {
              idTitre: data.idTitre,
              dateCours: self.filterForm.get('date').value
            },
            titre: {
              idTitre: data.idTitre,
              place: place
            },
            volTransiger: data.volTransiger,
            valTransiger: data.valTransiger,
            coursVeille: data.coursVeille,
            ouverture: data.ouverture,
            haut: data.haut,
            bas: data.bas,
            coursSeance: data.coursSeance,
            variation: data.variation,
            nbreTrans: data.nbreTrans,
            resteOffre: data.resteOffre,
            resteDemande: data.resteDemande,
            coursReference: data.coursReference,
            estValider: data.estValider,
          });
          self.cours.push(coursTitreForm); */
        },
      };
      //this.rerender();
      this.changeTableEvent.emit(true);
      this.refreshTable();
    }
  }
  verificationCours(){
    this.downloaded = true;
    let place = this.filterForm.value.place;
    const params = {
            dateDebut:this.dateCours,
            codePlace:place.codePlace,
            estVerifie1:false,
            estVerifie2:false,
            niveau:1,
            userLogin:this.authService.currentUserValue?.username
          };
          console.log(params)
          const sb = this.coursTitreService.verificationCours(params).pipe(
        catchError((err) => {
          this.downloaded = false;
          return of(err.message);
        }),
        finalize(() => {
          //this.downloading = false;
          this.downloaded = false;
        })
      ).subscribe(data => {
            
          });
  }
  validerVerificationCours(){
    this.submitting = true;
    let place = this.filterForm.value.place;
    const params = {
            dateDebut:this.dateCours,
            codePlace:place.codePlace,
            estVerifie1:false,
            estVerifie2:false,
            niveau:1,
            userLogin:this.authService.currentUserValue?.username
          };
          console.log(params)
          const sb = this.coursTitreService.validationCours(params).pipe(
        catchError((err) => {
          this.submitting = false;
          return of(err.message);
        }),
        finalize(() => {
          //this.downloading = false;
          this.submitting = false;
          alert("Confirmation de la vérification de la mise à jour des cours niveau 1 effectuée avec succès")
          this.chargerCoursTitre();
        })
      ).subscribe(data => {
            
          });
  }
  rerender(): void {
    try {
      this.datatableElement.dtInstance.then((dtInstance: Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } catch (err) {
      // console.log(err);
    }
  }
  refreshTable() {
    this.datatableElement.dtInstance.then((dtInstance: Api) => {
    dtInstance.ajax.reload(null, false);
  });
  }

  callDateModal(param) {
    const modalRef = this.modalService.open(DateCoursComponent, {
      backdrop: "static",
      size: "xs"
    });
    let dateDebut = this.filterForm.get('dateDebut').value;
    dateDebut = new Date(dateDebut.year, dateDebut.month - 1, dateDebut.day+1);
    let dateFin = this.filterForm.get('dateFin').value;
    dateFin = new Date(dateFin.year, dateFin.month - 1, dateFin.day+1);
    modalRef.componentInstance.place = this.filterForm.get('place').value;
    modalRef.componentInstance.dateDebut = dateDebut.toISOString();
    modalRef.componentInstance.dateFin = dateFin.toISOString();
    modalRef.componentInstance.passEntry.subscribe((receivedEntry:any) => {
      const dateCours = new Date(receivedEntry.dateCours);
      this.filterForm.patchValue({
        date: new NgbDate(dateCours.getFullYear(), dateCours.getMonth() + 1, dateCours.getDate()),
      });
    });
  }

  getPlaceAll = () => {
    this.placeService.afficherTous().subscribe(
      (resp) => {
        console.log("Resp === ", resp);
        this["places"] = resp.data;
      });
  }

  createCoursTitreForm() {
    return this.fb.group({
      // id: new FormControl(null),
      idCoursTitre: this.fb.group({
        idTitre: new FormControl(+this.id!),
        dateCours: new FormControl(null),
      }),
      titre: new FormControl(null),
      coursVeille: new FormControl(0),
      ouverture: new FormControl(0),
      haut: new FormControl(0),
      bas: new FormControl(0),
      coursSeance: new FormControl(0),
      variation: new FormControl(0),
      nbreTrans: new FormControl(0),
      volTransiger: new FormControl(0),
      valTransiger: new FormControl(0),
      resteOffre: new FormControl(0),
      resteDemande: new FormControl(0),
      coursReference: new FormControl(0),
      estValider: new FormControl(false),
    });
  }

  importCours(file: HTMLElement, event: any) {
    file.click();
  }

  onImagePicked($event: Event) {
    const self = this;
    self.loadingService.setLoading(true);
    const files = ($event.target as HTMLInputElement).files;
    if (files && files[0]) {
      this.cours.clear();
      const file = (event.target as HTMLInputElement).files[0];
      this.filterForm.patchValue({ fichier: file});
      this.changeTableEvent.emit(true);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        this.isLoading = true;
        this.refreshTable();
        let data = reader.result;
        let workbook = xls.read(data, {type:'binary', cellDates: true});
        const sheetname = workbook.SheetNames[0];
        const sheet1 = workbook.Sheets[sheetname];
        self.coursTitres = xls.utils.sheet_to_json(sheet1, {header:1});
        const arrDates: any[] = this.coursTitres[3];
        const newDateCours: Date = arrDates[1];
        const dateCours = new NgbDate(newDateCours.getFullYear(), newDateCours.getMonth()+1, newDateCours.getDate());
        this.filterForm.patchValue({dateDebut: dateCours});
        this.filterForm.patchValue({dateFin: dateCours});
        this.filterForm.patchValue({date: dateCours});
        let indices = this.coursTitres.filter((value, index) => index >= 6 && index <= 16);
        if(indices.length > 0) {
          this.indicesBrvm = indices.map((i: any[], index) => {
            return {
              idIndice: {
                dateIndice: newDateCours,
                libelleIndice: i[0]
              },
              valeur: i[1],
              variationNet: i[2],
              percentVariation: i[3],
              estParDefaut: false
            }
          });
        }
        self.coursTitres = this.coursTitres.filter((value, index) => index >= 19);
        const arraySource = of(true).pipe(
          concatMap(() => {
            return forkJoin(self.loadExcelData(arrDates[1]));
          })
        );
        this.datatableConfig = {
          ...this.datatableConfigInit,
          paging: false,
          processing: true,
          ajax: (dataTablesParameters: any, callback: any) => {
            arraySource
              .pipe(
                map(cours => cours.filter(c => +c.idCoursTitre.idTitre! > 0)),
              )
              .subscribe((cours) => {
                callback({
                  data: cours,
                  draw: dataTablesParameters.draw,
                  recordsFiltered: cours.length,
                  recordsTotal: cours.length
                });
                self.loadingService.setLoading(false);
              });
          },
          columns: [
            /*{
              title: 'ID', data: 'idTitre', render: function (data:any, type:any, full:any) {
                return full.titre.designationTitre || '';
              }
            },*/
            {
              title: 'SYMBOLE', data: 'symbolTitre', render: function (data:any, type:any, full:any) {
                return full.titre.symbolTitre || '';
              }
            },
            {
              title: 'DESIGNATION', data: 'designationTitre', render: function (data:any, type:any, full:any) {
                return full.titre.designationTitre || '';
              }
            },
            {
              title: 'VOL. TRANS.', data: 'volTransiger', render: function (data:any, type:any, full:any) {
                // return full.volTransiger || 0;
                return `<input name="volTransiger" class="form-control form-control-sm" value="${full.volTransiger || 0}"/>`;
              }
            },
            {
              title: 'VAL. TRANS.', data: 'valTransiger', render: function (data:any, type:any, full:any) {
                // return full.valTransiger || 0;
                return `<input name="valTransiger" class="form-control form-control-sm" value="${full.valTransiger || 0}"/>`;
              }
            },
            {
              title: 'COURS PREC.', data: 'coursVeille', render: function (data:any, type:any, full:any) {
                // return full.coursVeille || 0;
                return `<input name="coursVeille" class="form-control form-control-sm" value="0"/>`;
              }
            },
            {
              title: 'OUV.', data: 'ouverture', render: function (data:any, type:any, full:any) {
                // return full.ouverture || 0;
                return `<input name="ouverture" class="form-control form-control-sm" value="${full.ouverture || 0}"/>`;
              }
            },
            {
              title: 'CLOT.', data: 'coursSeance', render: function (data:any, type:any, full:any) {

                return `<input name="coursSeance" class="form-control form-control-sm" value="${full.coursSeance || 0}"/>`;
              }
            },
            {
              title: 'VAR(%)', data: 'variation', render: function (data:any, type:any, full:any) {
                // return full.variation || 0;
                return `<input name="variation" class="form-control form-control-sm" value="${full.variation || 0}"/>`;
              }
            },
            {
              title: 'COURS REF.', data: 'coursReference', render: function (data:any, type:any, full:any) {
                // return full.coursReference || 0;
                return `<input name="coursReference" class="form-control form-control-sm" value="0"/>`;
              }
            },
            {
              title: 'BAS', data: 'bas', render: function (data:any, type:any, full:any) {
                // return full.bas || 0;
                return `<input name="bas" class="form-control form-control-sm" value="${full.bas || 0}"/>`;
              }
            },
            {
              title: 'HAUT', data: 'haut', render: function (data:any, type:any, full:any) {
                // return full.haut || 0;
                return `<input name="haut" class="form-control form-control-sm" value="${full.haut || 0}"/>`;
              }
            },
            {
              title: 'RESTE OF.', data: 'resteOffre', render: function (data:any, type:any, full:any) {
                // return full.resteOffre || 0;
                return `<input name="resteOffre" class="form-control form-control-sm" value="0"/>`;
              }
            },
            {
              title: 'RESTE DEM.', data: 'resteDemande', render: function (data:any, type:any, full:any) {
                // return full.resteDemande || 0;
                return `<input name="resteDemande" class="form-control form-control-sm" value="0"/>`;
              }
            },
            {
              title: 'NB TRANS.', data: 'nbreTrans', render: function (data:any, type:any, full:any) {
                // return full.nbreTrans || 0;
                return `<input name="nbreTrans" class="form-control form-control-sm" value="${full.nbreTrans || 0}"/>`;
              }
            }
          ],
          createdRow: function (row, data, dataIndex, cells) {
            const coursTitreForm = self.createCoursTitreForm();
            const coursClone: any = data;
            coursTitreForm.patchValue(coursClone);
            self.cours.push(coursTitreForm);
            $('td', row).find('input').on('change', (e) => {
              self.filterForm.patchValue({[e.target.name]: +e.target.value!});
            });
          },
        };
      };
      // this.save();
      this.refreshTable();
      console.log("Form Init === ", this.filterForm);
    }
    else {
      console.log("Aucun fichier sélectionné");
    }
  }

  loadExcelData = (dateCours: Date) => {
    return this.coursTitres.map((i) =>
      of(i).pipe(
        // delay(500),
        switchMap((j: any[]) => {
          return this.titreService.findBySymbole(j[0]).pipe(
            // filter(res => res.data != null),
            map(value => ({
              idCoursTitre: {
                idTitre: value.data ? +value.data.idTitre! : 0,
                dateCours: dateCours
              },
              titre: value.data ? value.data : {
                idTitre: 0,
                designationTitre: j[2]
              },
              volTransiger: j[18],
              valTransiger: j[19],
              coursVeille: 0,
              ouverture: j[10],
              haut: j[13],
              bas: j[14],
              coursSeance: j[11], //A déterminer
              variation: j[12],
              nbreTrans: j[17],
              resteOffre: 0,
              resteDemande: 0,
              coursReference: 0,
              estValider: false,
            }))
          );
        }),
        switchMap((j: any) => {
          const titre = j.titre;
          const idTitre = +titre.idTitre!;
          const nominal = +titre.nominal!;
          if(idTitre > 0) {
            return this.coursTitreService.getLastCoursTitre(idTitre).pipe(
              map(resp => {
                let coursSeance = +resp.data!;
                const codeType = titre.typeTitre != null ? titre.typeTitre.codeTypeTitre.trim() : "";
                if(codeType) {
                  if(codeType.toLowerCase() === "action")
                  {
                    if(j.coursSeance) coursSeance = j.coursSeance;
                  }
                  else {
                    if(j.coursSeance) coursSeance = (nominal * +j.coursSeance!)/100;
                  }
                }
                return {
                  ...j,
                  coursSeance: coursSeance
                };
              })
            );
          }
          else {
            // console.log("Aucun résultat...");
            return of(j);
          }
        }),
        // tap(x => console.log("X === ", x)),
      )
    );
  }

  save() {
    this.submitting = true;
    this.submitted = true;
    this.loadingService.setLoading(true);

    if (this.filterForm.invalid) {
      this.submitting = false;
      this.loadingService.setLoading(false);
      return;
    }

    //Enregistrement des indices brvm
    if(this.indicesBrvm.length > 0) {
      const sb = this.indiceBrvmService.saveAll(this.indicesBrvm)
        .subscribe(indice => {
          console.log(indice.message);
        });
      this.subscriptions.push(sb);
    }

    //Enregistrement des cours
    const place = this.filterForm.value.place;
    this.coursTitreService.saveAll(this.filterForm.value.coursTitres, place ? place.codePlace : "")
    .pipe(
      catchError((err) => {
        this.submitting = false;
        this.loadingService.setLoading(false);
        return of(err.message);
      }),
      finalize(() => {
        this.submitting = false;
        this.submitted = false;
        this.loadingService.setLoading(false);
      })
    )
    .subscribe(value => {
      console.log("Submit form === ", value);
    });
  }

  renderForm(): boolean {
    // console.log(this.cours);
    return this.cours.controls.length <= 1;
  }

  triggerFilter() {
    fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        //debounceTime(50),
        map(event => {
          const target = event.target as HTMLElement;
          const action = target.getAttribute('data-action');
          const value = (target as HTMLInputElement).value?.trim().toLowerCase();

          return {action, value};
        })
      )
      .subscribe(({action, value}) => {
        if (action === 'filter') {
          this.datatableElement.dtInstance.then(dtInstance => dtInstance.search(value).draw());
        }
      });
  }

  ngAfterViewInit(): void {
     //this.dtTrigger.next(null);/
    this.triggerFilter();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    //Initialisation de la date début à la date du jour
    const dateDebut = new Date();
    const dateDebutControl = new NgbDate(dateDebut.getFullYear(), dateDebut.getMonth() + 1, dateDebut.getDate());
    //Initialisation de la date fin à la date du jour
    const dateFin = new Date();
    const dateFinControl = new NgbDate(dateFin.getFullYear(), dateFin.getMonth() + 1, dateFin.getDate());
    //this.dateCoursMin = dateDebutControl;
    this.dateCoursMax = dateFinControl;
    this.dateDebMax = dateDebutControl;
    //this.dateFinMin = dateDebutControl;
    this.dateFinMax = dateFinControl;

    this.filterForm = this.fb.group({
      date: new FormControl(null),
      dateDebut: new FormControl(dateDebutControl),
      dateFin: new FormControl(dateFinControl),
      place: new FormControl(null),
      fichier: new FormControl(null),
      coursTitres: this.fb.array([this.createCoursTitreForm()]),
    });
    this.cours.clear();
    //Charger les données de sélection
    this.getPlaceAll();

    //Initialize datatable option
    this.datatableConfigInit = {
      dom: "<'row'<'col-sm-12'tr>>",
      pagingType: 'simple_numbers',
      buttons: [
        {
          extend:    'copy',
          text:      '<i class="fa fa-files-o"></i> Copier',
          titleAttr: 'Copy',
          className: 'btn btn-default btn-sm'
        },
        {
          extend:    'csv',
          text:      '<i class="fa fa-files-o"></i> Exporter en CSV',
          titleAttr: 'CSV',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'excel',
          text:      '<i class="fa fa-files-o"></i> Exportez en Excel',
          titleAttr: 'Excel',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'pdf',
          text:      '<i class="fa fa-file-pdf"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-default btn-sm',
          exportOptions: {
            columns: ':visible'
          }
        },
        {
          extend:    'print',
          text:      '<i class="fa fa-print"></i> Imprimer',
          titleAttr: 'Print',
          className: 'btn btn-default btn-sm',
          /*autoPrint: false,*/
          exportOptions: {
            columns: ':visible',
            "modifier": {
              "page": 'all'
            }
          }
        },
      ],
      language: {
        processing: '<span class="spinner-border spinner-border-sm align-middle"></span> Chargement...',
        search: "Rechercher&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donnée disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": activer pour trier la colonne par ordre croissant",
          sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
      },
    };
    /* this.dateCours=new Date();
    this.chargerCoursTitre(); */
    //Events
    this.filterForm.get('dateDebut').valueChanges.subscribe(value => {
      this.dateCoursMin = value;
      this.dateFinMin = value;
      // this.loadEmptyData();
    });
    this.filterForm.get('dateFin').valueChanges.subscribe(value => {
      this.dateCoursMax = value;
      // this.loadEmptyData();
    });
    this.filterForm.get('date').valueChanges.subscribe(value => {
      if (value != null) {
        this.dateCours = new Date(value.year, value.month - 1, value.day+1);
        // this.loadEmptyData();
      }
    });
  }
}