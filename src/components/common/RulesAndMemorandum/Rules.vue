<template>
  <div id="upload-rules">

    <v-card flat>

      <!-- Header -->
      <article class="header-container section-container">
          <v-icon color="appDkBlue">mdi-format-list-text</v-icon>
          <label class="font-weight-bold pl-2">Rules</label>
      </article>

      <div v-if="!isEditingRules">

        <!-- Edit Mode -->
        <!-- Instructional Text -->
        <article class="instructional-text section-container">
          <strong> Complete, sign, and date </strong> your new Rules of Association before uploading.
          Your historical rules will always be available on your dashboard.
        </article>

        <!-- Help section - Overrides the default content (contact information) -->
        <HelpSection
          v-if="getRulesResource"
          class="my-2 px-8"
          :overrideHeader="helpSectionHeader"
        >
          <template v-slot:overrideContent>
              <p class="help-section-title font-weight-bold mt-4">
                {{helpSectionText.section1.label}}
              </p>
              <ul class="bulleted-list mt-4">
                <li
                  v-for="(item, index) in helpSectionText.section1.items"
                  class="mt-1"
                  :key="index"
                  v-html="item"
                />
              </ul>

              <p class="help-section-title font-weight-bold mt-4">
                {{helpSectionText.section2.label}}
              </p>
              <ul class="bulleted-list mt-4">
                <li
                  v-for="(item, index) in helpSectionText.section2.items"
                  :key="index"
                >
                  <span v-if="item.type === ItemTypes.TEXT" v-html="item.value"/>
                  <template v-if="item.type === ItemTypes.PARTIAL_ITEMS">
                    <template v-for="(partialItem, index) in item.value">
                      <span
                        v-if="partialItem.type === ItemTypes.TEXT"
                        :key="index"
                        v-html="partialItem.value"
                      />
                      <a
                        v-if="partialItem.type === ItemTypes.LINK"
                        :key="index"
                        :href="partialItem.value.href"
                        target="_blank"
                      >
                        {{partialItem.value.linkText}}
                        <v-icon dense color="primary">mdi-open-in-new</v-icon>
                      </a>
                    </template>
                  </template>
                </li>
              </ul>

              <p
                v-for="(item, index) in helpSectionText.section3.items"
                class="mt-4"
                :key="index"
                v-html="item"
              />
          </template>
        </HelpSection>

        <!-- Confirm Rules Completion -->
        <section id="rules-confirm-section" class="section-container">
          <header id="rules-confirm-header">
            <label>Confirm Rules Completion</label>
          </header>

          <div
            v-if="confirmSectionContent"
            class="mt-4"
            :class="{ 'invalid-section': invalidRulesSection && !hasConfirmed }"
          >
              <v-form ref="confirmRulesChk">
                <v-checkbox
                  id="rules-chk-confirm"
                  class="chk-rules mt-0 pt-0"
                  v-model="confirmed"
                  hide-details
                  :rules="confirmCompletionRules"
                  :label="confirmSectionContent[0]"
                />
                <ul>
                  <li class="mt-4">
                    <v-row no-gutters>
                      <v-icon>mdi-circle-small</v-icon>
                        <p class="mb-0 ml-2" v-html="confirmSectionContent[1]"/>
                        <div class="rules-coop-name pl-8 font-weight-bold">{{getNameRequestLegalName}}</div>
                    </v-row>
                  </li>
                  <li class="mt-1">
                    <v-row no-gutters>
                      <v-icon>mdi-circle-small</v-icon>
                      <v-col cols="11">
                        <p class="mb-0 mt-4 ml-2">
                          {{ confirmSectionContent[2] }}
                        </p>
                      </v-col>
                    </v-row>
                  </li>
                </ul>
              </v-form>
            </div>
        </section>

        <v-divider class="mx-4 my-2" />

        <!-- Upload Rules -->
        <UploadRulesMemorandum
          :invalidSection='invalidRulesSection'
          inputFileLabel='Rules of Association'
          note='Do not upload Housing Cooperative occupancy agreements.'
          :isMemorandum="false"
        />
        <v-row id="rules-confirmation-buttons" no-gutters class="justify-end pr-8 pb-8">
          <v-btn large color="primary" class="mr-2" @click="saveRules($event)">
            <span>Done</span>
          </v-btn>
          <v-btn large outlined color="primary" @click="resetRules($event)">
            <span>Cancel</span>
          </v-btn>
        </v-row>
      </div>
      <div v-else>

        <!-- View Mode -->
        <section id="rules-actions-section" class="section-container">
          <v-row no-gutters>
            <v-col cols="10">
              <v-icon color="appDkBlue" class="mt-n1">mdi-file-pdf-outline</v-icon>
              <a :href="urlDownload"
                id="rules-pdf-download"
                download
                class="ml-1"
              > {{ getRules.name }}
              </a>
            </v-col>
            <v-col cols="2" class="pt-0 mt-n2 align-right">

              <!-- Actions -->
              <div class="actions mr-4">
                <v-btn
                  text color="primary"
                  id="rules-undo"
                  class="undo-action"
                  @click="resetRules()"
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
                        id="rules-more-actions"
                        v-on="on"
                      >
                        <v-icon>{{dropdown ? 'mdi-menu-up' : 'mdi-menu-down'}}</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        id="rules-more-actions-edit"
                        class="v-list-item"
                        @click="isEditingRules = true; dropdown = false"
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
import { ActionBindingIF, EntitySnapshotIF, RulesMemorandumIF, RulesMemorandumResourceIF } from '@/interfaces'
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
export default class Rules extends Mixins(FileUploadMixin) {
  $refs!: {
    confirmRulesChk: FormIF
  }
  protected dropdown = false
  protected confirmed = false
  protected helpToggle = false
  protected isEditingRules = false

  @Getter getNameRequestLegalName!: string
  @Getter getRules!: RulesMemorandumIF
  @Getter getRulesResource!: RulesMemorandumResourceIF
  @Getter invalidRulesSection!: boolean
  @Getter getUserKeycloakGuid!: string // TODO: replace this
  @Getter getEntitySnapshot!: EntitySnapshotIF

  @Action setRules!: ActionBindingIF
  @Action setRulesValidity!: ActionBindingIF

  // Enum for template
  readonly ItemTypes = ItemTypes
  readonly PdfPageSize = PdfPageSize

  private confirmCompletionRules = [
    (v) => { return !!v }
  ]

  private resetRules (): void {
    this.setRules(this.getEntitySnapshot.businessInfo)
  }

  private saveRules (): void {
    this.isEditingRules = true
  }

  /* Assumes the data is already saved in the store */
  created (): void {
    this.confirmed = this.getRules?.confirmed
  }

  get helpSectionHeader (): string {
    return this.getRulesResource?.helpSection?.header
  }

  get helpSectionText (): string {
    return this.getRulesResource?.helpSection?.helpText
  }

  get confirmSectionContent (): string[] {
    return this.getRulesResource?.confirm
  }

  get urlDownload (): string {
    return this.getRules?.url
  }

  @Watch('confirmed')
  private hasValidationChanged (): void {
    this.setRules({
      ...this.getRules,
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

.upload-rules-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-blue;
}

.rules-help {
  margin: 2rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  #rules-help-header {
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

::v-deep #confirm-rules-section {
  // override default validation styling so checkbox does not turn red on validation error
  .v-input--selection-controls__input .error--text{
    color: $app-lt-gray !important;
  }
}

.chk-rules {
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

.upload-rules-vcard-title {
  font-size: $px-17;
  font-weight: bold;
}

.header-container {
  display: flex;
  background-color: $BCgovBlue5O;
}

.rules-coop-name {
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

#rules-confirmation-buttons {
  //  ensure both Done and cancel buttons are the same width
  .v-btn {
    min-width: 86px;
  }
}

#rules-pdf-download {
  text-decoration:none;
}
</style>
