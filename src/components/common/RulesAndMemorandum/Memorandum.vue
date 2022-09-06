<template>
  <div id="upload-memorandum">

    <v-card flat>

      <!-- Header -->
      <article class="header-container section-container upload-memorandum-header">
          <v-icon color="appDkBlue">mdi-text-box-multiple</v-icon>
          <label class="font-weight-bold pl-2">Memorandum</label>
      </article>

      <div v-if="!isEditingRules">

        <!-- Edit Mode -->
        <!-- Instructional Text -->
        <article class="instructional-text section-container">
          <strong> Complete, sign, and date </strong> your new Memorandum of Association before uploading.
          Your historical memorandum will always be available on your dashboard.
        </article>

        <!-- Help section - Overrides the default content (contact information) -->
        <HelpSection
          v-if="getMemorandumResource"
          class="my-2 px-8"
          :overrideHeader="helpSectionHeader"
        >
          <template v-slot:overrideContent>
            <header id="memorandum-help-header">
              <h2>{{helpSectionHeader}}</h2>
            </header>

            <p
              v-for="(item, index) in helpSectionText.section1.items"
              class="mt-4"
              :key="index"
              v-html="item"
            />

            <p class="help-section-title font-weight-bold mt-4">
              {{helpSectionText.section2.label}}
            </p>
            <ul class="bulleted-list mt-4">
              <li
                v-for="(item, index) in helpSectionText.section2.items"
                class="mt-2"
                :key="index"
                v-html="item"
              />
            </ul>

            <p class="help-section-title font-weight-bold mt-4">
              {{helpSectionText.section3.label}}
            </p>
            <ul class="bulleted-list mt-4">
              <li
                v-for="(item, index) in helpSectionText.section3.items"
                class="mt-2"
                :key="index"
                v-html="item"
              />
            </ul>
          </template>
        </HelpSection>

        <!-- Confirm Memorandum Completion -->
        <section id="memorandum-confirm-section" class="section-container">
          <header id="memorandum-confirm-header">
            <label>Confirm Memorandum Completion</label>
          </header>

          <div
            v-if="confirmSectionContent"
            class="mt-4"
            :class="{ 'invalid-section': invalidMemorandumSection && !hasRulesConfirmed }"
          >
              <v-form ref="confirmMemorandumChk">
                <v-checkbox
                  id="memorandum-chk-confirm"
                  class="chk-memorandum mt-0 pt-0"
                  v-model="confirmed"
                  hide-details
                  :rules="confirmCompletionMemorandum"
                  :label="confirmSectionContent[0]"
                />
                <ul>
                  <li class="mt-4">
                    <v-row no-gutters>
                      <v-icon>mdi-circle-small</v-icon>
                        <p class="mb-0 ml-2" v-html="confirmSectionContent[1]"/>
                        <div class="memorandum-coop-name pl-8 font-weight-bold">{{getNameRequestLegalName}}</div>
                    </v-row>
                  </li>
                  <li class="mt-1" v-for="text in confirmSectionContent.slice(2)" :key="text">
                    <v-row no-gutters>
                      <v-icon>mdi-circle-small</v-icon>
                      <v-col cols="11">
                        <p class="mb-0 mt-4 ml-2">
                          {{text}}
                        </p>
                      </v-col>
                    </v-row>
                  </li>
                </ul>
              </v-form>
          </div>
        </section>

        <v-divider class="mx-4 my-2" />

        <!-- Upload Memorandum -->
        <UploadRulesMemorandum
          :invalidSection='invalidMemorandumSection'
          inputFileLabel='Memorandum of Association'
          :isMemorandum="true"
        />
        <v-row id="memorandum-upload-buttons" no-gutters class="justify-end pr-8 pb-8">
          <v-btn large color="primary" class="mr-2" @click="saveRules()">
            <span>Done</span>
          </v-btn>
          <v-btn large outlined color="primary" @click="resetRules()">
            <span>Cancel</span>
          </v-btn>
        </v-row>
      </div>
      <div v-else>

        <!-- View Mode -->
        <section class="section-container">
          <v-row no-gutters>
            <v-col cols="10">
              <v-icon color="appDkBlue" class="mt-n1">mdi-file-pdf-outline</v-icon>
              <a href='https://www.google.ca'
                id="memorandum-pdf-download"
                download
                class="ml-1"
              > {{ getMemorandum.name }}
              </a>
            </v-col>
            <v-col cols="2" class="pt-0 mt-n2 align-right">

              <!-- Actions -->
              <div class="actions mr-4">
                <v-btn
                  text color="primary"
                  id="memorandum-undo"
                  class="undo-action"
                  @click="resetMemorandum()"
                >
                  <v-icon small>mdi-undo</v-icon>
                  <span>Undo</span>
                </v-btn>

                <!-- Drop Down Actions -->
                <span class="more-actions">
                  <v-menu
                    offset-y left nudge-bottom="4"
                    v-model="dropdown"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text small color="primary"
                        id="memorandum-more-actions"
                        v-on="on"
                      >
                        <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        id="memorandum-more-actions-edit"
                        class="v-list-item"
                        @click="isEditingMemorandum = true; dropdown = false"
                      >
                        <v-list-item-subtitle>
                          <v-icon small color="primary">mdi-pencil</v-icon>
                          <span class="drop-down-action ml-1">Change</span>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </span>
              </div>
            </v-col>
            <v-chip x-small label color="primary" text-color="white">
              CHANGED
            </v-chip>
          </v-row>
        </section>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ActionBindingIF, RulesMemorandumResourceIF } from '@/interfaces'
import { ItemTypes, PdfPageSize } from '@bcrs-shared-components/enums'
import { FileUploadMixin } from '@bcrs-shared-components/mixins'
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'
import { FormIF } from '@bcrs-shared-components/interfaces'
import HelpSection from '../HelpSection.vue'
import UploadRulesMemorandum from './UploadRulesMemorandum.vue'

@Component({
  components: {
    FileUploadPreview,
    HelpSection,
    UploadRulesMemorandum
  }
})
export default class Memorandum extends Mixins(FileUploadMixin) {
  $refs!: {
    confirmMemorandumChk: FormIF
  }

  protected dropdown = false
  protected confirmed = false
  protected helpToggle = false
  protected isEditingRules = false

  @Getter getNameRequestLegalName!: string
  @Getter getMemorandum!: any
  @Getter getMemorandumResource!: RulesMemorandumResourceIF
  @Getter invalidMemorandumSection!: boolean

  @Action setMemorandum!: ActionBindingIF
  @Action setMemorandumValidity!: ActionBindingIF

  // Enum for template
  readonly ItemTypes = ItemTypes
  readonly PdfPageSize = PdfPageSize

  private get documentURL (): string {
    return sessionStorage.getItem('BASE_URL') +
      `files/cooperative_sample_memorandum.pdf`
  }

  private confirmCompletionMemorandum = [
    (v) => { return !!v }
  ]

  /* Undo and cancel use this to revert the store */
  private resetMemorandum (): void {
    // this.setRules(this.getEntitySnapshot.businessInfo)
  }

  /* Saves the values to the store */
  private saveRules (): void {
    this.isEditingRules = true
  }

  /* Assumes the data is already saved in the store */
  created (): void {
    this.confirmed = this.getMemorandum?.confirmed
  }

  get helpSectionHeader (): string {
    return this.getMemorandumResource?.helpSection?.header
  }

  get helpSectionText (): string {
    return this.getMemorandumResource?.helpSection?.helpText
  }

  get confirmSectionContent (): string[] {
    return this.getMemorandumResource?.confirm
  }

  @Watch('confirmed')
  private hasValidationChanged (): void {
    this.setMemorandum({
      ...this.getMemorandum,
      confirmed: this.confirmed
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

header {
  p {
    padding-top: 0.5rem;
  }
}

ul {
  list-style: none;
  color: $gray7;
}

.upload-memorandum-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-blue;
}

.memorandum-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  #memorandum-help-header {
    display: flex;
    justify-content: center;
  }

  h2, h4 {
    padding: 1rem 0;
  }

  u {
    display: flex;
    direction: rtl;
  }

  a {
    text-decoration: none;
  }
}

::v-deep #memorandum-confirm-section {
  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input .error--text {
    color: $app-lt-gray !important;
  }
}

.chk-memorandum {
  color: $gray9;

  ::v-deep {
    .theme--light.v-icon {
      color: $gray9;
    }
    .v-label {
      line-height: 1.5rem;
      font-weight: normal;
      color: $gray7;
    }
  }
}

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
}

.memorandum-coop-name {
  display: block;
  min-width: 100%
}

.actions {
  position: absolute;
  right: 0;

  .undo-action {
    border-right: 1px solid $gray1;
  }

  .v-btn {
    min-width: 0.5rem;
  }
}

#memorandum-confirmation-buttons {
  //  ensure both Done and cancel buttons are the same width
  .v-btn {
    min-width: 86px;
  }
}

#memorandum-pdf-download {
  text-decoration:none;
}
</style>
