import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CustomMaxDirective, CustomMinDirective } from '../../validators';
import { TextMaskInputComponent } from './text-mask-input.component';

describe('TextMaskInputComponent', () => {
  let component: TextMaskInputComponent;
  let fixture: ComponentFixture<TextMaskInputComponent>;
  const maskConfig: Partial<IConfig> = {
    validation: true,
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextMaskInputComponent, CustomMaxDirective, CustomMinDirective ],
      imports:[
        FormsModule,
        NgxMaskModule.forRoot(maskConfig),
       ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextMaskInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
