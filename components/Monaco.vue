<template>
  <div class="editor">
  </div>
</template>

<style scoped>
.editor {
  height: 100%;
  width: 100%;
}
</style>

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
  State
} from "vuex-class"

var debounce = require('lodash.debounce');

@Component({})
export default class extends Vue {
  @Prop({default: 'javascript'}) language : string
  @Prop({default: ''}) code : string
  @Prop({default: () => {}}) options: Object
  @Prop({default: 0}) changeThrottle: number
  

  private readonly theme = 'vs-dark'
  
  private readonly defaults = {
    selectOnLineNumbers: true,
    roundedSelection: true,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: false,
  }

  editor
  monaco
  codeChangeEmitter

  mounted() {
    this.fetchEditor();
  }
  destroyed() {
    this.destroyMonaco();
  }
  get editorOptions() {
    return Object.assign({}, this.defaults, this.options, {
      value: this.code,
      language: this.language,
      scrollBeyondLastLine: false,
      theme: this.theme,
    });
  }

  @Action refreshEditor

  @State(state =>  state.layout.stale) stale
  @Watch('stale') resize(stale) {
    if(stale) {
      this.editor.layout();
      this.refreshEditor();
    }
  }

  @Watch('language') changeLanguage() {
   (window as any).monaco.editor.setModelLanguage(this.editor.getModel(), this.language)
  }

  @Watch('code') changeCode() {
    this.editor.getModel().setValue(this.code)
  }

  @Watch('highlighted', {  deep: true }) highlightLines(lines) {
    if (!this.editor) {
      return;
    }
    lines.forEach((line) => {
      const className = line.class;
      const highlighted = this.$el.querySelector(`.${className}`);
      if (highlighted) {
        highlighted.classList.remove(className);
      }
      const number = parseInt(line.number);
      if (!this.editor && number < 1 || isNaN(number)) {
        return;
      }
      const selectedLine = this.$el.querySelector(`.view-lines [linenumber="${number}"]`);
      if (selectedLine) {
        selectedLine.classList.add(className);
      }
    });
  }

  editorHasLoaded(editor, monaco) {
    this.editor = editor;
    this.monaco = monaco;
    this.editor.onDidChangeModelContent(event =>
      this.codeChangeHandler(editor)
    );
    this.$emit('mounted', editor);
  }

  codeChangeHandler(editor) {
    if (this.codeChangeEmitter) {
      this.codeChangeEmitter(editor);
    } else {
      this.codeChangeEmitter = debounce(
        function(editor) {
          this.$emit('codeChange', editor);
        },
        this.changeThrottle
      );
      this.codeChangeEmitter(editor);
    }
  }
  fetchEditor() {
    monacoLoader(this.createMonaco);
  }
  createMonaco() {
    this.editor = (window as any).monaco.editor.create(this.$el, this.editorOptions);
    this.editorHasLoaded(this.editor, (window as any).monaco);
  }
  destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  }
}


function monacoLoader(callback) {
  const srcPath = 'https://unpkg.com/monaco-editor@0.10.1/min';
  if ((window as any).monaco) {
    callback();
    return;
  }
  const config = {
    paths: {
      vs: srcPath + '/vs'
    }
  };
  const loaderUrl = `${config.paths.vs}/loader.js`;
  const onGotAmdLoader = () => {

    if ((window as any).LOADER_PENDING) {
      (window as any).require.config(config);
    }

    // Load monaco
    (window as any).require(['vs/editor/editor.main'], () => {
      callback();
    });

    // Call the delayed callbacks when AMD loader has been loaded
    if ((window as any).LOADER_PENDING) {
      (window as any).LOADER_PENDING = false;
      const loaderCallbacks = (window as any).LOADER_CALLBACKS;
      if (loaderCallbacks && loaderCallbacks.length) {
        let currentCallback = loaderCallbacks.shift();
        while (currentCallback) {
          currentCallback.fn.call(currentCallback.window);
          currentCallback = loaderCallbacks.shift();
        }
      }
    }
  };

  // Load AMD loader if necessary
  if ((window as any).LOADER_PENDING) {
    // We need to avoid loading multiple loader.js when there are multiple editors loading concurrently
    //  delay to call callbacks except the first one
    (window as any).LOADER_CALLBACKS = (window as any).LOADER_CALLBACKS || [];
    (window as any).LOADER_CALLBACKS.push({
      window: this,
      fn: onGotAmdLoader
    });
  } else {
    if (typeof (window as any).require === 'undefined') {
      const loaderScript = window.document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = loaderUrl;
      loaderScript.addEventListener('load', onGotAmdLoader);
      window.document.body.appendChild(loaderScript);
      (window as any).LOADER_PENDING = true;
    } else {
      onGotAmdLoader();
    }
  }
}
</script>
