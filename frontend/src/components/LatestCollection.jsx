
import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {

    const { products } = useContext(ShopContext)

    const latestProducts = useMemo(() => {

        if (!products || products.length === 0) {
            return []
        }

        // 1. Trouver les vêtements
        const clothingProducts = products.filter(
            item =>
                item.subCategory !== 'Bags' &&
                item.subCategory !== 'Shoes'
        )

        // 2. Trouver le premier sac enregistré
        const firstBag = products
            .filter(item => item.subCategory === 'Bags')
            .sort((a, b) => a.date - b.date)[0]

        // 3. Trouver la première chaussure enregistrée
        const firstShoe = products
            .filter(item => item.subCategory === 'Shoes')
            .sort((a, b) => a.date - b.date)[0]

        // 4. Construire la collection
        const selectedProducts = [
            ...clothingProducts.slice(0, 2)
        ]

        // Position 3 : premier sac
        if (firstBag) {
            selectedProducts.push(firstBag)
        }

        // Position 4 : première chaussure
        if (firstShoe) {
            selectedProducts.push(firstShoe)
        }

        // 5. Compléter avec les autres produits
        const selectedIds = new Set(
            selectedProducts.map(item => item._id)
        )

        const remainingProducts = products.filter(
            item => !selectedIds.has(item._id)
        )

        // Maximum 10 produits
        return [
            ...selectedProducts,
            ...remainingProducts
        ].slice(0, 10)

    }, [products])

    return (
        <div className='my-10'>

            <div className='text-center py-8 text-3xl'>

                <Title
                    text1={"LATEST"}
                    text2={"COLLECTION"}
                />

                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Discover our latest collections,
                    featuring fresh styles made for every occasion.
                </p>

            </div>

            {/* PRODUCTS GRID */}

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>

                {latestProducts.map((item) => (

                    <ProductItem
                        key={item._id}
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                    />

                ))}

            </div>

        </div>
    )
}

export default LatestCollection
