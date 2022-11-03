import { of } from 'rxjs';
import { DataWrapperInterceptor } from './data-wrapper.interceptor';

describe('DataWrapperInterceptor unit tests', () => {
  let interceptor: DataWrapperInterceptor;

  beforeEach(() => {
    interceptor = new DataWrapperInterceptor();
  });

  it('should wrap body in data inside an object', (done) => {
    expect(interceptor).toBeDefined();

    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });

    obs$
      .subscribe({
        next: (value) => {
          expect(value).toEqual({ data: { name: 'test' } });
        },
      })
      .add(() => done());
  });

  it('should not wrap body in data inside an object when meta is present', (done) => {
    expect(interceptor).toBeDefined();

    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ data: [{ name: 'test' }], meta: {} }),
    });

    obs$
      .subscribe({
        next: (value) => {
          expect(value).toEqual({ data: [{ name: 'test' }], meta: {} });
        },
      })
      .add(() => done());
  });
});
