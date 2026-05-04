import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@app/shared/pipes';
import { WidgetConfig } from '../../model';
import { QuickLinkWidgetComponent } from './quick-link-widget.component';
import { CalenderTypesPipe } from '../../pipes';

const widget: WidgetConfig = {
  icon: '',
  title: '',
  description: '',
  iconColor: '',

  caption: '',

  primaryAction: null,
  secondaryAction: null,

  featureUrl: '',

  data$: null,
  callback: () => null,
};
describe('QuickLinkWidgetComponent', () => {
  let component: QuickLinkWidgetComponent;
  let fixture: ComponentFixture<QuickLinkWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickLinkWidgetComponent],
      imports: [TranslateModule.forRoot({}), PipesModule],
      providers: [CalenderTypesPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickLinkWidgetComponent);
    component = fixture.componentInstance;
    component.widget = widget;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle navigateListingPage', () => {
    const spy = jest.spyOn(component.redirectPage, 'emit');
    component.navigateListingPage();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle navigate', () => {
    const spy = jest.spyOn(component.redirect, 'emit');
    component.navigate();
    expect(spy).toHaveBeenCalled();
  });
});
