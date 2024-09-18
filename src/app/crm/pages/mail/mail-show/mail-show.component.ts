import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {PageInfoService} from "../../../../template/_metronic/layout";
import {ActivatedRoute} from "@angular/router";
import {RdvService} from "../../../services/rdv.service";
import {AgentConcerneService} from "../../../services/agentconcerne.service";
import {MailService} from "../../../services/mail.service";
import {EnvoimailService} from "../../../services/envoimail.service";
import {DocumentmailService} from "../../../services/documentmail.service";
import FileSaver from "file-saver";
import {FileUploadService} from "../../../services/file-upload.service";

@Component({
  selector: 'app-mail-show',
  templateUrl: './mail-show.component.html',
  styleUrl: './mail-show.component.scss'
})
export class MailShowComponent implements OnInit, OnDestroy{
  qualite: string;
  id?: number;
  entity: any;
  mail$:any;
  envoiMail$:any;
  documentMail$:any;
  file$:any;

  subscriptions: Subscription[] = [];

  constructor(
      private pageInfo: PageInfoService,
      private route: ActivatedRoute,
      private mailService: MailService,
      private documentService: FileUploadService,
      private documentMailService: DocumentmailService,
      private envoiMailService: EnvoimailService,) {
  }
  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    // console.log("pass")
    this.pageInfo.updateTitle("Details mail")
    this.id = this.route.snapshot.params['id'];
    const sb = this.mailService.getEntityById(this.id)
        .subscribe((entity)=>{
          this.mail$=entity;
          this.envoiMailService.afficherEnvoiMailSelonMail(this.mail$.idMail).subscribe(
              (data)=>{
                this.envoiMail$=data;})
          this.documentMailService.afficherDocumentMailSelonMail(this.mail$.idMail).subscribe(
            (data)=>{
              this.documentMail$=data
            }
          )
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

