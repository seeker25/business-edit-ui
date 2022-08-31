<template>
  <v-form>
    <v-file-input
      label="Select a file to upload"
      filled
      dense
      v-model="fileUpload"
      accept=".pdf"
      class="file-upload-preview"
      hint="File must be a PDF. Maximum 30MB."
      persistent-hint
    >
    </v-file-input>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class FileUploadPreview extends Vue {
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
::v-deep {
  .file-upload-preview {
    .v-input__append-outer {
      margin-top: 10px !important
    }
    .v-input__slot {
      background-color: $gray1 !important;
    }
    .v-file-input__text {
     color: $app-blue !important;
    }
    .v-input__icon--prepend button {
      color: $app-blue !important;
    }
  }
}
</style>
