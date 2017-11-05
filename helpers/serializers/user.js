exports.basic = (user) => {
  user.hash = undefined;
  user.salt = undefined;
  if (user.password) {
    user.password = undefined;
  }
  if (user.passwordToken){
    user.passwordToken = undefined;
  }
  return user;
};