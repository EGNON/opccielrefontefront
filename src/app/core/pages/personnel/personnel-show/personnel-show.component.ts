import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../../../../crm/services/file-upload.service";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {filter, map} from "rxjs/operators";
import FileSaver from "file-saver";
import {PersonnelService} from "../../../../crm/services/personne/personnel.service";

@Component({
    selector: 'app-personnel-show',
    templateUrl: './personnel-show.component.html',
    styleUrl: './personnel-show.component.scss',
    standalone: false
})
export class PersonnelShowComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  entity: any;
  document$:any;
  file$:any;
  subscriptions: Subscription[] = [];

  constructor(
      private pageInfo: PageInfoService,
      private route: ActivatedRoute,
      private documentService: FileUploadService,
      private entityService: PersonnelService,) {
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    //Récupération de l'object correspondant à id
    const paramSubscription = this.route.paramMap
        .pipe(
            // filter(paramMap => paramMap.has('id')),
            map(paramMap => {
              let params: any = new Array(2);
              if(paramMap.has('id'))
                params[0] = +paramMap.get('id')!;
              if(paramMap.has('etat'))
                params[1] = +paramMap.get('etat')! == 1;
              else
                params[1] = false;

              return params;
            }),
            tap((params) => {
              this.id = params[0];
            }),
            filter(params => params[0]!),
            switchMap(params => this.entityService.getById(params[0]))
        ).subscribe(entity => {
          this.entity = entity.data;

          this.pageInfo.updateTitle("Détail de " + entity.data.denomination);
        });
    this.subscriptions.push(paramSubscription);
  }
  function(ext:any) {
    if (ext != undefined) {
      return this.extToMimes(ext);
    }
    return undefined;
  }
  extToMimes(ext:any) {
    let type = undefined;
    switch (ext) {
      case 'jpg':
      case 'png':
      case 'jpeg':
        type = 'image/jpeg'
        break;
      case 'txt':
        type = 'text/plain'
        break;
      case 'xls':
        type = 'application/vnd.ms-excel'
        break;
      case 'doc':
        type = 'application/msword'
        break;
      case 'xlsx':
        type = 'application/vnd.ms-excel'
        break;
      case 'pdf':
        type = 'application/pdf'
        break;
      default:

    }
    return type;
  }
  openFile(id:number,name:string,ext:string)
  {
    this.documentService.getFilesInByte(id).subscribe(
        (data)=>{
          this.file$=data
          // console.log(this.file$)
          let _type = this.function(ext.toLowerCase());
          const blob = new Blob([this.file$], { type: _type });
          // let file=new File([this.pdfResult],`sample.${ext}`)
          // let objBlob=window.URL.createObjectURL(file);
          FileSaver.saveAs(blob, name+'.'+ext);
        }
    )
  }
}
