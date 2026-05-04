import { AfterViewInit, Component, forwardRef, Input, Optional, QueryList, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { InputFieldType } from '@app/entities';
import { AppFacade } from '@app/store/app';
import { BaseFieldControl } from '../../../forms/base';

@Component({
  selector: 'app-address-control',
  templateUrl: './address-control.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressControlComponent),
      multi: true,
    },
  ],
})
export class AddressControlComponent  extends BaseFieldControl<string> implements AfterViewInit {
  override inputFieldType = InputFieldType.StreetAddress;

  @Input() override name: string;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() showNote?: string;
  @Input() maxlength?: number;
  @Input() showIcon = false;
  @Input() icon: string;
  @Input() requiredMessage?: string;
  @Input() patternMessageKey: string;

  @Input() readonly = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() submitted = false;
  @Input() tabindex: number;
  @Input() autoFocus = false;
 
  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;


  constructor(@Optional() public override ngForm: NgForm, public override appFacade: AppFacade) {
    super(ngForm, appFacade);
  }

  ngAfterViewInit() {
    this.addControls();
    this.init();
  }
}
