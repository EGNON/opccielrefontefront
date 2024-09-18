import {AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, switchMap, tap} from "rxjs";
import {Opcvm} from "../../../models/opcvm";
import {ActivatedRoute, Router} from "@angular/router";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {OpcvmService} from "../../../services/opcvm.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-opcvm-edit',
  templateUrl: './opcvm-edit.component.html',
  styleUrl: './opcvm-edit.component.scss'
})
export class OpcvmEditComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy{
  id: number = 0;
  formsCount = 3;
  opcvm$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private unsubscribe: Subscription[] = [];

  constructor(
    private router: Router,
    private pageInfo: PageInfoService,
    private entityService: OpcvmService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if(this.id)
    {
      this.pageInfo.updateTitle("Modifier un opcvm");
      //Récupération de l'object correspondant à id
      const sb = this.entityService.getById(+this.id!).pipe(
        map(resp => resp.data),
      ).subscribe({
        next: opcvm => {
          console.log("Opcvm === ", opcvm);
          this.opcvm$.next(opcvm);
        },
        error: err => {
          console.log("Erreur ", err);
        }
      });
      this.unsubscribe.push(sb);
    }
  }

  updateOpcvm = (part: Partial<Opcvm>, isFormValid: boolean) => {
    const currentOpcvm = this.opcvm$.value;
    const updatedOpcvm = { ...currentOpcvm, ...part };
    this.opcvm$.next(updatedOpcvm);
    this.isCurrentFormValid$.next(isFormValid);
  };

  nextStep($event: any) {
    const nextStep = this.currentStep$.value + 1;
    if (nextStep > this.formsCount) {
      const btn = $event.target;
      if (btn.innerText.toLowerCase().trim() === "soumettre")
      {
        const opcvmSub = this.opcvm$.pipe(
          map(formValue => {
            //Formatage des dates sous le format souhaité
            let dateAgrement: any;
            let dateCreationOpcvm: any;
            let dateDebExo: any;
            if(formValue.dateAgrement)
            {
              dateAgrement = new Date(
                formValue.dateAgrement.year,
                formValue.dateAgrement.month-1,
                formValue.dateAgrement.day+1);
            }
            if(formValue.dateCreationOpcvm) {
              dateCreationOpcvm = new Date(
                formValue.dateCreationOpcvm.year,
                formValue.dateCreationOpcvm.month-1,
                formValue.dateCreationOpcvm.day+1);
            }
            if(formValue.debutExerciceActuelOpcvm) {
              dateDebExo = new Date(
                formValue.debutExerciceActuelOpcvm.year,
                formValue.debutExerciceActuelOpcvm.month-1,
                formValue.debutExerciceActuelOpcvm.day+1);
            }

            return {
              ...formValue,
              id: this.id,
              dateAgrement: dateAgrement,
              dateCreationOpcvm: dateCreationOpcvm,
              debutExerciceActuelOpcvm: dateDebExo
            };
          }),
          switchMap(value => this.entityService.update(value))
        ).subscribe({
          next: resp => {
            console.log("Succès ", resp);
            this.router.navigate(['opcvm'], {relativeTo: this.route});
          },
          error: err => {
            console.log("Erreur ", err);
          }
        });
        this.unsubscribe.push(opcvmSub);
      }
      return;
    }
    this.currentStep$.next(nextStep);
  }

  prevStep() {
    const prevStep = this.currentStep$.value - 1;
    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  ngAfterViewInit(): void {
    setTimeout(function() {
      $("#notification").trigger('click');
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Change === ", changes);
  }
}
