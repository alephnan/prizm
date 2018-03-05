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
      <v-toolbar-title>{{project}}</v-toolbar-title>
      <v-menu offset-y>
        <v-btn fab slot="activator">
          <v-icon large color="primary">
            expand_more
          </v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="project in projects" :key="project.name"
              @click="$router.push(`/project/${project.name}/source`)">
            <v-list-tile-title>{{ project.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
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
        <v-list-tile @click="$router.push('/')">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
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
        <v-subheader>
          Source
        </v-subheader>
        <v-list-tile v-for="source in sources" :key="source.name" v-ripple>
          <v-list-tile-title @click.stop="selectSource(project, source)">
            {{ source.name }}
          </v-list-tile-title>
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
        <nuxt />
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
import debounce from 'debounce'

@Component({
  components: {
    MonacoEditor,
  }
})
export default class extends Vue {
  @State( state => state.project ) project
  @State( state => state.projects ) projects
  @State( state => state.sources ) sources

  @State( state => state.layout.drawerLeft ) drawerLeft
  @State( state => state.layout.drawerRight ) drawerRight
  @State( state => state.layout.subDrawerLeft ) subDrawerLeft
  @State( state => state.layout.subDrawerRight ) subDrawerRight

  @Action toggleLeftDrawer
  @Action toggleRightDrawer
  @Action toggleLeftSubDrawer
  @Action toggleRightSubDrawer

  queueLayoutRefresh = debounce((e) => {
    this.$store.dispatch('requestLayoutRefresh')
  }, 500);

  selectSource(project, source) {
    const path = `/project/${project}/source/${encodeURIComponent(source.name)}/editor`;
    // When switching between files, manually update source state, preventing re-render of editor.
    if(this.$store.state.view == 'editor' && (typeof (history.pushState) != "undefined")) {
      this.$store.dispatch('selectSource', {
        projectId: project,
        sourceId: source.name
      }).then(() => {
        history.replaceState({}, '', path);
      });
    } else {
      this.$router.replace(`/project/${project}/source/${encodeURIComponent(source.name)}/editor`)
    }
  }
}
</script>

<style scoped>
.header {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana,
    sans-serif;
}
</style>