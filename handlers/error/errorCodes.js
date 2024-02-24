const { StatusCodes } = require("http-status-codes");

const errorCodes = {
  JWT_KEY_MISSING_ERROR: {
    code: StatusCodes.UNAUTHORIZED,
    message: "Kullanıcı kimliği bulunamadı.",
  },
  INVALID_TOKEN_OR_MISSING_CREDENTIALS_ERROR: {
    code: StatusCodes.UNAUTHORIZED,
    message:
      "Kullanıcı kimliği geçersiz veya eksik. Lütfen tekrar giriş yapın.",
  },
  INVALID_USER_DATA_ERROR: {
    code: StatusCodes.BAD_REQUEST,
    message:
      "Geçersiz doğrulama ya da parametre.Kullanıcı adı , email ve şifre zorunludur.",
  },
  DUPLICATE_USER_ERROR: {
    code: StatusCodes.BAD_REQUEST,
    message: "Bu kullanıcı adı ile kayıtlı bir kullanıcı bulunmaktadır.",
  },
  DUPLICATE_EMAIL_ERROR: {
    code: StatusCodes.BAD_REQUEST,
    message: "Bu email adresi ile kayıtlı bir kullanıcı bulunmaktadır.",
  },
  INVALID_PASSWORD_LENGTH_ERROR: {
    code: StatusCodes.BAD_REQUEST,
    message: "Şifre en az 8 karakter olmalıdır.",
  },
  INVALID_EMAIL_FORMAT_ERROR: {
    code: StatusCodes.BAD_REQUEST,
    message: "Geçersiz email formatı.",
  },
  INVALID_USERNAME_FORMAT_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Kullanıcı adı en az 3 karakter olmalıdır ve sadece harf ve rakam içerebilir."
  },
  INVALID_USER_DATA_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Geçersiz kullanıcı verisi"
  },
  USER_NOT_FOUND_ERROR:{
    code: StatusCodes.NOT_FOUND,
    message: "Kullanıcı bulunamadı."
  },
  USER_ALREADY_FOLLOWED_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Kullanıcı zaten takip ediliyor."
  },
  USER_NOT_FOLLOWING_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Kullanıcı takip edilmiyor."
  },
  INVALID_INPUT_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Boş bir gönderi oluşturulamaz."
  },
  INVALID_INPUT_LENGTH_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Gönderi içeriği en fazla 280 karakter olabilir."
  },
  POST_NOT_FOUND_ERROR:{
    code: StatusCodes.NOT_FOUND,
    message: "Takip ettiğiniz kullanıcılara ait gönderi bulunamadı."
  },
  POST_ALREADY_LIKED_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Bu gönderiyi zaten beğendiniz."
  },
  POST_ALREADY_UNLIKED_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Bu gönderiyi zaten beğenmediniz."
  },
  USER_CANNOT_FOLLOW_ITSELF_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Kullanıcı kendini takip edemez."
  },
  USER_CANNOT_UNFOLLOW_ITSELF_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Kullanıcı kendini takipten çıkaramaz."
  },
  POST_ALREADY_RETWEETED_ERROR:{
    code: StatusCodes.BAD_REQUEST,
    message: "Bu gönderiyi zaten retweetlediniz."
  }
};


module.exports = { errorCodes };