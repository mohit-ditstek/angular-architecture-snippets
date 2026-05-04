import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from '@app/shared/pipes';
import { UtilityService } from '@app/shared/services';
import { AngularTestingRootModule, ThirdPartyTestingRootModule } from '@app/shared/testing';

import { FileUploadComponent } from './file-upload.component';


describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let utilityService: UtilityService;

  let mockUtiliService = {
    validateMaxSizeInKb: jest.fn().mockReturnValue(true)
  }
  beforeEach(async () => {
    jest.spyOn(global, 'FileReader');
    await TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      imports: [PipesModule,MatTooltipModule],
      providers: [{provide: UtilityService, useValue: mockUtiliService}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.allowedTypes = ['png', 'jpg', 'jpeg'];
    fixture.detectChanges();

    utilityService = TestBed.inject(UtilityService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should handle onFileChange method', () => {
    // Todo need to check else condition
    it('should check has empty file', () => {
      const event = {target: { files: []}};
      component.onFileChange(event);
      expect(component.showMaxSizeError).toBe(false)
    });

    it('should check has file', () => {
      const event = {target: { files: [{name:'image.pdf'}]}};
      component.onFileChange(event);
      expect(component.showMaxSizeError).toBe(false);
      expect(component.showError).toBe(true);
    });
  });

  it('should handle remove logo method', () => {
    const mockSpyEvent = jest.spyOn(component.uploadFile, 'emit');
    component.removeLogo();
    expect(mockSpyEvent).toHaveBeenCalled();
    expect(component.fileName).toBe('');
    expect(component.showError).toBe(false);
    expect(component.showMaxSizeError).toBe(false);
  });

  describe('should check get property', () => {
    it('should isImageType has true', () => {
      component.isImageType = true;
      expect(component.mimeType).toBe('image/')
    });
    it('should isImageType has false', () => {
      component.isImageType = false;
      expect(component.mimeType).toBe('application/')
    });
  })

});
