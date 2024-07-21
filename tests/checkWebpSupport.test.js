import { checkWebpSupport } from '../src/utils/checkWebpSupport';

describe('checkWebpSupport', () => {
  it('should call callback with true for supported browsers', (done) => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload();
        }, 100);
      }
    };

    checkWebpSupport((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should call callback with false for unsupported browsers', (done) => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onerror();
        }, 100);
      }
    };

    checkWebpSupport((result) => {
      expect(result).toBe(false);
      done();
    });
  });
});
