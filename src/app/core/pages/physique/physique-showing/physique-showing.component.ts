import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../../../../crm/services/file-upload.service";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import FileSaver from "file-saver";
import {Qualite} from "../../../../crm/models/qualite.model";

@Component({
    selector: 'app-physique-showing',
    templateUrl: './physique-showing.component.html',
    styleUrl: './physique-showing.component.scss',
    standalone: false
})
export class PhysiqueShowingComponent implements OnInit, OnDestroy{
  @Input() _qualite: Qualite;
  qualite: string;
  @Input() id?: number;
  entity: any;
  document$:any;
  file$:any;
  subscriptions: Subscription[] = [];

  @Output() showForm: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private pageInfo: PageInfoService,
    private route: ActivatedRoute,
    private documentService: FileUploadService,
    private entityService: PersonnePhysiqueService,) {
  }

  ngOnDestroy(): void {
    this.showForm.unsubscribe();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    //Récupération de l'object correspondant à id
    if(this.id)
    {
      this.entityService.getEntityById(this.id).subscribe((entity) => {
        this.entity = entity;
        console.log(this.entity.idPersonne);
        this.documentService.afficherDocumentSelonPersonne(this.entity.idPersonne).subscribe(
          (data)=>{
            this.document$=data;
          }
        )
        this.pageInfo.updateTitle("Détail de " + entity.denomination);
      });
    }
  }

  retourAlaListe() {
    this.showForm.emit(0);
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
