import { AfterViewInit, Component, ElementRef, forwardRef, Input, Optional, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormControl } from '../../base';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebsiteComponent),
      multi: true,
    },
  ],
})
export class WebsiteComponent extends BaseFormControl<string> implements AfterViewInit {
  @Input() name?: string;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() showNote: string;
  @Input() maxlength: number;

  @Input() readonly = false;
  @Input() disableControl = false;
  @Input() required = false;
  @Input() submitted = false;

  pattern = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([?#].*)?$/;

  @ViewChild('input') input: ElementRef;

  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  constructor(private renderer: Renderer2, @Optional() public override ngForm: NgForm) {
    super(ngForm);
  }

  ngAfterViewInit() {
    this.addControls();

    setTimeout(() => {
      this.bindDefaultValue();
    }, 0);
  }

  public bindDefaultValue() {
    if (!this.value) {
      setTimeout(() => {
        this.renderer.setProperty(this.input.nativeElement, 'value', 'https://');
        this.renderer.setAttribute(this.input.nativeElement, 'value', 'https://');
      }, 0);
    }
  }
}
