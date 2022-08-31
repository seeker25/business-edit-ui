<template>
  <div id="upload-rules">
    <div class="section-container upload-rules-header">
        <v-icon color="appDkBlue">mdi-format-list-text</v-icon>
        <label class="font-weight-bold pl-2">Rules</label>
    </div>

    <!-- Instructional Text -->
    <article class="instructional-text section-container">
      <strong> Complete, sign, and date </strong> your new Rules of Association before uploading.
      Your historical rules will always be available on your dashboard.
    </article>

    <!-- Confirm Rules Completion -->
    <section id="confirm-rules-section" class="mt-10 section-container">
      <header id="rules-confirm-header">
        <label>Confirm Rules Completion</label>
      </header>

      <div class="mt-4" :class="{ 'invalid-section': getShowErrors && !hasRulesConfirmed }">
          <v-form ref="confirmRulesChk">
            <v-checkbox
              id="chk-confirm-rules"
              class="chk-rules mt-0 pt-0"
              v-model="rulesConfirmed"
              hide-details
              :rules="confirmCompletionRules"
              label="I confirm the following items are included as required in the Cooperative Associations Act:"
              @change="onRulesConfirmedChange($event)"
            />
            <ul>
              <li class="mt-4">
                <v-row no-gutters>
                  <v-icon>mdi-circle-small</v-icon>
                    <p class="mb-0 ml-2">
                      The Cooperative name is identified <strong>exactly</strong> as follows throughout
                      the Rules of the Association:
                    </p>
                    <div class="mb-0 font-weight-bold">{{getNameRequestLegalName}}</div>
                </v-row>
              </li>
              <li class="mt-1">
                <v-row no-gutters>
                  <v-icon>mdi-circle-small</v-icon>
                  <v-col cols="11">
                    <p class="mb-0 mt-4 ml-2">
                      Each Subscriber and Witness has signed and dated the Rules of the
                      Association and their name is printed under their signature.
                    </p>
                   </v-col>
                </v-row>
              </li>
            </ul>
          </v-form>
      </div>
    </section>

    <!-- Upload Rules -->
    <section id="upload-rules-section" class="mt-10 section-container">
      <header id="upload-rules-header">
        <label>Upload Rules</label>
        <ul class="mt-5" style="list-style: none">
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="ml-2">Must be set to fit onto 8.5" x 11" letter-size paper</span>
          </li>
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="ml-2">Allow a minimum 1.5" margin at the top of the first page
              (for BC Registries certified stamp)</span>
          </li>
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="ml-2">Use a white background and a legible font with contrasting
              font colour</span>
          </li>
          <li class="mt-1">
            <v-icon>mdi-circle-small</v-icon>
            <span class="ml-2">PDF file type (maximum 30 MB file size)</span>
          </li>
        </ul>
        <div id="upload-rules-note" class="mt-6">
          <strong>Note: </strong>Do not upload Housing Cooperative occupancy agreements.
        </div>
      </header>

      <div class="mt-4" :class="{ 'invalid-section': getShowErrors && !hasValidUploadFile }">
        <v-card flat id="upload-rules-card" class="py-8 px-6">
          <v-row no-gutters>
            <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
              <FileUploadPreview/>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, CreateRulesIF, ValidationDetailIF } from '@/interfaces'
import { DocumentMixin } from '@/mixins'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'

@Component({
  components: {
    FileUploadPreview
  }
})
export default class UploadRules extends Mixins(DocumentMixin) {
  private hasValidUploadFile = false
  private hasRulesConfirmed = false
  private rulesConfirmed = false
  private fileUploadCustomErrorMsg: string = ''
  private uploadRulesDoc: File = null
  private uploadRulesDocKey: string = null

  @Getter getNameRequestLegalName!: string
  @Getter getCreateRulesStep!: CreateRulesIF

  @Action setRules!: ActionBindingIF
  @Action setRulesStepValidity!: ActionBindingIF

  private confirmCompletionRules = [
    (v) => { return !!v }
  ]

  private setUploadRulesDoc (doc: File) {
    this.uploadRulesDoc = doc
    this.uploadRulesDocKey = null
  }

  private isFileUploadValidFn (val) {
    this.hasValidUploadFile = val
    this.updateRulesStepValidity()
  }

  private updateRulesStepValidity () {
    const validationDetail:ValidationDetailIF =
      {
        valid: this.hasRulesConfirmed && this.hasValidUploadFile,
        validationItemDetails: [
          { name: 'hasRulesConfirmed', valid: this.hasRulesConfirmed, elementId: 'rules-confirm-header' },
          { name: 'hasValidUploadFile', valid: this.hasValidUploadFile, elementId: 'upload-rules-header' }
        ]
      }
    this.setRulesStepValidity(validationDetail)
  }

  private onRulesConfirmedChange (rulesConfirmed: boolean): void {
    this.hasRulesConfirmed = rulesConfirmed
    this.updateRulesStepValidity()
    this.setRules({
      ...this.getCreateRulesStep,
      rulesConfirmed: rulesConfirmed
    })
  }

  /** Called when component is created. */
  created (): void {
    this.uploadRulesDoc = this.getCreateRulesStep.rulesDoc as File
    this.uploadRulesDocKey = this.getCreateRulesStep.docKey
    this.rulesConfirmed = this.getCreateRulesStep.rulesConfirmed
    this.hasValidUploadFile = !!this.uploadRulesDocKey
    this.hasRulesConfirmed = this.rulesConfirmed
  }

  async mounted (): Promise<void> {
    // wait for components to load/stabilize then update validation state in store
    await this.$nextTick()
    this.updateRulesStepValidity()
  }
}

</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

ul {
  list-style: none;
  color: $gray7;
}
</style>
