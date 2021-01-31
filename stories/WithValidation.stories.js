import WithValidation from '../src/WithValidation.vue';

export default {
    title: 'WithValidation',
};

export const BasicUsageInput = () => ({
    components: { WithValidation },
    data() {
        return {
            name: null,
            info: null,
        };
    },
    template: `
        <div>
            Below is a required/minlength=5 input:
            <br>
            <WithValidation @update="i => info = i">
                <input data-test="input" v-model="name" required minlength="5" />
            </WithValidation>

            <p>
                And the <code>info</code> object for this input is:
                <pre data-test="info">{{info}}</pre>
            </p>
        </div>
    `,
});

export const BasicUsageTextArea = () => ({
    components: { WithValidation },
    data() {
        return {
            name: null,
            info: null,
        };
    },
    template: `
        <div>
            Below is a required/minlength=10 textarea:
            <br>
            <WithValidation @update="i => info = i">
                <textarea data-test="input" v-model="name" required minlength="10" />
            </WithValidation>

            <p>
                And the <code>info</code> object for this textarea is:
                <pre data-test="info">{{info}}</pre>
            </p>
        </div>
    `,
});

export const BasicUsageSelect = () => ({
    components: { WithValidation },
    data() {
        return {
            value: null,
            info: null,
        };
    },
    template: `
        <div>
            Below is a required select:
            <br>
            <WithValidation @update="i => info = i">
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
                <pre data-test="info">{{info}}</pre>
            </p>
        </div>
    `,
});

export const BasicUsageRadio = () => ({
    components: { WithValidation },
    data() {
        return {
            value: null,
            info: null,
        };
    },
    template: `
        <div>
            Below is a required radio input:
            <br>
            <WithValidation @update="i => info = i">
                <div>
                    <label>
                        <input type="radio" name="radio" v-model="value" value="yes" required />
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
                <pre data-test="info">{{info}}</pre>
            </p>
        </div>
    `,
});

export const BasicUsageCheckbox = () => ({
    components: { WithValidation },
    data() {
        return {
            values: [],
            info: null,
        };
    },
    template: `
        <div>
            Below is a required/minlength=5 input:
            <br>
            <WithValidation @update="i => info = i">
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
                <pre data-test="info">{{info}}</pre>
            </p>
        </div>
    `,
});

export const AllHTML5Validations = () => ({
    components: { WithValidation },
    data() {
        return {
            field1: null,
            field2: null,
            field3: null,
            field4: null,
            field5: null,
            info: {
                field1: null,
                field2: null,
                field3: null,
                field4: null,
                field5: null,
            },
        };
    },
    template: `
        <div>
            <p>required</p>
            <WithValidation @update="i => info.field1 = i">
                <input v-model="field1" required />
            </WithValidation>
            <pre>{{info.field1}}</pre>

            <hr>
            <p>minlength=5, maxlength=10</p>
            <WithValidation @update="i => info.field2 = i">
                <input v-model="field2" minlength="5" maxlength="10" />
            </WithValidation>
            <pre>{{info.field2}}</pre>

            <hr>
            <p>type=email</p>
            <WithValidation @update="i => info.field3 = i">
                <input type="email" v-model="field3" />
            </WithValidation>
            <pre>{{info.field3}}</pre>

            <hr>
            <p>type=number, min=5, max=25, step=5</p>
            <WithValidation @update="i => info.field4 = i">
                <input type="number" v-model="field4" min="5" max="25" step="5" />
            </WithValidation>
            <pre>{{info.field4}}</pre>

            <hr>
            <p>pattern=[a-z]+</p>
            <WithValidation @update="i => info.field5 = i">
                <input v-model="field5" pattern="[a-z]+" />
            </WithValidation>
            <pre>{{info.field5}}</pre>

        </div>
    `,
});

export const CustomValidations = () => ({
    components: { WithValidation },
    data() {
        return {
            field1: null,
            field2: null,
            info: null,
            validations: {
                // Custom validation to check that the value of this input equals
                // the value of the `data-matches` attribute, which is rendered
                // in this case to the value of the first input (field1)
                'data-matches': {
                    validate: (v, attr) => v === attr,
                },
            },
        };
    },
    template: `
        <div>
            Usage of a custom validation to see if two fields match
            <br>

            <input name="field1" v-model="field1" required />
            <br>
            <WithValidation :validations="validations" @update="i => info = i">
                <input v-model="field2" required :data-matches="field1" />
            </WithValidation>

            <p>
                And the <code>info</code> object for this second input is:
                <pre data-test="info">{{info}}</pre>
            </p>
        </div>
    `,
});
