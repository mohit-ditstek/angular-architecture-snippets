import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareHolderComponent } from './share-holder.component';

describe('ShareHolderComponent', () => {
  let component: ShareHolderComponent;
  let fixture: ComponentFixture<ShareHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareHolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
