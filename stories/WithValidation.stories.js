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
                return JSON.stringify(this.validity, null, 4);
            },
        },
        methods: {
            onUpdate(validity) {
                this.validity = validity;
            },
        },
        template: `
            <div>
                <WithValidation @update="onUpdate">
                    <input name="name" v-model="name" required />
                </WithValidation>
                <pre>
{{validityJson}}
                </pre>
            </div>
        `,
    }));
