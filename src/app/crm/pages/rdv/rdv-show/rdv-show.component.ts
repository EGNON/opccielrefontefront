import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, switchMap, tap} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute} from "@angular/router";
import {PersonneMoraleService} from "../../../services/personne/personne.morale.service";
import {filter, map} from "rxjs/operators";
import {RdvService} from "../../../services/rdv.service";
import {AgentConcerneService} from "../../../services/agentconcerne.service";
import {FileUploadService} from "../../../services/file-upload.service";
import FileSaver, { saveAs } from 'file-saver';

@Component({
  selector: 'app-rdv-show',
  templateUrl: './rdv-show.component.html',
  styleUrl: './rdv-show.component.scss'
})
export class RdvShowComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  entity: any;
  rdv$:any;
  document$:any;
  file$:any;
  agentConcerne$:any;
  pdfResult:any;
  subscriptions: Subscription[] = [];

  constructor(
      private pageInfo: PageInfoService,
      private route: ActivatedRoute,
      private rdvService: RdvService,
      private documentService: FileUploadService,
      private agentConcerneService: AgentConcerneService,) {
  }
  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.pageInfo.updateTitle("Details rendez-vous")
    this.id = this.route.snapshot.params['id'];
    const sb = this.rdvService.getEntityById(this.id)
      .subscribe((entity)=>{
        this.rdv$=entity;
        this.agentConcerneService.afficherAgentConcerneSelonRRDV(this.rdv$.idRdv).subscribe(
            (data)=>{
              this.agentConcerne$=data;})

        this.documentService.afficherDocumentSelonRDV(this.rdv$.idRdv).subscribe(
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

