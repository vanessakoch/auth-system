const jwt = require('jsonwebtoken');

const secret = '4e7994c1396e90bf45b9fcddbaa87c8b62add66223135cf227e200ce3dab7c8f';

exports.sign = payload => jwt.sign(payload, secret, { expiresIn: 1800 });
exports.verify = token => jwt.verify(token, secret, (err, decoded) => {
  if (err) {
    return { message: "Token não encontrado" };
  } else {
    return decoded;
  }
});
