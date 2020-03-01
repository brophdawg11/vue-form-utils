import { mount } from '@vue/test-utils';
import WithValidation from '../../src/components/WithValidation.vue';

describe('WithValidation', () => {

    it('Should render "Hello World"', () => {
        const cmp = mount(WithValidation);
        expect(cmp.contains('input')).toBe(true);
    });

});
