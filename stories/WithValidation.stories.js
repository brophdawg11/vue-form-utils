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
                Below is a required/minlength=5 input:
                <br>
                <WithValidation @update="onUpdate">
                    <input data-test="input" name="name" v-model="name" required minlength="5" />
                </WithValidation>

                <p>
                    And the <code>info</code> object for this input is:
                    <pre data-test="info">
{{validityJson}}
                    </pre>
                </p>
            </div>
        `,
    }));
