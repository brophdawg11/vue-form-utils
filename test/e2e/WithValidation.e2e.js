describe('WithValidation', () => {

    function aliasIframe() {
        cy.get('#storybook-preview-iframe')
            .then(($iframe) => cy.wrap($iframe.contents().find('body')).as('iframe'));
    }

    function input() {
        aliasIframe();
        return cy.get('@iframe').find('[data-test=input]');
    }

    function info() {
        aliasIframe();
        return cy.get('@iframe').find('[data-test="info"]');
    }

    function testStory(parent, story) {
        cy.visit('storybook-static/index.html');
        const storySel =
            `#${parent.toLowerCase()}--${story.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
        cy.get(storySel).click();
    }

    describe('WithValidation -> Basic Usage/input', () => {
        beforeEach(() => testStory('WithValidation', 'Basic Usage/input'));

        it('Renders the Slot', () => {
            input().should('have.value', '');
        });

        it('Displays proper validation in real-time', () => {
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

            // Currently broken due to
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

        it('Indicates proper touched status', () => {
            // Default empty and invalid
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

            // Unsure if this is the same issue as
            // https://github.com/cypress-io/cypress/issues/1930
            // input().focus().blur();
            // info().should(($info) => {
            //     expect(JSON.parse($info[0].textContent.trim())).to.deep.equal({
            //         valid: false,
            //         touched: true,
            //         required: true,
            //         type: false,
            //         pattern: false,
            //         maxlength: false,
            //         minlength: false,
            //         min: false,
            //         max: false,
            //         step: false,
            //     });
            // });
        });

    });

});
