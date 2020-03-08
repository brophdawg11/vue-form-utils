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


const inputTags = ['input', 'select', 'textarea'];
const isEmpty = (v) => v == null || v.length === 0;
const isMulti = (el) => ['checkbox', 'radio'].includes(el.getAttribute('type'));

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

function findInputs(el) {
    const inputs = [];

    if (!el) {
        return inputs;
    }

    if (inputTags.includes(el.tagName.toLowerCase()) &&
        // For radios/checkboxes, ignore disabled inputs, since they do not have
        // representative ValidityState values
        (!isMulti(el) || el.getAttribute('disabled') == null)) {
        inputs.push(el);
    }

    for (let i = 0; i < el.children.length; i++) {
        inputs.push(...findInputs(el.children[i]));
    }

    return inputs;
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
        if (!this.setInputEls()) {
            return;
        }
        // eslint-disable-next-line no-return-assign
        this._boundBlurListener = () => this.info.touched = true;
        this.inputEls.forEach((el) => el.addEventListener(
            'blur',
            this._boundBlurListener,
            { once: true },
        ));
    },
    updated() {
        if (!this.setInputEls()) {
            return;
        }
        this.checkValidity();
    },
    beforeDestroy() {
        if (!this.inputEls) {
            return;
        }
        this.inputEls.forEach((el) => el.removeEventListener('blur', this._boundBlurListener));
    },
    methods: {
        checkValidity() {
            // Checkboxes/Radios can all have individual ValidityState snapshots, so we must
            // traverse them all and combine them down to a single object representative
            // of the group.  Run this logic all the time, with the expectation that we won't
            // have multiple inputs in non-radio/checkbox cases (we warn against this in
            // setInputEls)
            const infos = this.inputEls.map((el) => {
                const info = {};
                const htmlValid = validateAttrs(html5Validations, info, el);
                const customValid = validateAttrs(this.validations, info, el);
                info.valid = htmlValid && customValid;
                return info;
            });
            // Update all validations, except touched and valid.  touched is handled
            // independently via the listeners, and valid is handled by itself
            Object.keys(this.info)
                .filter((k) => k !== 'touched' && k !== 'valid')
                .forEach((k) => Object.assign(this.info, { [k]: infos.every((i) => i[k]) }));
            this.info.valid = infos.some((i) => i.valid);
            this.$nextTick(this.setAriaAttributes);
        },
        setAriaAttributes() {
            this.inputEls.forEach((el) => {
                if (this.info.valid) {
                    el.removeAttribute('aria-invalid');
                } else {
                    el.setAttribute('aria-invalid', 'true');
                }
            });
        },
        setInputEls() {
            const inputs = findInputs(this.$el);
            if (inputs.length === 0) {
                console.warn('[WithValidation] No child input element found');
                return false;
            }
            this.inputEls = Array.from(inputs);
            if (!isMulti(this.inputEls[0]) && this.inputEls.length > 1) {
                console.warn(
                    '[WithValidation] Should only contain multiple input children for',
                    'radio/checkbox inputs',
                );
            }
            return true;
        },
    },
    render() {
        return this.$slots.default[0];
    },
};
</script>
