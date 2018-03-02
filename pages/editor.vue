<template>
  <MonacoEditor
    language="typescript"
    v-bind:code="defaultCode">
  </MonacoEditor>
</template>

<script lang="ts">
import {
  Component,
  Watch,
  Prop,
  Provide,
  Vue
} from "nuxt-property-decorator"
import {
  Action,
  State
} from "vuex-class"
import MonacoEditor from '~/components/Monaco.vue'
import CODE_BOILERPLATE from '~/static/code_boilerplate'


@Component({
  components: {
    MonacoEditor,
  }
})
export default class extends Vue {
  @Provide() defaultCode = CODE_BOILERPLATE

  @Watch('editor')
  onMounted(editor) {
    this.editor = editor;
  }

  @Prop()
  editor: any
}
</script>
<style scoped>
</style>