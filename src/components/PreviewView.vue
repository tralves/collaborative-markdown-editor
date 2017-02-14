<template>
  <div class="preview-container">
    <div class='preview' v-html="renderedContent" readonly="readonly"></div >
  </div>
</template>

<script>
import Remarkable from 'remarkable'

export default {
  data: function () {
    return {
      rm: new Remarkable({
        typographer: true
      })
    }
  },
  computed: {
    renderedContent () {
      return this.rm.render(this.$store.state.file.content)
    }
  }

}
</script>

<style lang="scss" scoped>
  @import '../styles/globals';

  div {
    position: relative;
  }

  div.preview-container {
    height:100%;
    margin: 0;
    padding: 8px;
  }

  div.preview {
    background: white;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 8px;
    box-sizing: border-box;
    overflow-y: scroll;

    resize: none;
    border: 1px solid $secondary-color;
    font-size: 14px;
    outline: none;
  }
</style>
