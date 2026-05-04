import { BaseValueAccessor } from './base-value-accessor';

describe('BaseValueAccessor', () => {
  let valueAccessor: BaseValueAccessor<string>;

  beforeEach(() => {
    valueAccessor = new BaseValueAccessor();
  });

  it('should update the value when set', () => {
    const value = 'Test Value';
    valueAccessor.value = value;
    expect(valueAccessor.value).toEqual(value);
  });

  it('should call the registered change function when the value is set', () => {
    const mockChangeFn = jest.fn();
    valueAccessor.registerOnChange(mockChangeFn);

    const value = 'Test Value';
    valueAccessor.value = value;
    expect(mockChangeFn).toHaveBeenCalledWith(value);
  });

  it('should call the registered touch function when touch is called', () => {
    const mockTouchFn = jest.fn();
    valueAccessor.registerOnTouched(mockTouchFn);

    valueAccessor.touch();
    expect(mockTouchFn).toHaveBeenCalled();
  });

  it('should call the writeValue function when writeValue is called', () => {
    const mockWriteValueFn = jest.fn();
    valueAccessor.writeValue = mockWriteValueFn;

    const value = 'Test Value';
    valueAccessor.writeValue(value);
    expect(mockWriteValueFn).toHaveBeenCalledWith(value);
  });
});
