describe('osiInfo', () => {
  before(() => {
    cy.intercept('https://mc.yandex.com/**', { resourceType: /xhr|fetch/ }, { log: false });
    cy.intercept('https://r.intake-lr.com/**', { resourceType: /xhr|fetch/ }, { log: false });

    cy.login('+7 771 000 08 00', '467046', 'CHAIRMAN');
  });

  beforeEach(() => {
    cy.visit('/cabinet');
    cy.get('[data-test-id="Тестовое ОСИ"]').click();
    cy.get('[data-test-id="menu-card-info"]').click();
  });

  it('validation', () => {
    cy.get('[data-test-id="osi-name"] > div > input').clear();
    cy.get('[data-test-id="osi-name"] > div').should('have.class', 'Mui-error');
    cy.get('[data-test-id="osi-save"]').should('be.disabled');

    cy.get('[data-test-id="osi-name"] > div > input').type('Тест');
    cy.get('[data-test-id="osi-name"] > div').should('not.have.class', 'Mui-error');
    cy.get('[data-test-id="osi-save"]').should('be.enabled');
  });

  it.only('info-saving', () => {
    cy.intercept('PUT', 'https://test.eosi.kz/core/api/Osi/**', (req) => {
      const requestPayload = req.body;

      // cy.log('Request Payload:', requestPayload);

      req.reply({
        statusCode: 200,
        body: 'intercepted'
      });
    }).as('postRequest');

    cy.get('[data-test-id="osi-name"] > div > input').clear().type('Тест');
    cy.get('[data-test-id="osi-name"] > div').should('not.have.class', 'Mui-error');
    cy.get('[data-test-id="osi-save"]').should('be.enabled');
    cy.wait(2000);
    cy.get('[data-test-id="osi-save"]').click();

    cy.wait('@postRequest');

    cy.get('@postRequest').then(({ request }) => {
      cy.log('payload', request.body.name);
    });
  });
});
