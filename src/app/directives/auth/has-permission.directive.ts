import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit{

  @Input('hasPermission')
  permission: string = "";
  // permission: { [key: string]: boolean } = {};

  constructor(private elementRef: ElementRef<HTMLElement>) {
    console.log("Ref ", this.elementRef);
  }

  ngOnInit(): void {
    console.log("Permission ", this.permission);
  }
}
