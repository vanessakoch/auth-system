const fs = require('fs');
const data = require('../../data.json');

const { sign, verify } = require('./../config/jwt');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UsersController {

  async verifyAuth(request, response, next) {
    const headerAuth = request.headers.authorization;
    const token = headerAuth.split(" ")[1]

    const payload = await verify(token);

    if (!payload || !payload.userId) {
      return response.status(401).json({ message: "Sem autorização" })
    }

    request.userId = payload.userId;
    next();
  }

  async signin(request, response) {
    const [hashType, hash] = request.headers.authorization.split(' ');

    const [email, password] = Buffer.from(hash, 'base64')
      .toString()
      .split(':');

    const userEmail = data.users.find(user => user.email === email);

    if (userEmail) {
      bcrypt.compare(password, userEmail.password, function (err, result) {
        if (result) {
          const token = sign({ userId: userEmail.id })
          response.json({ auth: true, token })
        } else {
          response.status(401).json({ message: 'Falha de autenticação' });
        }
      });
    } else {
      response.status(401).json({ message: 'Falha de autenticação' });
    }

  }

  async signup(request, response) {
    let id = 1
    const { fullName, email, password } = request.body
    const lastUser = data.users[data.users.length - 1];

    if (lastUser) {
      id = lastUser.id + 1;
    };

    const user = { id, fullName, email }

    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          return response.json({ message: "Falha na criação do usuário" })
        }
        const serializedUser = {
          ...user,
          password: hash
        }

        data.users.push(serializedUser)
        const token = sign({ user: user.id })

        fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
          if (err) return response.json("Erro ao escrever o arquivo");
          return response.json({
            message: "success",
            token
          });
        });
      });
    })
  }

  show(request, response) {
    const { email } = request.body;
    const user = data.users.filter(user => user.email === email);

    if (user.length > 0) {
      return response.json({ exist: true })
    } else {
      return response.json({ exist: false })
    }
  }

  /*async list(request, response) {
    const user = data.users.find(user => user.id === request.userId)
    if (user) {
      response.json({ access: true, userId: user.id })
    }
  }*/
}

module.exports = UsersController;
