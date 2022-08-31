<template>
  <v-form>
    <v-file-input
      label="Select a file to upload"
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
</style>
