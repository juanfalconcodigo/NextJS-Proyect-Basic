import React,{ useState } from 'react';
import Layout from '../components/layout/Layout'
import { Form,Item,InputSubmit,Error } from '../components/iu/Form'
import { css } from '@emotion/core'
import {firebase} from '../firebase';
import Router from 'next/router';
import { validationLogin } from '../validation';
import useValidation from '../hooks/useValidation';


const INITIAL_STATE={
  email:'',
  password:''
}

export default function Login() {
  const [error,setError]=useState(false);
  const {errors,handleBlur,handleChange,handleSubmit,values}=useValidation(INITIAL_STATE,validationLogin,login);
  const {email,password}=values;

  async function login(){
    try {
      await firebase.login(email,password);
      console.log('login');
      Router.push('/');
    } catch (err) {
      console.log('error login',err.message);
      setError(err.message);
    }
  }


  return (
    <>
    <Layout>
      <>
      <h1 css={css`text-align:center;margin-top:5rem;`}>Login</h1>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Item>
          <label htmlFor="email">Email :</label>
          <input type="text" placeholder="Ingrese su correo" name="email" id="email" onChange={handleChange} value={email} onBlur={handleBlur}/>
        </Item>
        {errors.email&&<Error>{errors.email}</Error>}

        <Item>
          <label htmlFor="password">Contraseña :</label>
          <input type="password" name="password" id="password" placeholder="Ingrese su contraseña" onChange={handleChange} value={password} onBlur={handleBlur}/>
        </Item>
        {errors.password&&<Error>{errors.password}</Error>}
        {error&&<Error>{error}</Error>}
        <InputSubmit type="submit" value="Iniciar Sesión"/>

      </Form>
      </>
    </Layout>
    </>
    
  )
}
