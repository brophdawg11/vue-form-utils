<script>
import Vue from 'vue';

/*
Design Goals
 - Use normal HTML% validation attres
 - Use normal v-model
 - Auto-detection of value?
 - supports input, textarea, select, radio, checkbox
 - ally included
 - custom validations

Notes
 - Only works with v-model - that triggers re-render on update
 */


// Mapping of attributes driving validation to validityState fields and
// corresponding validations
const validationAttrs = {
    required: {
        field: 'valueMissing',
    },
    type: {
        field: 'typeMismatch',
    },
    pattern: {
        field: 'patternMismatch',
    },
    maxLength: {
        field: 'tooLong',
    },
    minLength: {
        field: 'tooShort',
    },
    min: {
        field: 'rangeUnderflow',
    },
    max: {
        field: 'rangeOverflow',
    },
    step: {
        field: 'stepMismatch',
    },
};

const inputTags = ['input', 'select', 'textarea'];
function findInput(el) {
    if (!el) {
        return null;
    }
    if (inputTags.includes(el.tagName.toLowerCase())) {
        return el;
    }
    return el.children.find(findInput);
}

export default {
    name: 'WithValidation',
    data() {
        return {
            info: {
                valid: true,
                touched: false,
                ...Object.keys(validationAttrs).reduce((acc, attr) => Object.assign(acc, {
                    [attr]: false,
                }), {}),
            },
        };
    },
    watch: {
        info: {
            immediate: true,
            deep: true,
            handler(info) {
                this.$emit('update', info);
            },
        },
    },
    updated() {
        this.checkValidity();
    },
    methods: {
        checkValidity() {
            this.inputEl = findInput(this.$el);
            if (!this.inputEl || !this.inputEl.validity) {
                return;
            }
            const { validity } = this.inputEl;
            this.info.valid = Object.entries(validationAttrs).reduce((acc, [attr, config]) => {
                this.info[attr] = validity[config.field] === true;
                return acc && this.info[attr] === false;
            }, true);
        },
    },
    render() {
        return this.$slots.default[0];
    },
};
</script>
