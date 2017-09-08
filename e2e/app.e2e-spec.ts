import { OnpushplayPage } from './app.po';

describe('onpushplay App', () => {
  let page: OnpushplayPage;

  beforeEach(() => {
    page = new OnpushplayPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
