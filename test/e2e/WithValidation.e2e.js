describe('WithValidation', () => {

    it('Renders the Slot', () => {
        cy.visit('storybook-static/index.html');
        cy.get('#explorerwithvalidation--basic-usage').click();
        cy.get('#storybook-preview-iframe')
            .then(($iframe) => cy.wrap($iframe.contents().find('body')).as('iframe'));
        cy.get('@iframe').find('input').should('contain', 'Hello World!');
    });

});
