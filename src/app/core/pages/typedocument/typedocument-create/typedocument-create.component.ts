import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TypeDocumentService} from "../../../../crm/services/type-document.service";

@Component({
  selector: 'app-typedocument-create',
  templateUrl: './typedocument-create.component.html',
  styleUrls: ['./typedocument-create.component.scss']
})
export class TypedocumentCreateComponent {
  formData!:FormGroup;
  buttonText:string;
  loading = false;
  submitting = false;
  submitted: boolean = false;
  successMsg: string = "Echec de l'opération !";
  errorMessage:string;
  idTypeDocument:number;
  constructor(private typedocumentService:TypeDocumentService,
              private route: ActivatedRoute,
              private formBuilder:FormBuilder,
              private router:Router) {
  }

}
