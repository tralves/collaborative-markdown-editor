<template>
<div id="app">
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <page-header></page-header>
    <side-menu></side-menu>
    <main class="mdl-layout__content mdl-color--grey-100">
      <div class="page-content">

        <div class="mdl-grid">
          <text-view class="mdl-cell mdl-cell--6-col"></text-view>
          <preview-view class="mdl-cell mdl-cell--6-col"></preview-view>
        </div>

        <mdl-dialog ref="login" full-width title="Hi there">
          <p>Please log in with your Google Drive account</p>
          <template slot="actions">
            <mdl-button primary @click.native="handleAuthClick">Login</mdl-button>
          </template>
        </mdl-dialog>
        <mdl-dialog @close="closeErrorMessageCallback" ref="errorMessage" title=":(">
          <p>{{ errorMessage }}</p>
          <template slot="actions">
            <mdl-button primary @click.native="tryAgain()">Try again</mdl-button>
          </template>
        </mdl-dialog>
        <pre id="output"></pre>
      </div>
    </main>
    <create-new-file-dialog ref="create_new_file"></create-new-file-dialog>
  </div>
</div>
</template>

<script>
import qs from 'querystringify'
import PageHeader from './components/menu/PageHeader'
import SideMenu from './components/menu/SideMenu'
import CreateNewFileDialog from './components/CreateNewFileDialog'
import TextView from './components/TextView'
import PreviewView from './components/PreviewView'
import ProfileMenu from './components/menu/ProfileMenu'
import GapiIntegration from './gapi/gapi-integration'
import { file } from 'src/services'

export default {
  components: {
    PageHeader,
    TextView,
    PreviewView,
    ProfileMenu,
    SideMenu,
    'create-new-file-dialog': CreateNewFileDialog
  },
  data: function () {
    return {
      user: null,
      file: null,
      errorMessage: ''
    }
  },
  mounted: function () {
    let queryVars = qs.parse(window.location.search)
    this.user = queryVars.user
    this.file = queryVars.file

    GapiIntegration.loadDriveApis()
      .then(() => {
        console.log('starting authorize')
        GapiIntegration.authorize(true, this.user)
          .then(() => {
            return this.loadThisFile()
          })
          .catch((reason) => {
            console.log('error inload or authorize')
            this.$refs.login.open()
          })
      })
  },
  methods: {
    handleAuthClick () {
      this.$refs.login.close()
      GapiIntegration.authorize(false, this.user)
        .then(() => {
          this.loadThisFile()
        })
        .catch((reason) => {
          this.errorMessage = reason
          this.$refs.errorMessage.open()
        })
    },

    loadThisFile () {
      console.log('load file')
      // if no file id in URL, open create dialog
      if (this.file) {
        return file.loadFromGDrive(this.file)
          .catch((error) => {
            this.errorMessage = error
            this.$refs.errorMessage.open()
          })
      } else {
        this.openCreateNewFile()
      }
    },

    openCreateNewFile () {
      this.$refs.create_new_file.openDialog()
    },

    closeErrorMessageCallback () {
      window.location('/')
    },

    tryAgain () {
      window.location.reload()
    }
  }
}
</script>

<style>

main,
main div.page-content,
main div.page-content div.mdl-grid {
  height: 100%;
  box-sizing: border-box;
}

</style>



