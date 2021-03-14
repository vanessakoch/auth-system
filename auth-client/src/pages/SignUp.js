import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import api from "../services/api";
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Vanessa
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, handleSubmit } = useForm();

  const history = useHistory();

  async function onSubmit() {
    const user = {
      full_name,
      email,
      password,
    }

    if (full_name !== '' && email !== '' && password !== '') {

      const response = await api.post('email', { email })

      if (!response.data.exist) {
        const response = await api.post('signup', user);

        if (response.status === 200) {
          history.push('/');
          alert("Cadastro salvo com sucesso!");
        } else {
          alert("Erro ao cadastrar usuario");
        }
      } else {
        alert("Este e-mail ja possui cadastro");
      }
    } else {
      alert("Por favor, preencha todos os dados!");
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Cadastrar usuário
          </Typography>


          <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
            <TextField
              autoComplete="fullName"
              name="fullName"
              variant="outlined"
              required
              fullWidth
              ref={register}
              id="fullName"
              value={full_name}
              label="Nome completo"
              autoFocus
              onChange={e => setFullName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              value={email}
              ref={register}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              ref={register}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Cadastrar
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/" variant="body2">
                  {"Já tem uma conta? Entrar"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}