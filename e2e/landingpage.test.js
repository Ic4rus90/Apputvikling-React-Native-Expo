// This test checks whether the app launches to the landing page.
// Both the login and register buttons should be visible.
// If the login button is clicked, then the LoginScreen should appear.
// If the register button is clicked, then the RegisterScreen should appear.

// Reload before each action, so that the starting point is always the landing page.

describe('Landing page', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should open on landing page', async () => {
    await expect(element(by.text('Welcome'))).toBeVisible();
  });

  it('should show login screen after tap on login button', async () => {
    await element(by.id('LoginScreenButton')).tap();
    await expect(element(by.text('Sign in to your existing account'))).toBeVisible();
  });

  it('should show register screen after tap on the register button', async () =>
  {
    await element(by.id('RegisterScreenButton')).tap();
    await expect(element(by.text('Create a new account'))).toBeVisible();

  });



});
