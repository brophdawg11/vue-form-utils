describe('WithValidation', () => {

    const input = () => cy.get('@iframe').find('[data-test=input]');
    const info = () => cy.get('@iframe').find('[data-test="info"]');

    it('Renders the Slot', () => {
        cy.visit('storybook-static/index.html');
        cy.get('#explorerwithvalidation--basic-usage').click();
        cy.get('#storybook-preview-iframe')
            .then(($iframe) => cy.wrap($iframe.contents().find('body')).as('iframe'));

        input().should('have.value', '');
    });

    it('Displays proper validation in real-time', () => {
        cy.visit('storybook-static/index.html');
        cy.get('#explorerwithvalidation--basic-usage').click();
        cy.get('#storybook-preview-iframe')
            .then(($iframe) => cy.wrap($iframe.contents().find('body')).as('iframe'));

        // Default empty and invalid
        input().should('have.value', '');
        info().should(($info) => {
            expect(JSON.parse($info[0].textContent.trim())).to.deep.equal({
                valid: false,
                touched: false,
                required: true,
                type: false,
                pattern: false,
                maxlength: false,
                minlength: false,
                min: false,
                max: false,
                step: false,
            });
        });

        // https://github.com/cypress-io/cypress/issues/1930
        // input().type('t');
        // input().should('have.value', 't');
        // info().should(($info) => {
        //     expect(JSON.parse($info[0].textContent.trim())).to.deep.equal({
        //         valid: false,
        //         touched: false,
        //         required: false,
        //         type: false,
        //         pattern: false,
        //         maxlength: false,
        //         minlength: true,
        //         min: false,
        //         max: false,
        //         step: false,
        //     });
        // });
    });

});
