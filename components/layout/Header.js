import React,{useContext} from 'react';
import Search from '../iu/Search';
import Link from 'next/link';
import Navigation from './Navigation';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import Boton from '../iu/Boton';
import {FirebaseContext} from '../../firebase';
import Router from 'next/router';

const HeaderContainer=styled.div`
max-width:1200px;
width:95%;
margin:0 auto;
@media (min-width:768px){
    display:flex;
    justify-content:space-between;
}
`;

const Logo=styled.p`
color:var(--orange);
font-size:4rem;
line-height:0;
font-weight:700;
font-family:'Roboto Slab', serif;
margin-right:2rem;
cursor: pointer;
`


const Header = () => {
    const {user,firebase}=useContext(FirebaseContext);
    const logoutSession=()=>{
        firebase.logout();
        Router.push('/login');
    }
    return (
       <>
       <header css={css`
       border-bottom:2px solid var(--gris3);
       padding:1rem 0;
       `}>
           <HeaderContainer>
               <div css={css`
               display:flex;
               align-items:center;`}>
                   <Link href="/"><Logo>F</Logo></Link>
                   <Search/>
                   <Navigation/>
               </div>
               <div css={css`
               display:flex;
               align-items:center;
               `}>
                    {/* menu de administracion */}
                    {user?(
                    <>
                    <p css={css`margin-right:2rem;`}>Hola : {user.displayName}</p>
                    <Boton bgColor="true" onClick={()=>logoutSession()}>Cerrar Sesión</Boton>
                    </>):(
                        <>
                         <Link href="/login"><Boton bgColor="true">Login</Boton></Link>
                         <Link href="/create-account"><Boton>Crear Cuenta</Boton></Link>
                        </>
                    )}
               </div>
           </HeaderContainer>
       </header>
       </>
    );
}

export default Header;
