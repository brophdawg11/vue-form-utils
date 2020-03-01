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
    mounted() {
        this.inputEl = findInput(this.$el);
        this.emitValidity();
    },
    updated() {
        console.log('updated');
        this.inputEl = findInput(this.$el);
        this.emitValidity();
    },
    render() {
        console.log('render');
        return this.$slots.default[0];
    },
    methods: {
        emitValidity() {
            console.log('emitValidity');
            this.$emit('update', this.inputEl.validity);
        },
    },
};
</script>
