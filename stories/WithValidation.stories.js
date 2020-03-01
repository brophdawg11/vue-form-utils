import { storiesOf } from '@storybook/vue';

import WithValidation from '../src/components/WithValidation.vue';

storiesOf('WithValidation', module)
    .add('Basic Usage/input', () => ({
        components: { WithValidation },
        data() {
            return {
                name: null,
                info: null,
            };
        },
        computed: {
            infoJson() {
                return JSON.stringify(this.info, null, 4);
            },
        },
        methods: {
            onUpdate(info) {
                this.info = info;
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
{{infoJson}}
                    </pre>
                </p>
            </div>
        `,
    }))
    .add('Basic Usage/textarea', () => ({
        components: { WithValidation },
        data() {
            return {
                name: null,
                info: null,
            };
        },
        computed: {
            infoJson() {
                return JSON.stringify(this.info, null, 4);
            },
        },
        methods: {
            onUpdate(info) {
                this.info = info;
            },
        },
        template: `
            <div>
                Below is a required/minlength=10 textarea:
                <br>
                <WithValidation @update="onUpdate">
                    <textarea data-test="input" name="name" v-model="name" required minlength="10" />
                </WithValidation>

                <p>
                    And the <code>info</code> object for this textarea is:
                    <pre data-test="info">
{{infoJson}}
                    </pre>
                </p>
            </div>
        `,
    }))
    .add('Basic Usage/select', () => ({
        components: { WithValidation },
        data() {
            return {
                value: null,
                info: null,
            };
        },
        computed: {
            infoJson() {
                return JSON.stringify(this.info, null, 4);
            },
        },
        methods: {
            onUpdate(info) {
                this.info = info;
            },
        },
        template: `
            <div>
                Below is a required select:
                <br>
                <WithValidation @update="onUpdate">
                    <select data-test="input" name="value" v-model="value" required>
                        <option value="">Select a value...</option>
                        <option value="apple">Apple</option>
                        <option value="orange">Orange</option>
                        <option value="banana">Banana</option>
                        <option value="pear">Pear</option>
                    </select>
                </WithValidation>

                <p>
                    And the <code>info</code> object for this textarea is:
                    <pre data-test="info">
{{infoJson}}
                    </pre>
                </p>
            </div>
        `,
    }))
    .add('Custom Validations', () => ({
        components: { WithValidation },
        data() {
            return {
                field1: null,
                field2: null,
                info: null,
                validations: {
                    'data-matches': {
                        validate: (v, attr) => v === attr,
                    },
                },
            };
        },
        computed: {
            infoJson() {
                return JSON.stringify(this.info, null, 4);
            },
        },
        methods: {
            onUpdate(info) {
                this.info = info;
            },
        },
        template: `
            <div>
                Same usage of a custom validation to see if two fields match
                <br>

                <input name="field1" v-model="field1" required />
                <br>
                <WithValidation :validations="validations" @update="onUpdate">
                    <input name="name" v-model="field2" required :data-matches="field1" />
                </WithValidation>

                <p>
                    And the <code>info</code> object for this second input is:
                    <pre data-test="info">
{{infoJson}}
                    </pre>
                </p>
            </div>
        `,
    }));
