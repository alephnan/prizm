<template>
  <h1>
    Select a file
  </h1>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator"

@Component({
})
export default class extends Vue {
  fetch({store, params}) {
    const projectId = params.projectId;
    // NUXT not invoking ancestor component's fetch (where selectProject triggered).
    // Implicitly, selectProject action will invoke it's dependenc(ies) loadProjects.
    return store.dispatch('selectProject', projectId).then(() => {
      return store.dispatch('loadSources', projectId);
    });
  }
}
</script>
<style scoped>
</style>
