import { T2tcloudPage } from './app.po';

describe('t2tcloud App', function() {
  let page: T2tcloudPage;

  beforeEach(() => {
    page = new T2tcloudPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
