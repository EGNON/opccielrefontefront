import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute} from "@angular/router";
import {RdvService} from "../../../services/rdv.service";
import {FileUploadService} from "../../../services/file-upload.service";
import {AgentConcerneService} from "../../../services/agentconcerne.service";
import FileSaver from "file-saver";
import {CompterenduService} from "../../../services/compterendu.service";

@Component({
    selector: 'app-compterendu-show',
    templateUrl: './compterendu-show.component.html',
    styleUrls: ['./compterendu-show.component.scss'],
    standalone: false
})
export class CompterenduShowComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  entity: any;
  compteRendu$:any;
  document$:any;
  file$:any;
  agentConcerne$:any;
  pdfResult:any;
  subscriptions: Subscription[] = [];

  constructor(
    private pageInfo: PageInfoService,
    private route: ActivatedRoute,
    private compteRenduService: CompterenduService,
    private documentService: FileUploadService,
    private agentConcerneService: AgentConcerneService,) {
  }
  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.pageInfo.updateTitle("Details compte rendu")
    this.id = this.route.snapshot.params['id'];
    const sb = this.compteRenduService.getEntityById(this.id)
      .subscribe((entity)=>{
        this.compteRendu$=entity;
        console.log(this.compteRendu$)
        this.documentService.afficherDocumentSelonCR(this.compteRendu$.idCR).subscribe(
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

