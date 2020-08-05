import React,{ useState, useContext } from 'react';
import Layout from '../components/layout/Layout'
import { Form,Item,InputSubmit,Error } from '../components/iu/Form'
import { css } from '@emotion/core'
import {FirebaseContext} from '../firebase';
import { validationCreateProduct } from '../validation';
import useValidation from '../hooks/useValidation';
import { useRouter } from 'next/router';
import FileUploader from "react-firebase-file-uploader";
import PageError404 from '../components/layout/404';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_STATE={
  name:'',
  enterprise:'',
/*   photo:'', */
  url:'',
  description:''
}

export default function NewProduct() {
  const [error,setError]=useState(false);
  const {user,firebase}=useContext(FirebaseContext);
  const {errors,handleBlur,handleChange,handleSubmit,values}=useValidation(INITIAL_STATE,validationCreateProduct,create);
  const {name,enterprise,url,description}=values;
  const router=useRouter();
  const [file,setFile]=useState(null);

  async function create(){
    try {
      if(!user){
        return router.push('/login');
      }
      if(!file){
        return router.push('/login');
      }

      const {nameUuidPhoto,url:urlPhoto}=await uploadPhoto();
    
      const product={
        name,enterprise,url,description,votes:0,comments:[],createdAt:Date.now(),urlPhoto,
        filename:nameUuidPhoto,
        creator:{id:user.uid,name:user.displayName},
        haveVoted:[]
      }
      
      await firebase.db.collection('product').add(product);
      console.log('create product',product);
      return router.push('/');
      
    } catch (err) {
      console.log('err create product',err.message);
      setError(err.message);
    }

  }

  const handleChangeFile=(e)=>{
    const file=e.target.files[0];
    setFile(file);
  }

  const uploadPhoto=async ()=>{
    const nameUuidPhoto=`${uuidv4()}-${file.name}`;
    await firebase.storage.ref('product').child(nameUuidPhoto).put(file);
    const url=await firebase.storage.ref("product").child(nameUuidPhoto).getDownloadURL();
    return {nameUuidPhoto,url};
  }


  

  return (
    <>
    <Layout>
      {!user?<PageError404/>:(
        <>
        <h1 css={css`text-align:center;margin-top:5rem;`}>New Product</h1>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <fieldset>
          <legend>Información General</legend>
        
        <Item>
          <label htmlFor="name">Nombre :</label>
          <input type="text" placeholder="Ingrese nombre del Producto" name="name" id="name" onChange={handleChange} value={name} onBlur={handleBlur}/>
        </Item>
        {errors.name&&<Error>{errors.name}</Error>}

        <Item>
          <label htmlFor="enterprise">Empresa :</label>
          <input type="text" placeholder="Ingrese nombre de la empresa" name="enterprise" id="enterprise" onChange={handleChange} value={enterprise} onBlur={handleBlur}/>
        </Item>
        {errors.enterprise&&<Error>{errors.enterprise}</Error>}

        <Item>
          <label htmlFor="name">Photo :</label>
         <input type="file" name="photo" id="photo" onChange={handleChangeFile}/>
        </Item>
     
      
        <Item>
          <label htmlFor="url">Url :</label>
          <input type="url" placeholder="Ingrese nombre del Producto" name="url" id="url" onChange={handleChange} value={url} onBlur={handleBlur}/>
        </Item>
        {errors.url&&<Error>{errors.url}</Error>}
        </fieldset>


        <fieldset>
          <legend>Sobre tu Producto</legend>
          <Item>
          <label htmlFor="description">Description :</label>
          <textarea placeholder="Ingrese descripción del Producto" name="description" id="description" onChange={handleChange} value={description} onBlur={handleBlur}/>
        </Item>
        {errors.description&&<Error>{errors.description}</Error>}
        </fieldset>
       
        {error&&<Error>{error}</Error>}
        <InputSubmit type="submit" value="Crear Producto"/>

      </Form>
        </>
      )}
    </Layout>
    </>
    
  )
}
