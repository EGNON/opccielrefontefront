import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute} from "@angular/router";
import {FileUploadService} from "../../../services/file-upload.service";
import {AffectationService} from "../../../services/affectation.service";
import FileSaver from "file-saver";

@Component({
  selector: 'app-objectif-atteint-show',
  templateUrl: './objectif-atteint-show.component.html',
  styleUrl: './objectif-atteint-show.component.scss'
})
export class ObjectifAtteintShowComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  entity: any;
  affectation$:any;
  document$:any;
  objectifAffecte$:any;
  file$:any;
  personnePhysiquePays$:any;
  personnePhysiquePays:any;
  pdfResult:any;
  subscriptions: Subscription[] = [];

  constructor(
    private pageInfo: PageInfoService,
    private route: ActivatedRoute,
    private documentService:FileUploadService,
    private affectationService: AffectationService) {
  }
  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.pageInfo.updateTitle("Details affectation")
    this.id = this.route.snapshot.params['id'];
    const sb = this.affectationService.getEntityById(this.id)
      .subscribe((entity)=>{
        this.affectation$=entity;
        this.objectifAffecte$=this.affectation$.objectifAffectes;
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

