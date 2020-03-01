import { storiesOf } from '@storybook/vue';

import WithValidation from '../src/components/WithValidation.vue';

storiesOf('WithValidation', module)
    .add('Basic Usage', () => ({
        components: { WithValidation },
        data() {
            return {
                name: '',
                validity: null,
            };
        },
        computed: {
            validityJson() {
                console.log('validityJson', JSON.stringify(this.validity, null, 4));
                return JSON.stringify(this.validity, null, 4);
            },
        },
        methods: {
            onUpdate(validity) {
                console.log('onUpdate', validity);
                this.validity = validity;
            },
        },
        template: `
            <div>
                <WithValidation @update="onUpdate">
                    <input name="name" v-model="name" />
                </WithValidation>
                <pre>
                    {{validityJson}}
                </pre>
            </div>
        `,
    }));
