import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import {Observable, Subject, Subscription, tap} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ReportingsService} from "../../../../risque/services/reportings/reportings.service";
import {OpcvmService} from "../../../../opcciel1/services/opcvm.service";

@Component({
    selector: 'app-opcvm1',
    templateUrl: './opcvm1.component.html',
    styleUrl: './opcvm1.component.scss',
    standalone: false
})
export class Opcvm1Component implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild(DataTableDirective, {static: false})
  private datatableElement: DataTableDirective;
  isDtInit:boolean = false
  dataTable: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  reportList$: Observable<any>;
  selectOpcvm:any;
  idOpcvm:any;
  opcvm$: any;
  reportList: any[] = [];
  form: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(
    private cr: ChangeDetectorRef,
    private reportingsService: ReportingsService,
    private opcvmService: OpcvmService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.form = this.fb.group({
    //   denominationOpcvm: [null, Validators.required],
    //   anneeDebut: [null, Validators.required],
    //   anneeFin: [null,Validators.required]
    // });
    this.afficherOpcvm()
    this.dtOptions = {...this.reportingsService.dtOptions};
    // console.log("INIT=== ", this.form.value);
    // this.loadData();
  }
  valider(){
    // this.loadData()
  }
  public dtInit(): void {
    if (this.isDtInit) {
      this.datatableElement.dtInstance.then(dtInstance => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    } else this.isDtInit = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
    this.dtTrigger.unsubscribe();
  }

  onSubmit() {
    console.log("FORM === ", this.form);
    // this.loadData(true);
    /*this.dtOptions = this.reportingsService.dtOptions;
    this.dataTable.DataTable(this.dtOptions);*/
  }

  afficherOpcvm(submitted = false) {
    this.reportList$ = this.opcvmService.afficherOpcvm()
      .pipe(tap(() => this.dtTrigger.next(null)));
    const sb = this.reportList$.subscribe(res => {
      console.log("RESP=== ", res);
      this.reportList = res
      this.dtTrigger.next(null);

    });
    //this.subscriptions.push(sb);
  }
  // afficherOpcvm(){
  //   this.opcvmService.afficherOpcvm().subscribe(
  //     (data)=>{
  //       this.opcvm$=data;
  //     }
  //   )
  // }
  rebindDataTable() {
    this.datatableElement.dtInstance.then(x => x.draw());
  }

  rerender(): void {
    this.datatableElement.dtInstance.then(dtInstance => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next(null);
  }
}


