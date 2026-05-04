import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from '@angular/forms';
import { MockUserManagementFacade, UserManagementFacade } from '@app/store/user-management';
import { TextEditorComponent } from "./text-editor.component";

describe("TextEditorComponent", () => {
  let component: TextEditorComponent;
  let fixture: ComponentFixture<TextEditorComponent>;
  let userManagementFacade: UserManagementFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextEditorComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: UserManagementFacade, useValue: MockUserManagementFacade }],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userManagementFacade = TestBed.inject(UserManagementFacade);
  });

  it('should ...', () => {
    expect(component).toBeTruthy();
  });

  it('should check onEditorReady method', () => {
    const editor = {
      conversion: {
        for: jest.fn().mockReturnValue({
          attributeToElement: jest.fn(),
          elementToAttribute: jest.fn()
        })
      }
    }
    component.onEditorReady(editor);
  })

  it('should check contentChanged method', () => {
    const mockSpyEmit = jest.spyOn(component.change, 'emit');
    component.value = '<p><a class="mention" data-mention="@Ravi Kumar" data-user-id="159">@Ravi Kumar</a>&nbsp;</p>';
    component.activeUsers = [{
      id: '@Ravi Kumar',
      userId: 159,
      name: 'Ravi Kumar'
    }]
    component.contentChanged();
    expect(mockSpyEmit).toHaveBeenCalled();
    expect(mockSpyEmit).toHaveBeenCalledWith(component.note);
  })
  it('should check toggleFlag method', () => {
    const mockSpyEmit = jest.spyOn(component.change, 'emit');
    component.note.isFlagged = false;
    component.toggleFlag();
    expect(component.note.isFlagged).toBeTruthy();
    expect(mockSpyEmit).toHaveBeenCalled();
    expect(mockSpyEmit).toHaveBeenCalledWith(component.note);
  })
})