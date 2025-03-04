import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import {ResourceService} from "../../crm/services/core/resource.service";
import {HttpClient} from "@angular/common/http";
import {Opcvm} from "../../core/models/opcvm";
import {environment} from "../../../environments/environment";
import {
  DetailsEcritureComponent
} from "../pages/comptabilite/consultation-ecritures/details-ecriture/details-ecriture.component";

@Injectable({
  providedIn: 'root'
})
export class OperationService extends ResourceService<any> implements OnDestroy{
  constructor(
    private http: HttpClient,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,) {
    super(http,Opcvm,`${environment.apiUrl}/comptabilite/operations`);
    this.API_URL = `${environment.apiUrl}/comptabilite/operations`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  afficherListeOperations(parameters: any) {
    return this.http.post<any>(`${this.API_URL}`, parameters);
  }

  afficherDetailsEcriture(idOperation: number) {
    return this.http.post<any>(`${this.API_URL}/details-ecriture/${idOperation}`, null);
  }

  /*afficherComposantDetails(viewContainerRef: ViewContainerRef, idOperation: number) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DetailsEcritureComponent);
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as DetailsEcritureComponent).idOperation = idOperation;
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  afficherComposantDetails1(viewContainerRef: ViewContainerRef, data: any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DetailsEcritureComponent);
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as DetailsEcritureComponent).data = data;
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }*/

  appendDialogComponentToBody(data: any, idOperation: any){
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DetailsEcritureComponent);
    const componentRef = componentFactory.create(this.injector);
    (componentRef.instance as DetailsEcritureComponent).idOperation = idOperation;
    (componentRef.instance as DetailsEcritureComponent).details = data;
    componentRef.changeDetectorRef.detectChanges();
    this.appRef.attachView(componentRef.hostView);
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }
}
