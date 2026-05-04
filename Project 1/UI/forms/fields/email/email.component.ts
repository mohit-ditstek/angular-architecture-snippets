import { AfterViewInit, Component, forwardRef, Input, Optional, QueryList, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { InputFieldType } from '@app/entities';
import { AppFacade } from '@app/store/app';
import { BaseFieldControl } from '../../base';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailComponent),
      multi: true,
    },
  ],
})
export class EmailComponent extends BaseFieldControl<string> implements AfterViewInit {
  override inputFieldType = InputFieldType.Email;
  @Input() label = '';
  @Input() override name: string;
  @Input() placeholder = '';
  @Input() required = false;
  @Input() submitted = false;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() tabindex = 0;
  @Input() maxlength: number;
  @Input() autoFocus = false;

  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  constructor(@Optional() public override ngForm: NgForm, override appFacade: AppFacade) {
    super(ngForm, appFacade);
  }

  ngAfterViewInit() {
    this.addControls();
    this.init();
  }
}
