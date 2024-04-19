import axios from 'axios'
import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import isUrl from 'is-url'
import crypto from 'crypto'


interface FinalResult {
  ok: boolean
  message?: string
  gellery_edit?: string
  files?: any[]
}
interface Token {
  ok: boolean
  token_id: number
  token_secret: string
  gallery_id: string
  gallery_secret: string
  message?: string
}
interface Images {
  filename: string
  buffer: Buffer
}

class Imgbox {
  token!: {
    token_id: number
    token_secret: string
    gallery_id: string
    gallery_secret: string
  }
  client: AxiosInstance
  csrf!: string
  cookie!: string
  config!: {
    headers: {
      'X-CSRF-Token': string
      Cookie: string
    }
  }
  constructor() {
    this.client = axios.create({ baseURL: 'https://imgbox.com' })
  }

  setConfig = (csrf: string, cookie: string): void => {
    this.csrf = csrf
    this.cookie = cookie
  }

  getToken = async (): Promise<void> => {
    const data = {
      gallery: true,
      gallery_title: '',
      comments_enabled: 0,
    }
    const config = {
      headers: {
        'X-CSRF-Token': this.csrf,
        Cookie: this.cookie,
      },
    }

    this.config = config
    const response = await this.client.post(
      '/ajax/token/generate',
      data,
      config
    )
    const result = response.data as Token
    if (!result.ok) throw new Error(result.message)
    const { token_id, token_secret, gallery_id, gallery_secret } = result
    this.token = { token_id, token_secret, gallery_id, gallery_secret }
  }

  getAuthenticityToken = async (): Promise<void> => {
    const response = await this.client.get('/')
    const csrf = response.data
      .split('input name="authenticity_token" type="hidden" value="')[1]
      .split('"')[0]
    const cookie =
      response.headers['set-cookie']![1].split(';')[0] + '; request_method=POST'
    this.setConfig(csrf, cookie)
  }

  upload = async (images: Images[]): Promise<FinalResult> => {
    const form = new FormData()

    form.append('token_id', this.token.token_id)
    form.append('token_secret', this.token.token_secret)
    form.append('content_type', 2)
    form.append('thumbnail_size', '100c')
    form.append('gallery_id', this.token.gallery_id)
    form.append('gallery_secret', this.token.gallery_secret)
    form.append('comments_enabled', 0)

    for (const image of images) {
      form.append('files[]', image.buffer, image.filename)
    }

    const config = {
      headers: {
        ...form.getHeaders(),
        ...this.config.headers,
        'User-Agent':
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'X-Requested-With': 'XMLHttpRequest',
        Origin: 'https://imgbox.com',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        DNT: 1,
        Connection: 'keep-alive',
        Referer: 'https://imgbox.com/',
        'Sec-GPC': 1,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
    try {
      const { data } = await this.client.post('/upload/process', form, config)
      const result = {
        ok: true,
        gallery_edit: `https://imgbox.com/gallery/edit/${this.token.gallery_id}/${this.token.gallery_secret}`,
        ...data,
      }
      return result
    } catch (error) {
      console.error(error)
      return {
        ok: false,
        message: (error as Error).message,
      }
    }
  }

  // IDK what kind of type definition I had to fill in this function
  // Dear future me forgive meeee :'<
  init = async (): Promise<Function> => {
    await this.getAuthenticityToken()
    await this.getToken()
    return this.upload
  }
}


interface Upload {
  code: number
  data: any[]
}

export const toFormatArray =  function (data: any): Upload {
  // data = 'https://url.images'
  const validFormatedUrlString = typeof data === 'string' && isUrl(data)
  if (validFormatedUrlString) {
    return {
      code: 1,
      data: [data],
    }
  }

  // data = ['https://', 'http://', 'https://']
  const isArrayOfUrlString = data.every(isUrl)
  if (isArrayOfUrlString) {
    return {
      code: 1,
      data,
    }
  }

  // data = [{ filename: 'asda.jpg', url: 'https://' }, { filename: 'asda.jpg', url: 'https://'}]
  const isObjectWithUrl = data.every(
    (value: { filename: string; url: string }) => {
      return value.filename && isUrl(value.url)
    }
  )
  if (isObjectWithUrl) {
    return {
      code: 2,
      data,
    }
  }

  // data = [{ filename: 'asda.jpg', buffer: Buffer }, { filename: 'asda.jpg', buffer: Buffer }]
  const isObjectWithBuffer = data.every(
    (value: { filename: any; buffer: Buffer }) => {
      return value.filename && Buffer.isBuffer(value.buffer)
    }
  )
  if (isObjectWithBuffer) {
    return {
      code: 3,
      data,
    }
  }
  // data = [ Buffer, Buffer, Buffer ]
  const isArrayOfBuffer = data.every((value: { buffer: Buffer }) => {
    return Buffer.isBuffer(value.buffer)
  })
  if (isArrayOfBuffer) {
    return {
      code: 3,
      data: data.map((buffer: Buffer) => {
        return {
          filename: crypto.randomUUID() + '.jpg',
          buffer,
        }
      }),
    }
  }

  // data = Buffer
  const isBuffer = Buffer.isBuffer(data)
  if (isBuffer) {
    return {
      code: 3,
      data: [
        {
          filename: crypto.randomUUID() + '.jpg',
          buffer: data,
        },
      ],
    }
  }

  return {
    code: 0,
    data: [],
  }
}

interface Images {
  filename: string
  buffer: Buffer
}
interface Url {
  filename: string
  url: string 
}
type Files =
  | string[]
  | string
  | Buffer[]
  | Buffer
  | Images[]
  | Images
  | Url[]
  | Url

const _imgbox = new Imgbox()

const getImagesList = async (list: string[]): Promise<Images[]> => {
  let result = []
  for (const image of list) {
    const response = await axios.get(image, {
      responseType: 'arraybuffer',
    })
    const buffer = response.data
    try {
      const filename = response.headers['content-disposition']
        .split('filename="')[1]
        .split('"')[0]
      result.push({ buffer, filename })
    } catch (error) {
      const filename = crypto.randomUUID() + '.jpg'
      result.push({ buffer, filename })
    }
  }

  return result
}
export interface Result {
  ok: boolean
  gallery_edit: string
  files?: UploadedFile[],
  message?: string,
}

export interface UploadedFile {
  id: string
  slug: string
  name: string
  name_html_escaped: string
  created_at: Date
  created_at_human: string
  updated_at: Date
  gallery_id: string
  url: string
  original_url: string
  thumbnail_url: string
  square_url: string
  selected: boolean
  comments_enabled: number
  comments_count: number
}


export const Uploader =  async (images: Files): Promise<Result> => {
  const { code, data } = toFormatArray(images)
  if (!code) throw new Error('Invalid input type')

  const upload = await _imgbox.init()

  let imageList
  switch (code) {
    case 1:
      imageList = await getImagesList(data)
      break
    case 2:
      const listBuffer = await getImagesList(
        data.map((value: { url: string }) => {
          return value.url
        })
      )
      imageList = listBuffer.map(({ buffer }, index) => ({
        filename: data[index].filename,
        buffer,
      }))
      break
    case 3:
      imageList = data
      break
  }

  const result = await upload(imageList)
  return result
}


export default Uploader;


