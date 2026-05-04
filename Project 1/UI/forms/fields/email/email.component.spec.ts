import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailComponent } from './email.component';
import { AppFacade, MockAppFacade } from '@app/store/app';
import { FormsModule } from '@angular/forms';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;
  let appFacade: AppFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: AppFacade, useValue: MockAppFacade}
      ],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    appFacade = TestBed.inject(AppFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
