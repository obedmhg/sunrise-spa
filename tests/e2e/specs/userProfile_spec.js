describe('user profile', () => {
  const customer = {
    firstName: 'Charlie',
    lastName: 'Bucket',
    email: 'charlie.bucket+ci@commercetools.com',
    password: 'p@ssword',
  };

  beforeEach(() => {
    cy.createCustomer(customer);
    cy.login(customer);
  });

  it('updates customer info', () => {
    const firstName = `new-${customer.firstName}`;
    const lastName = `new-${customer.lastName}`;
    const email = `new-${customer.email}`;

    cy.deleteCustomer({ email });

    cy.get('[data-test=edit-profile-form-show]', { timeout: 10000 }).click();

    cy.get('input[data-test=edit-profile-form-firstname]')
      .clear()
      .type(firstName);
    cy.get('input[data-test=edit-profile-form-lastname]')
      .clear()
      .type(lastName);
    cy.get('input[data-test=edit-profile-form-email]')
      .clear()
      .type(email);

    cy.get('[data-test=edit-profile-form-submit]').click();

    cy.get('[data-test=user-profile-name]', { timeout: 10000 })
      .should('contain', `${firstName} ${lastName}`);
    cy.get('[data-test=user-profile-email]')
      .should('contain', email);

    cy.get('[data-test=edit-profile-form-show]').click();
    cy.get('[data-test=edit-profile-form-email]')
      .should('have.value', email);
    cy.get('[data-test=edit-profile-form-cancel]').click();
    cy.get('[data-test=user-profile-email]')
      .should('contain', email);
  });

  it('changes password', () => {
    const password = `new-${customer.password}`;
    const customerNewPassword = { ...customer, password };

    cy.get('[data-test=change-password-button]', { timeout: 10000 }).click();
    cy.get('[data-test=change-password-form-currentpassword]').type(customer.password);
    cy.get('[data-test=change-password-form-newpassword]').type(password);
    cy.get('[data-test=change-password-form-newpasswordconfirm]').type(password);

    cy.get('[data-test=edit-profile-form-submit]').click();
    cy.get('[data-test=success-state-layer]')
      .should('have.class', 'state-layer fade-enter-active');

    cy.get('[data-test=logout-button]').click();
    cy.login(customerNewPassword);
    cy.checkCustomerIsLoggedIn(customerNewPassword);
  });
});
