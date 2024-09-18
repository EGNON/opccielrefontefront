import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppValidators} from "../../../../validators/app-validators";
import {PageInfoService} from "../../../../template/_metronic/layout";
// import $ from 'jquery';
import "select2";
import {PaysService} from "../../../services/pays.service";
import {PersonneService} from "../../../services/personne/personne.service";
declare let $: any;

@Component({
  selector: 'app-rdv-add-edit',
  templateUrl: './rdv-add-edit.component.html',
  styleUrl: './rdv-add-edit.component.scss'
})
export class RdvAddEditComponent implements OnInit, OnDestroy{
  id: number;
  form: FormGroup;
  pays$: any;
  personnes$: any;

  //Relatif à la soumission du formulaire
  isLoading = false;
  submitting = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private pageInfo: PageInfoService,
    private paysService: PaysService,
    private personneService: PersonneService) {
  }

  getPaysAll = () => {
    this.paysService.afficherPaysListe().subscribe(
      (data) => {
        this.pays$ = data;
      }
    );
  }

  getPersonnesAll(qualite: any = null)
  {
    this.personnes$ = this.personneService.afficherPersonneSelonQualite("prospect");
  }

  get f() {
    return this.form.controls;
  }

  onSaveForm() {
      // console.log("MY FORM === ", this.form);
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.pageInfo.updateTitle("Planifier un RDV");
    this.form = this.fb.group(
      {
        id: [this.id],
        idRdv: [this.id],
        dateDebRdv: [null, Validators.required],
        dateFinRdv: [null, Validators.required],
        heureFinRdv: [[
          (new Date().getHours()),
          (new Date().getMinutes()),
          new Date().getSeconds(),
        ].join(':'), Validators.required],
        objetRdv: [null, [Validators.required, AppValidators.notOnlyWhitespace]],
        msg: [null],
        paysDto: [null, Validators.required],
        villeDto: [null, Validators.required],
        quartierDto: [null, Validators.required],
        personne: [null, Validators.required],
        documents: this.fb.array([])
      }
    );
    this.getPaysAll();
    this.getPersonnesAll();
  }
}
