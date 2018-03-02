<template>
  <v-app id="inspire" dark
      @transitionend.native="queueLayoutRefresh">
    <v-navigation-drawer
      fixed
      v-bind:value="drawerRight"
      right
      clipped
      app
    >
      <v-list dense>
        <v-list-tile @click.stop="toggleRightSubDrawer()">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Open Temporary Drawer</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      dark
      fixed
      app
      clipped-left
      clipped-right
    >
      <v-toolbar-side-icon @click.stop="toggleLeftDrawer()"></v-toolbar-side-icon>
      <v-toolbar-title>Google Cloud Platform</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        placeholder="Search..."
        single-line
        append-icon="search"
        :append-icon-cb="() => {}"
        color="white"
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-toolbar-side-icon @click.stop="toggleRightDrawer()"></v-toolbar-side-icon>
    </v-toolbar>
    <v-navigation-drawer
      fixed
      clipped
      v-bind:value="drawerLeft"
      app
    >
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click.stop="toggleLeftSubDrawer()">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Open Temporary Drawer</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      temporary
      v-bind:value="subDrawerLeft"
      fixed
    ></v-navigation-drawer>
    <v-content>
      <v-container fluid fill-height>
        <MonacoEditor
          language="typescript"
          v-bind:code="defaultCode">
        </MonacoEditor>
      </v-container>
    </v-content>
    <v-navigation-drawer
      right
      temporary
      v-bind:value="subDrawerRight"
      fixed
    ></v-navigation-drawer>
    <v-footer color="blue-grey" class="white--text" app>
      <span>alephNaN@</span>
    </v-footer>
  </v-app>
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
import debounce from 'debounce'


@Component({
  components: {
    MonacoEditor,
  }
})
export default class extends Vue {
  @Provide() defaultCode = CODE_BOILERPLATE

  @State( state => state.layout.drawerLeft ) drawerLeft
  @State( state => state.layout.drawerRight ) drawerRight
  @State( state => state.layout.subDrawerLeft ) subDrawerLeft
  @State( state => state.layout.subDrawerRight ) subDrawerRight

  @Action toggleLeftDrawer
  @Action toggleRightDrawer
  @Action toggleLeftSubDrawer
  @Action toggleRightSubDrawer

  @Provide() code = 'gfgffg'
  @Provide() options = {
    selectOnLineNumbers: false
  }

  @Watch('editor')
  onMounted(editor) {
    this.editor = editor;
  }

  queueLayoutRefresh = debounce((e) => {
    this.$store.dispatch('requestLayoutRefresh')
  }, 500);

  @Prop()
  source: String

  @Prop()
  editor: any
}
</script>
<style scoped>
.header {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana,
    sans-serif;
}

.cards {
  display: flex;
  flex-wrap: wrap;
}
</style>