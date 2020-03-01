import { mount } from '@vue/test-utils';
import WithValidation from '../../src/components/WithValidation.vue';

describe('WithValidation', () => {

    it('Renders the slot content', () => {
        const cmp = mount({
            components: {
                WithValidation,
            },
            template: `
                <WithValidation>
                    <input />
                </WithValidation>
            `,
        });
        expect(cmp.contains('input')).toBe(true);
    });

});
