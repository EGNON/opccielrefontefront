import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ModalConfig, ModalComponent } from '../template/_metronic/partials';
import {StatisticsService} from "../core/services/statistics.service";
import {BehaviorSubject, Observable, Subscription, tap} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy{
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };

  @ViewChild('modal') private modalComponent!: ModalComponent;

  nbrPersonne$: Observable<any>;
  nbreRdvEnCours$: Observable<any>;
  rdvChartOptions: any = {};
  objChartOptions: any = {};


  private subscriptions: Subscription[] = [];

  constructor(private statistiqueInfo: StatisticsService) { }

  checkIfArrayContainKey(array: any, key: string) {
    let newArray = array;
    let trouve = false;
    for (const cle in array) {
      if(cle === key)
      {
        trouve = true;
        break;
      }
    }
    if(!trouve)
    {
      newArray = {...newArray, [key]: 0};
    }
    return newArray[key];
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.rdvChartOptions = {
      series: [
        {
          name: 'Mes RDVs',
          data: [],
        }
      ],
      chart: {
        type: 'line',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 3,
      },
      grid: {
        padding: {
          right: 30,
          left: 20,
        },
      },
      title: {
        text: 'RDVs en cours',
        align: 'left',
      },
      labels: [],
      xaxis: {
        type: 'category',
      },
    };
    this.objChartOptions = {
      series: [
        {
          name: 'Pourcentage',
          data: [],
        }
      ],
      chart: {
        type: 'line',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        width: 3,
      },
      grid: {
        padding: {
          right: 30,
          left: 20,
        },
      },
      title: {
        text: 'Niveau d\'atteinte global des objectifs',
        align: 'left',
      },
      labels: [],
      xaxis: {
        type: 'category',
      },
    };

    this.nbrPersonne$ = this.statistiqueInfo.nbrePersonneParQualite(null)
      .pipe(map((resp) => resp.data));
    //console.log("nbrepersonne==",this.nbrPersonne$);

    this.nbreRdvEnCours$ = this.statistiqueInfo.nbrRdvEnCours()
      .pipe(map((resp) => resp.data));

    const sb = this.statistiqueInfo.nbreRdvParMois((new Date()).getFullYear().toString())
      .pipe(
        map((resp) => {
          let months: any[] = [];
          let donnees: any[] = [];
          resp.data.forEach((value:any, index:any) => {
            months.push(value.nomMois);
            donnees.push(value.nbrRdv);
          });
          console.log("DONNEES === ", donnees);
          this.rdvChartOptions.series = [
            {
              name: 'Mes RDVs',
              data: donnees,
            }
          ];
          this.rdvChartOptions.labels = months;
          console.log("Months === ", months);
        }))
      .subscribe();
    this.subscriptions.push(sb);

    const sb1 = this.statistiqueInfo.niveauAtteinteObjectifParAgent((new Date()).getFullYear().toString())
      .pipe(
        map((resp) => {
          let agents: any[] = [];
          let percents: any[] = [];
          console.log("VAL === ", resp.data);
          for (const key in resp.data) {
            agents.push(key);
            percents.push(parseFloat(resp.data[key]).toFixed(2));
          }
          /*resp.data.forEach((value:any, index:any) => {
            console.log("VAL === ", value);
          });*/
          this.objChartOptions.series = [
            {
              name: 'Mes RDVs',
              data: percents,
            }
          ];
          this.objChartOptions.labels = agents;
          console.log("Months === ", agents);
        }))
      .subscribe();
    this.subscriptions.push(sb1);
  }
}
