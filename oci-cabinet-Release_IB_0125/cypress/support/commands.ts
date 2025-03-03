/// <reference types="cypress" />
Cypress.Commands.add('login', (phone, code, role) => {
  cy.session(phone, () => {
    cy.visit('/auth/login');
    cy.get('[data-test-id="login-phone"]').type('+7 771 000 08 00').should('have.value', '+7 771 000 08 00');
    cy.get('[data-test-id="login-phone-check"]').should('be.enabled').click();
    cy.get('[data-test-id="code-0"] > input').type(code[0]);
    cy.get('[data-test-id="code-1"] > input').type(code[1]);
    cy.get('[data-test-id="code-2"] > input').type(code[2]);
    cy.get('[data-test-id="code-3"] > input').type(code[3]);
    cy.get('[data-test-id="code-4"] > input').type(code[4]);
    cy.get('[data-test-id="code-5"] > input').type(code[5]);
    cy.get('[data-test-id="code-check"]').should('be.enabled').click();
    cy.get(`[data-test-id="role-${role}"]`).click();
  });
});
