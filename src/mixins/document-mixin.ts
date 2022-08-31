import { AxiosResponse } from 'axios'
import { Component, Vue } from 'vue-property-decorator'
import { axios } from '@/utils'
import { DocumentUpload } from '@/interfaces'

@Component({})
export default class DocumentMixin extends Vue {
    readonly UPLOAD_FAILED_MESSAGE = 'An error occurred while uploading.  Please try again.'
    readonly MAX_FILE_SIZE = 30 * 1024 // 30 MB in KB
    readonly pageSizeDict = {
      'LETTER': {
        'pointsPerInch': 72,
        'width': 8.5,
        'height': 11,
        'validationErrorMsg': 'Document must be set to fit onto 8.5” x 11” letter-size paper'
      }
    }

    async getPresignedUrl (fileName: string): Promise<DocumentUpload> {
      const url = `documents/${fileName}/signatures`
      return axios.get(url)
        .then(response => {
          const data = response?.data
          if (!data) {
            throw new Error('Invalid API response')
          }
          return data
        }).catch(error => {
          console.log('Get presigned url error =', error) // eslint-disable-line no-console
          throw error
        })
    }

    async uploadToUrl (url: string, file: File, key: string, userId: string): Promise<AxiosResponse> {
      const options = {
        headers: {
          'Content-Type': file.type,
          'x-amz-meta-userid': `${userId}`,
          'x-amz-meta-key': `${key}`,
          'Content-Disposition': `attachment; filename=${file.name}`
        }
      }
      return axios.put(url, file, options)
        .then(response => {
          return response
        }).catch(error => {
          return error.response
        })
    }
}
