import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { InputFieldType, UsersSearch } from '@app/entities';
import { UtilityService } from '@app/shared/services';
import { AppFacade } from '@app/store/app';
import { UserFacade } from '@app/store/user';
import { debounceTime, filter, fromEvent, map, switchMap, tap } from 'rxjs';
import { BaseUserFieldAutoComplete } from '../../base';

@Component({
  selector: 'app-auto-complete-text',
  templateUrl: './auto-complete-text.component.html',
  styleUrls: ['./auto-complete-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteTextComponent),
      multi: true,
    },
  ],
})
export class AutoCompleteTextComponent extends BaseUserFieldAutoComplete<string> implements AfterViewInit, OnDestroy {
  override inputFieldType = InputFieldType.IndividualNames;

  @Input() type = 'text';
  @Input() name?: string;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() submitted = false;
  @Input() showNote?: string;
  @Input() disabled = false;
  @Input() maxlength?: number;
  @Input() requiredMessage?: string;
  @Input() patternMessageKey: string;
  @Input() tabindex: number;
  @Input() autoFocus = false;
  @Input() typeInteger: number;
  @Input() readonly = false;
  @Input() optionPositionClass: string;
  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  @ViewChild('input') input: ElementRef;
  @ViewChild('controlName') myControl: NgModel;

  @Output() selectedFieldsId = new EventEmitter<UsersSearch>();

  mask = '(000) 000-0000';
  maskFormat = '(123) 456-7890';

  isLoading = false;

  constructor(
    override appFacade: AppFacade,
    @Optional() public override ngForm: NgForm,
    public override userFacade: UserFacade,
    public override utilityService: UtilityService
  ) {
    super(ngForm, appFacade, userFacade, utilityService);
  }

  ngAfterViewInit() {
    this.addControls();
    this.init();
  }

  onFocus() {
    this.autoCompleteSubscription = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: Event & { target: HTMLInputElement }) => event.target.value),
        tap(() => {
          this.isLoading = true;
        }),
        debounceTime(300),
        filter((value) => {
          if (!value) {
            this.autoComplete = [];
            return null;
          }
          this.autoComplete = [];
          this.isLoading = value.length > 2;
          return this.isLoading;
        }),
        tap((value) => {
          if (this.preventCall) {
            const payload = {
              type: this.typeInteger,
              value: value,
            };
            this.userFacade.getCustomerSeachResults(payload);
          }
        }),
        switchMap(() => this.userFacade.customerSearchResults$)
      )
      .subscribe((data) => {
        this.autoComplete = data;
        this.isLoading = false;
      });
  }

  onAutoCompleteSelect(event: MatAutocompleteSelectedEvent) {
    const selectedAutoComplete = event.option.value;
    this.selectedFieldsId.emit(selectedAutoComplete);
    const selectedName: string = selectedAutoComplete.name;
    this.value = selectedName;
    this.autoCompleteSelection();
  }

  override ngOnDestroy() {
    if (this.autoCompleteSubscription) {
      this.autoCompleteSubscription.unsubscribe();
      this.subscription.unsubscribe();
    }
  }
}
