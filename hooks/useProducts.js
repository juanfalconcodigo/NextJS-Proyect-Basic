import { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../firebase';


const useProducts = (order) => {
    const { firebase } = useContext(FirebaseContext);
    const [products, setProducts] = useState([]);
    const handleSnapshot = (snapshot) => {
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setProducts(products);
    }
    useEffect(() => {
        const getProduct = () => {
            firebase.db.collection('product').orderBy(order, 'desc').onSnapshot(handleSnapshot);
        }
        getProduct();
    }, []);

    return {
        products
    }

}

export default useProducts;