

module.exports = {
  wx: {
    appid: ''
    // secret: 'sss微信公众号秘钥'
  },
  origin: '',
  // 测试开发 都是false ，  正式 true
  // isProduction: false,
  // // 光成
  // // source: ''
  // // baseURL: ''
  // // 测试
  // source: ''
  // baseURL: ''

  // // 开发/测试环境 上传图片参数
  // uploadParamsUser: {
  //   OSSAccessKeyId: '',
  //   host: ''
  //   policy: '',
  //   Signature: '',
  //   showUrl: ''
  //   saveUrl: '/images/user/',
  //   key: 'images/user/'
  // },
  // // 开发/测试版 图片视频访问前缀
  // baseImageUrl: ''

  // 以下都是正式版需要打开的配置
  isProduction: true,
  source: '',
  baseURL: '',
  // 正式环境 上传图片参数
  uploadParamsUser: {
    OSSAccessKeyId: '',
    host: '',
    Signature: '',
    showUrl: '',
    key: ''
  },
  // 正式版 图片视频访问前缀
  baseImageUrl: ''
}
