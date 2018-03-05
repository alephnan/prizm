<template>
  <MonacoEditor
    v-bind:language="language"
    v-bind:code="source">
  </MonacoEditor>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Provide,
  Vue,
  Watch,
} from "nuxt-property-decorator"
import {
  Action,
  State,
} from "vuex-class"
import MonacoEditor from '~/components/Monaco.vue'

const EXTENSION_LANGUAGE_MAP = {
  'ts': 'typescript',
  'js': 'javascript',
};

@Component({
  components: {
    MonacoEditor,
  }
})
export default class extends Vue {
  @State(state => state.source.content) source
  @State(state => {
    const extension = state.source.name.split('.')[1];
    const language = EXTENSION_LANGUAGE_MAP[extension] || extension;
    return language;
  }) language

  @Watch('editor')
  onMounted(editor) {
    this.editor = editor;
  }

  @Prop() editor: any

  fetch({store, params}) {
    const projectId = params.projectId;
    const sourceId = params.sourceId;
    // NUXT not invoking ancestor component's fetch (where selectProject triggered).
    // Implicitly, the selectProject action will invoke it's dependenc(ies) loadProjects.
    // selectSource will invoke it's dependenc(ies) loadSources.
    return store.dispatch('selectProject', projectId).then(() => {
      return store.dispatch('selectSource', {
        projectId,
        sourceId
      })
    })
  }
}
</script>
<style scoped>
</style>
