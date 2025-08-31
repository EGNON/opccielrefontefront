import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute} from "@angular/router";
import {RdvService} from "../../../../crm/services/rdv.service";
import {FileUploadService} from "../../../../crm/services/file-upload.service";
import {AgentConcerneService} from "../../../../crm/services/agentconcerne.service";
import FileSaver from "file-saver";
import {PersonneService} from "../../../../crm/services/personne/personne.service";
import {PersonnePhysiqueService} from "../../../../crm/services/personne/personne.physique.service";
import {PersonnephysiquepaysService} from "../../../../crm/services/personnephysiquepays.service";

@Component({
    selector: 'lab-personne-physique-show',
    templateUrl: './personne-physique-show.component.html',
    styleUrl: './personne-physique-show.component.scss',
    standalone: false
})
export class PersonnePhysiqueShowComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  entity: any;
  personnePhysique$:any;
  document$:any;
  file$:any;
  personnePhysiquePays$:any;
  personnePhysiquePays:any;
  pdfResult:any;
  subscriptions: Subscription[] = [];

  constructor(
    private pageInfo: PageInfoService,
    private route: ActivatedRoute,
    private personnePhysiqueService: PersonnePhysiqueService,
    private documentService: FileUploadService,
    private personnePhysiquePaysService: PersonnephysiquepaysService,) {
  }
  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.pageInfo.updateTitle("Details personne physique politiquement exposé")
    this.id = this.route.snapshot.params['id'];
    const sb = this.personnePhysiqueService.getEntityById(this.id)
      .subscribe((entity)=>{
        this.personnePhysique$=entity;

        this.personnePhysiquePaysService.afficherSolonPersonnePhysique(this.personnePhysique$.idPersonne).subscribe(
          (data)=>{
            this.personnePhysiquePays$=data;
          }
        )
        this.documentService.afficherDocumentSelonPersonne(this.personnePhysique$.idPersonne).subscribe(
          (data)=>{
            this.document$=data;})
      });
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


