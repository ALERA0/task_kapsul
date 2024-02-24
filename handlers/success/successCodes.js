const { StatusCodes } = require("http-status-codes");

const successCodes = {
  USER_CREATED_SUCCESSFULLY: {
    code: StatusCodes.CREATED,
    message: "Kullanıcı başarıyla oluşturuldu.",
  },
  USER_LOGGED_IN_SUCCESSFULLY:{
    code: StatusCodes.OK,
    message: "Kullanıcı başarıyla giriş yaptı."
  },
  USERS_FETCHED_SUCCESSFULLY:{
    code: StatusCodes.OK,
    message: "Kullanıcılar başarıyla getirildi."
  },
  USER_FOLLOWED_SUCCESSFULLY:{
    code: StatusCodes.OK,
    message: "Kullanıcı başarıyla takip edildi."
  },
  USER_UNFOLLOWED_SUCCESSFULLY:{
    code: StatusCodes.OK,
    message: "Kullanıcı takipten başarıyla çıkarıldı."
  },
  POST_FETCHED_SUCCESSFULLY:{
    code: StatusCodes.OK,
    message: "Gönderiler başarıyla getirildi."
  },
  POST_CREATED_SUCCESSFULLY:{
    code: StatusCodes.CREATED,
    message: "Gönderi başarıyla oluşturuldu."
  },
  USER_FETCHED_SUCCESSFULLY:{
    code: StatusCodes.OK,
    message: "Kullanıcı başarıyla getirildi."
  },
  POST_LIKED_SUCCESSFULLY:{
    code: StatusCodes.OK,
    message: "Gönderi başarıyla beğenildi."
  },
  POST_UNLIKED_SUCCESSFULLY:{
    code: StatusCodes.OK,
    message: "Gönderi beğenisi başarıyla kaldırıldı."
  }
};


module.exports = { successCodes };