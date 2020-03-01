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


const isEmpty = (v) => v == null || v.length === 0;

// Mapping of attributes driving validation to validityState fields and
// corresponding validations
const html5Validations = {
    required: {
        field: 'valueMissing',
        validate: (v) => !isEmpty(v),
    },
    type: {
        field: 'typeMismatch',
        validate() {
            console.warn(
                '[WithValidation] No fallback validation provided for HTML5 "type" attriubutes',
            );
            return true;
        },
    },
    pattern: {
        field: 'patternMismatch',
        validate(v, attr) {
            try {
                const re = new RegExp(`^${attr}$`, 'u');
                return isEmpty(v) || re.test(v);
            } catch (e) {
                console.warn(`[WithValidation] Unable to parse pattern RegExp: ${attr}`);
                return false;
            }
        },
    },
    minlength: {
        field: 'tooShort',
        validate: (v, attr) => isEmpty(v) || v.length >= parseInt(attr, 10),
    },
    maxlength: {
        field: 'tooLong',
        validate: (v, attr) => isEmpty(v) || v.length <= parseInt(attr, 10),
    },
    min: {
        field: 'rangeUnderflow',
        validate: (v, attr) => isEmpty(v) || v >= parseInt(attr, 10),
    },
    max: {
        field: 'rangeOverflow',
        validate: (v, attr) => isEmpty(v) || v <= parseInt(attr, 10),
    },
    step: {
        field: 'stepMismatch',
        validate: (v, attr) => isEmpty(v) || v % parseFloat(attr) === 0,
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
            if (!this.inputEl) {
                return;
            }

            const { validity, value } = this.inputEl;
            const validateAttrs = (obj) => Object.entries(obj || {})
                .reduce((acc, [attr, config]) => {
                    const attrValue = this.inputEl.getAttribute(attr);

                    // Don't validate if the attribute doesn't exist
                    if (attrValue == null) {
                        return acc;
                    }

                    if (validity && config.field) {
                        // ValidityState validation
                        this.info[attr] = validity[config.field] === true;
                    } else if (config.validate) {
                        // Custom validation
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
