<script>
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
const html5Validations = {
    required: {
        field: 'valueMissing',
    },
    type: {
        field: 'typeMismatch',
    },
    pattern: {
        field: 'patternMismatch',
    },
    maxlength: {
        field: 'tooLong',
    },
    minlength: {
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
    props: {
        validations: {
            type: Object,
            default: null,
        },
    },
    data() {
        const validationProps = (obj) => Object.keys(obj || {})
            .reduce((acc, attr) => Object.assign(acc, { [attr]: false }), {});
        return {
            info: {
                valid: true,
                touched: false,
                ...validationProps(html5Validations),
                ...validationProps(this.validations),
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
    mounted() {
        if (!this.setInputEl()) {
            return;
        }
        // eslint-disable-next-line no-return-assign
        this.inputEl.addEventListener('blur', () => this.info.touched = true, { once: true });
    },
    updated() {
        this.setInputEl();
        this.checkValidity();
    },
    methods: {
        checkValidity() {
            if (!this.inputEl || !this.inputEl.validity) {
                return;
            }
            const { validity, value } = this.inputEl;

            const validateAttrs = (obj) => Object.entries(obj || {})
                .reduce((acc, [attr, config]) => {
                    if (config.field) {
                        // ValidityState validation
                        this.info[attr] = validity[config.field] === true;
                    } else if (config.validate) {
                        // Custom validation
                        const attrValue = this.inputEl.getAttribute(attr);
                        this.info[attr] = config.validate(value, attrValue) !== true;
                    }
                    return acc && this.info[attr] === false;
                }, true);

            this.info.valid = validateAttrs(html5Validations) && validateAttrs(this.validations);
        },
        setInputEl() {
            this.inputEl = findInput(this.$el);
            if (!this.inputEl == null) {
                console.warn('[WithValidation] No child input element found');
                return false;
            }
            return true;
        },
    },
    render() {
        return this.$slots.default[0];
    },
};
</script>
