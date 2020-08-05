import React,{useState} from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Router from 'next/router';

const InputText=styled.input`
border:1px solid var(--gris3);
padding:1rem;
min-width:300px;
`
const Button=styled.button`
height: 3rem;
width:3rem;
display:block;
background-size:4rem;
background-image:url('static/images/buscar.png');
background-repeat:no-repeat;
position: absolute;
background-color:white;
right:1rem;
top:2px;
border:none;
text-indent:-999px;
outline:none;
&:hover{
    cursor: pointer;
}
`

const Search=()=>{
    const [search,setSearch]=useState('');
    
    const handleChange=(e)=>{
        const{name,value}=e.target;
        setSearch(value);

    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(search.trim()==='')return;
        Router.push({
            pathname:'/search',
            query:{
                q:search
            }
        });
    }

    return(
        <>
        <form css={css`display:flex;position: relative;`} onSubmit={handleSubmit}>
            <InputText type="text" placeholder="Buscar productos" onChange={handleChange}/>
            <Button type="submit">Buscar</Button>
        </form>
        </>
    )

}


export default Search;