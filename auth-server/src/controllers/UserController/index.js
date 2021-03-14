const fs = require('fs');
const data = require('../../../data.json');

const { sign, verify } = require('./../../config/jwt');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UsersController {
  async index(request, response) {
    response.json({ message: 'tudo ok' })
  }

  async verifyAuth(request, response, next) {
    const token = request.headers['x-access-token'];
    const payload = await verify(token);

    if (!payload || !payload.userId) {
      return response.json({ message: "Sem autorização" })
    }

    request.userId = payload.userId;
    next();
  }

  async signin(request, response) {
    if (request.body.email && request.body.password) {
      const email = request.body.email;
      const password = request.body.password;
      const userEmail = data.users.find(user => user.email === email);

      if (userEmail) {
        bcrypt.compare(password, userEmail.password, function (err, result) {
          if (result) {
            const token = sign({ userId: userEmail.id })
            response.json({ auth: true, token })
          } else {
            response.json({ message: 'Falha de autenticação' });
          }
        });
      } else {
        response.json({ message: 'Falha de autenticação' });
      }
    } else {
      response.json({ message: 'Falha de autenticação' });
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

  async list(request, response) {
    const user = data.users.find(user => user.id === request.userId)
    if (user) {
      response.json({ access: true, userId: user.id })
    }
  }
}

module.exports = UsersController;
