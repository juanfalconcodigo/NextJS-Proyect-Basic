import React,{ useState } from 'react';
import Layout from '../components/layout/Layout'
import { Form,Item,InputSubmit,Error } from '../components/iu/Form'
import { css } from '@emotion/core'
import useValidation from '../hooks/useValidation';
import {firebase} from '../firebase';
import Router from 'next/router';
import { validationCreateAccount } from '../validation';


const INITIAL_STATE={
  name:'',
  email:'',
  password:''
}

export default function CreateAccount() {
  const [error,setError]=useState(false);
  const {errors,handleChange,handleSubmit,values,handleBlur}=useValidation(INITIAL_STATE,validationCreateAccount,createAccount);
  const {name,email,password}=values;

  async function createAccount(){
    try {
      await firebase.register(name,email,password);
      console.log('creando cuenta');
      Router.push('/');
    } catch (err) {
      console.log('err user create',err.message);
      setError(err.message);
    }
  }

  return (
    <>
    <Layout>
      <>
      <h1 css={css`text-align:center;margin-top:5rem;`}>CreateAccount</h1>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Item>
          <label htmlFor="name">Nombre :</label>
          <input type="text" placeholder="Ingrese su nombre" name="name" id="name" onChange={handleChange} value={name} onBlur={handleBlur}/>
        </Item>
        {errors.name&&<Error>{errors.name}</Error>}

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
        <InputSubmit type="submit" value="Register"/>

      </Form>
      </>
    </Layout>
    </>
    
  )
}
