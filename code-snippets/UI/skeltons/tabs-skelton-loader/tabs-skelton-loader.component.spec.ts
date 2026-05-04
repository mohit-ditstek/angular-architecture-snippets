import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsSkeltonLoaderComponent } from './tabs-skelton-loader.component';

describe('TabsSkeltonLoaderComponent', () => {
  let component: TabsSkeltonLoaderComponent;
  let fixture: ComponentFixture<TabsSkeltonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsSkeltonLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsSkeltonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
