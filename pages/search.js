import React,{useEffect, useState} from 'react'
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import DetailsProduct from '../components/layout/DetailsProduct';
import useProducts from '../hooks/useProducts';

export default function Search() {
  const {query:{q}}=useRouter();
  const {products}=useProducts('createdAt');
  const [result,setResult]=useState([]);

  useEffect(() => {
    if(q){
      const search=q.toLowerCase();

      const filtro=products.filter((product)=>{
        return (product.name.toLowerCase().includes(search) /* || product.description.toLowerCase().includes(search) */);
      });
      console.log(search,filtro);
      setResult(filtro);
    }
  }, [q,products]);


  return (
    <>
    <Layout>
      <div className="listado-productos">
        <div className="contenedor">
          <ul className="bg-white">
            {result.map((product)=>(
              <DetailsProduct key={product.id} product={product}/>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
    </>
    
  )
}
