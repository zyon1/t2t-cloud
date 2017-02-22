import { T2tCloudPage } from './app.po';

describe('t2t-cloud App', function() {
  let page: T2tCloudPage;

  beforeEach(() => {
    page = new T2tCloudPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
