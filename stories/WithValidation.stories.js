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
                    <input data-test="input" v-model="name" required minlength="5" />
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
                    <textarea data-test="input" v-model="name" required minlength="10" />
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
                    <select data-test="input" v-model="value" required>
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
    .add('Basic Usage/radio', () => ({
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
                Below is a required/minlength=5 input:
                <br>
                <WithValidation @update="onUpdate">
                    <div>
                        <label>
                            <input disabled type="radio" name="radio" v-model="value" value="yes" required />
                            Yes
                        </label>
                        <label>
                            <input type="radio" name="radio" v-model="value" value="no" required />
                            No
                        </label>
                        <label>
                            <input type="radio" name="radio" v-model="value" value="dont-care" required />
                            Don't Care
                        </label>
                    </div>
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
    .add('Basic Usage/checkbox', () => ({
        components: { WithValidation },
        data() {
            return {
                values: [],
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
                    <div>
                        <label>
                            <input type="checkbox" name="checkbox" v-model="values" value="1" required />
                            1
                        </label>
                        <label>
                            <input type="checkbox" name="checkbox" v-model="values" value="2" required />
                            2
                        </label>
                        <label>
                            <input type="checkbox" name="checkbox" v-model="values" value="3" required />
                            3
                        </label>
                    </div>
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
    .add('All HTML5 Validations', () => ({
        components: { WithValidation },
        data() {
            return {
                field1: null,
                field2: null,
                field3: null,
                field4: null,
                field5: null,
                field6: null,
                field7: null,
                field8: null,
                field9: null,
                info: {},
            };
        },
        computed: {
        },
        methods: {
            onUpdate(field, info) {
                if (!this.info[field]) {
                    this.$set(this.info, field, info);
                } else {
                    this.info[field] = info;
                }
            },
            infoJson(field) {
                return JSON.stringify(this.info[field] || null, null, 4);
            },
        },
        template: `
            <div>
                <p>required</p>
                <WithValidation @update="info => onUpdate('field1', info)">
                    <input v-model="field1" required />
                </WithValidation>
                <pre>
{{infoJson('field1')}}
                </pre>

                <hr>
                <p>minlength=5, maxlength=10</p>
                <WithValidation @update="info => onUpdate('field2', info)">
                    <input v-model="field2" minlength="5" maxlength="10" />
                </WithValidation>
                <pre>
{{infoJson('field2')}}
                </pre>

                <hr>
                <p>type=email</p>
                <WithValidation @update="info => onUpdate('field3', info)">
                    <input type="email" v-model="field3" />
                </WithValidation>
                <pre>
{{infoJson('field3')}}
                </pre>

                <hr>
                <p>type=number, min=5, max=25, step=5</p>
                <WithValidation @update="info => onUpdate('field4', info)">
                    <input type="number" v-model="field4" min="5" max="25" step="5" />
                </WithValidation>
                <pre>
{{infoJson('field4')}}
                </pre>

                <hr>
                <p>pattern=[a-z]+</p>
                <WithValidation @update="info => onUpdate('field5', info)">
                    <input v-model="field5" pattern="[a-z]+" />
                </WithValidation>
                <pre>
{{infoJson('field5')}}
                </pre>

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
                    <input v-model="field2" required :data-matches="field1" />
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
