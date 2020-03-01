<script>
/*
Design Goals
 - x Use normal HTML% validation attrs
 - x Use normal v-model
 - x Auto-detection of value?
 - x supports input, textarea, select, radio, checkbox
 - ally included
 - x custom validations

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
function findInput(el, acc) {
    if (!el) {
        return null;
    }

    const isRadioOrCheckbox = ['radio', 'checkbox'].includes(el.getAttribute('type'));
    if (inputTags.includes(el.tagName.toLowerCase()) &&
        // For radios/checkboxes, ignore disabled inputs, since they do not have
        // representative ValidityState values
        (!isRadioOrCheckbox || el.getAttribute('disabled') == null)) {
        if (!acc) {
            return el;
        }
        acc.push(el);
    }

    for (let i = 0; i < el.children.length; i++) {
        if (acc) {
            findInput(el.children[i], acc);
        } else {
            const descendant = findInput(el.children[i]);
            if (descendant) {
                return descendant;
            }
        }
    }

    return acc || null;
}

function hasAttrError(attr, attrValue, config, validity, value) {
    if (validity && config.field) {
        // ValidityState validation
        return validity[config.field] === true;
    }
    if (config.validate) {
        // Custom validation
        return config.validate(value, attrValue) !== true;
    }
    return false;
}

function validateAttrs(obj, info, el) {
    return Object.entries(obj || {}).reduce((acc, [attr, config]) => {
        const { validity, value } = el;
        const attrValue = el.getAttribute(attr);

        // Don't validate if the attribute doesn't exist or if we already
        // found an error for this attribute
        if (attrValue == null) {
            return acc;
        }

        // eslint-disable-next-line no-param-reassign
        info[attr] = hasAttrError(attr, attrValue, config, validity, value);
        return acc && info[attr] === false;
    }, true);
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
            isCheckbox: false,
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
        if (this.isCheckbox) {
            findInput(this.$el, []).forEach((el) => el.addEventListener(
                'blur',
                // eslint-disable-next-line no-return-assign
                () => this.info.touched = true,
                { once: true },
            ));
        } else {
            // eslint-disable-next-line no-return-assign
            this.inputEl.addEventListener('blur', () => this.info.touched = true, { once: true });
        }
    },
    updated() {
        if (!this.setInputEl()) {
            return;
        }
        this.checkValidity();
    },
    methods: {
        checkValidity() {
            // Checkboxes can all have individual ValidityState snapshots, so we must
            // traverse them all and combine them down to a single object representative
            // of the group
            if (this.isCheckbox) {
                const inputs = findInput(this.$el, []);
                const infos = inputs.map((el) => {
                    const info = {};
                    const htmlValid = validateAttrs(html5Validations, info, el);
                    const customValid = validateAttrs(this.validations, info, el);
                    info.valid = htmlValid && customValid;
                    return info;
                });
                Object.keys(this.info).forEach((k) => {
                    if (k === 'touched') {
                        return;
                    }
                    if (k === 'valid') {
                        this.info[k] = infos.some((i) => i[k]);
                    } else {
                        this.info[k] = infos.every((i) => i[k]);
                    }
                });
                return;
            }

            const htmlValid = validateAttrs(html5Validations, this.info, this.inputEl);
            const customValid = validateAttrs(this.validations, this.info, this.inputEl);
            this.info.valid = htmlValid && customValid;
        },
        setInputEl() {
            this.inputEl = findInput(this.$el);
            if (this.inputEl == null) {
                console.warn('[WithValidation] No child input element found');
                return false;
            }
            this.isCheckbox = this.inputEl.getAttribute('type') === 'checkbox';
            return true;
        },
    },
    render() {
        return this.$slots.default[0];
    },
};
</script>
