import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgForm, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ConfigItem, ConfigItemType } from '@app/entities';
import { UtilityService } from '@app/shared/services';
import { AppFacade } from '@app/store/app';
import { Subscription } from 'rxjs';
import { BaseFormControl } from '../../base';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-config-items-dropdown',
  templateUrl: './config-items-dropdown.component.html',
  styleUrls: ['./config-items-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConfigItemsDropdownComponent),
      multi: true,
    },
  ],
})
export class ConfigItemsDropdownComponent extends BaseFormControl<string | number> implements OnChanges, OnDestroy, AfterViewInit {
  subscription: Subscription = new Subscription();
  @Input() type: ConfigItemType;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() name = '';
  @Input() submitted = false;
  @Input() required = false;
  @Input() disableControl = false;
  @Input() bindName = false;
  @Input() tabindex = -1;
  @Input() showDropdownOption = false;
  @Input() includeAllOption = false;
  @Input() isNumericTypeValue = false;
  @Input() autoFocus = false;
  @Input() class: string;
  @Input() filteredItems: (string | number)[] = [];
  @Input() simpleSelect = false;

  @Output() selectedValue = new EventEmitter<string | number>();

  options: ConfigItem[] = [];
  @ViewChild('focusInput', { static: false }) matSelect: MatSelect;
  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  constructor(
    @Optional() public override ngForm: NgForm,
    private appFacade: AppFacade,
    private utilityService: UtilityService,
    private translateService: TranslateService
  ) {
    super(ngForm);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const { type } = simpleChanges;
    if (type?.currentValue != type?.previousValue) {
      this.init();
    }
  }

  init(): void {
    this.subscription = this.appFacade.configItems$.subscribe((res) => {
      if (res && res.length > 0) {
        const options = res
          .filter((t) => t.type === this.type && (this.filteredItems.length > 0 ? this.filteredItems.includes(t.value) : true))
          .sort((a, b) => a.displayOrder - b.displayOrder);
        // Converstion from string to number
        if (this.isNumericTypeValue) {
          this.options = options.map(function (d) {
            d = { ...d, value: +d.value };
            return d;
          });
        } else {
          this.options = options;
        }
        if (this.includeAllOption) {
          this.options.unshift({
            type: this.type,
            name: this.translateService.instant('common.all'),
            text: this.translateService.instant('common.all'),
            value: -1,
            displayOrder: 0,
          });
        }
      }
    });
  }

  ngAfterViewInit() {
    this.addControls();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectionChange(event: any) {
    this.selectedValue.emit(event.value);
    this.utilityService.raiseCustomFieldChangeEvent();
  }
}
