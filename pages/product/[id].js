import React,{useEffect,useContext,useState} from 'react';
import {useRouter} from 'next/router';
import { FirebaseContext } from '../../firebase';
import PageError404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale';
import { Item,InputSubmit } from '../../components/iu/Form';
import Boton from '../../components/iu/Boton';


const ContentProduct=styled.div`
@media(min-width:768px){
    display:grid;
    grid-template-columns:2fr 1fr;
    column-gap:2rem;
}
`;

const ProductCreator=styled.div`
padding:.5rem 2rem;
background-color:#DA552F;
color:#fff;
text-transform:uppercase;
font-weight:bold;
display:inline-block;
text-align:center;
`;


const Product=()=>{
    const router =useRouter();
    const {query:{id}}=router;
    
    const [product,setProduct]=useState({});
    const {firebase,user}=useContext(FirebaseContext);
    const [error,setError]=useState(false);
    const{filename,comments,id:idProduct,createdAt,description,enterprise,name,url,urlPhoto,votes,creator,haveVoted}=product;
    const[comment,setComment]=useState({});

    useEffect(()=>{
        console.log('CHANGE');
        console.log(id)
        if(id){
            getInfo(id);
        }
    },[id]);

    const handleVote=()=>{
        console.log(user.uid,haveVoted)
        if(!user)return router.push('/login');
        const newTotal=votes+1;
        //verify vote

        if(haveVoted.includes(user.uid)){
            console.log('Voto rechazado')
        return;
        }else{
            console.log('Voto aceptado');
            const newHaveVoted=[...haveVoted,user.uid];

            //db
            firebase.db.collection('product').doc(id).update({votes:newTotal,haveVoted:newHaveVoted});
            //state
            setProduct({...product,votes:newTotal,haveVoted:newHaveVoted});
        };

    }

    async function getInfo(id){
        const queryProduct=await firebase.db.collection('product').doc(id);
        const product=await queryProduct.get();
        console.log(product.data());
        //tener cuidado con el bucle que se puede producir
        /* if(product.exists){
            return setProduct({...product.data()});
        }else{
            return setError(true);
        } */
        product.exists?setProduct({...product.data()}):setError(true);
    }

    const handleChange=async(e)=>{
        const {name,value}=e.target;
        setComment({
            ...comment,
            [name]:value
        });
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!user)return router.push('/login');
        comment.userId=user.uid;
        comment.userName=user.displayName;
        const newComments=[...comments,comment];
        firebase.db.collection('product').doc(id).update({
            comments:newComments
        });
        setProduct({...product,comments:newComments});
        

    }

    const isCreator=(id)=>{
        if(creator.id===id)return true;
        return false;
    }

    const canDrop= ()=>{
        if(!user) return false;
        if(user.uid===creator.id)return true;
        return false;
    }

    const handleDropProduct=async()=>{
        if(!user) return router.push('/login');
        if(creator.id!==user.uid) return router.push('/');
        try {
            await firebase.db.collection('product').doc(id).delete();
            //delete storage
            const storage = firebase.storage;
            const storageRef = storage.ref();
            var desertRef = storageRef.child(`product/${filename}`);
            // Delete the file
            desertRef.delete().then(function() {
            // File deleted successfully
            console.log('success delete image')
            }).catch(function(error) {
            // Uh-oh, an error occurred!
            console.log('error delete image')
            });
            router.push('/');
        } catch (error) {
            console.log(error);
        }

    }


    if(Object.keys(product).length===0&&!error)return 'Cargando.....';

    
    
    return (
       
       <Layout>
            <>
           {error?<PageError404/>:(
               <div className="contenedor">
               <h1 css={css`
               margin-top:5rem;
               text-align:center;
               `}>{name}</h1>
               <ContentProduct>
                <div>
                <p>Publicado hace : {formatDistanceToNow(new Date(createdAt),{locale:es})}</p>
                <p>Por :{creator.name} de {enterprise}</p>
                <img src={urlPhoto}/>
                <p>{description}</p>
                {user&&(
                    <>
                    <h2>Agrega tu comentario :</h2>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <Item>
                        <input type="text" name="message" onChange={handleChange}/>
                    </Item>
                    <InputSubmit type="submit" value="Agregar comentario"/>
                </form>
                    </>
                )}
                <h2 css={css`
                margin:2rem 0;
                `}>Comentarios</h2>
                {comments.length===0?'Aun no hay comentarios':(
                    <ul>
                    {comments.map((comment,i)=>(
                      <li key={i} css={css`
                      border:1px solid #e1e1e1;
                      padding:2rem;
                      `}>
                          <p>{comment.message}</p>
                          <p>Escrito por: <span css={css`
                          font-weight:bold;
                          `}>
                             {' '}{comment.userName}
                              </span></p>
                              {isCreator(comment.userId)&&<ProductCreator>Es creador</ProductCreator>}
                      </li>
                     ))}
                 </ul>
                )}
               

                </div>
                <aside>
                <Boton target="_blanck" bgColor="true" href={url}>
                    Visitar Url
                </Boton>
                
                <div css={css`
                margin-top:5rem;
                `}>
                   <p css={css`
                   text-align:center;
                   `}>{votes} Votos</p>
                  {user&&(
                      <>
                       <Boton onClick={()=>handleVote()}>
                       Votar
                       </Boton>
                      </>
                  )}
                </div>

                </aside>
                </ContentProduct>
                {canDrop() && (<Boton onClick={handleDropProduct}>Eliminar Producto</Boton>)}
           </div>

           )}
           
           
           </>
       </Layout>
        
    )
}

export default Product;