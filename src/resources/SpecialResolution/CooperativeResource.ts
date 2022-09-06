import { CorrectionTypes, FilingCodes, NameRequestEntityTypes, NameRequestTypes } from '@/enums/'
import { CorpTypeCd, GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module/'
import { ResourceIF } from '@/interfaces/'
import { ItemTypes } from '@bcrs-shared-components/enums'

export const CooperativeResource: ResourceIF = {
  entityReference: 'Business',
  contactLabel: 'Registered Office',
  displayName: GetCorpFullDescription(CorpTypeCd.COOP),
  nameRequestType: NameRequestEntityTypes.CP,
  addressLabel: 'Registered Office',
  filingData: {
    filingTypeCode: FilingCodes.SPECIAL_RESOLUTION,
    entityType: CorpTypeCd.COOP,
    priority: false
  },
  changeData: {
    nameChangeOptions: [
      CorrectionTypes.CORRECT_NEW_NR
    ],
    typeChangeInfo: 'You cannot change the business type of a Cooperative Association. You must form a new' +
    'business and dissolve this business once the new business is registered.',
    addressChangeInfo: 'To change addresses, please use the Change feature in the' +
    ' Office Addresses list on your business dashboard.',
    nameRequestTypes: [
      NameRequestTypes.CHANGE_OF_NAME
    ],
    specialResolution: {
      helpSection: {
        header: 'Help with Special Resolution',
        helpText: [
          'If you require assistance with adding a business partner please contact us.'
        ]
      },
      sampleFormSection: {
        header: 'Special Resolution (Form 06 COO)',
        text: `For your convenience, we have provided the special resolution form (Form 06 COO).  This form should be
          completed, signed and a printed copy retained with your other Cooperative Association records.
          Do not mail the paper form to BC Registries.  Once you have completed this form, enter the details
          from the paper form into this filing.`,
        label: 'Download the Special Resolution Form 06 COO',
        path: 'files/cooperative_sample_special_resolution_form_06.pdf'
      }
    }
  },
  certifyClause: 'Note: It is an offence to make a false or misleading statement in respect ' +
    'of a material fact in a record submitted to the Corporate Registry for filing. ' +
    'See section 200 of the Cooperative Association Act.',
  rules: {
    confirm: [
      `I confirm the following items are included as required in the Cooperative Associations Act:`,
      `The Cooperative Association name is identified <strong>exactly</strong> as follows throughout
      the rules:`,
      `Each Subscriber and Witness has signed and dated the Rules of the
      Association and their name is printed under their signature.`
    ],
    helpSection: {
      header: `Help with Rules of the Association`,
      helpText: {
        section1: {
          label: 'Each Cooperative Association must set its own rules to cover:',
          items: [
            'Governance',
            'Overarching goals, needs, and actions to fulfill its purpose',
            'Election of directors',
            'Requirements for membership',
            'Financial information management',
            'Special rights and restrictions related to investment shares',
            'How meetings are conducted'
          ]
        },
        section2: {
          label: 'The Rules need to:',
          items: [
            {
              type: ItemTypes.TEXT,
              value: `Balance the rights of individual members with the interests of the
              Cooperative Association as a whole`
            },
            {
              type: ItemTypes.PARTIAL_ITEMS,
              value: [
                {
                  type: ItemTypes.TEXT,
                  value: 'Address the requirements of '
                },
                {
                  type: ItemTypes.LINK,
                  value: {
                    linkText: 'section 13 of the Cooperative Association Act',
                    href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/99028_01#section13'
                  }
                },
                {
                  type: ItemTypes.TEXT,
                  value: ' and '
                },
                {
                  type: ItemTypes.LINK,
                  value: {
                    linkText: 'section 10 of the Cooperative Association Regulation',
                    href: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/391_2000#section10'
                  }
                }
              ]
            },
            {
              type: ItemTypes.TEXT,
              value: 'Be flexible enough to allow the Cooperative Association to respond to changing conditions'
            }
          ]
        },
        section3: {
          items: [
            `Applicants need to define their rules correctly. BC Registries is not responsible for verifying or offering
              advice about creating rules. You may want to get advice from a lawyer for help setting up your rules.`,
            'Use clear, concise, and consistent language to avoid confusion or disputes.'
          ]
        }
      }
    }
  },
  memorandum: {
    confirm: [
      `I confirm the following items are included as required in the Memorandum of Association:`,
      `The Cooperative Association name is identified <strong>exactly</strong> as follows throughout
      the memorandum:`,
      `If required, there is a Dissolution Provision in the Memorandum of Association.`,
      `The correct type of shares are used in the Memorandum of Association based on the type of
      Cooperative Association.`,
      `Each Subscriber and Witness has signed and dated the Memorandum of the
      Association and their name is printed under their signature.`
    ],
    helpSection: {
      header: `Help with Memorandum of Association`,
      helpText: {
        section1: {
          items: [
            `A memorandum should accurately reflect the intention and values of the Cooperative Association. Be detailed
              and specific, but not too restrictive. This will avoid having to make changes later.`,
            `To form a Cooperative Association, at least three subscribers who are responsible for the Cooperative
              Association's operation are required. They may be individuals or organizations such as a government,
              First Nation, corporation, business, society or another Cooperative Association.`
          ]
        },
        section2: {
          label: 'Include in the Memorandum:',
          items: [
            'The name and purpose of the Cooperative Association',
            'Restrictions on the business and powers of the Cooperative Association',
            `The authorized share capital - list the number and the classes of shares that the cooperative association
              can issue`,
            `A statement that the liability of the members or investment shareholders is limited in accordance with
              the Act`,
            'An optional statement about provisions if the Cooperative Association closes down',
            'The number, class and par value, if applicable, of shares subscribed for by the founding members'
          ]
        },
        section3: {
          label: `For Community Service Cooperative Associations that provide health, social, educational or other
            community services, include:`,
          items: [
            'A provision that the association is a Community Service Cooperative',
            'That the Association does not issue investment shares',
            'That the purpose of the Association is charitable or that it provides the services listed above'
          ]
        }
      }
    }
  }
}
