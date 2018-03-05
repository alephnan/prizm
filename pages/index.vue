<template>
  <p>
      Welcome
  </p>
</template>


<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator"

@Component({
})
export default class extends Vue {
  fetch({store}) {
    return store.dispatch('setView', 'other');
  }
}


</script>
<style scoped>
</style>