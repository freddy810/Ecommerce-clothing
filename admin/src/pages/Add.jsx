import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestSeller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])

  // Tailles des vêtements
  const clothingSizes = ['S', 'M', 'L', 'XL', 'XXL']

  // Pointures des chaussures adultes
  const adultShoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

  // Pointures des chaussures enfants
  const kidsShoeSizes = ['26', '27', '28', '29', '30', '31', '32', '33', '34', '35']

  // Déterminer les tailles disponibles
  const availableSizes = subCategory === 'Shoes' ? category === 'Kids' ? kidsShoeSizes : adultShoeSizes : clothingSizes

  // Sélectionner ou désélectionner une taille
  const toggleSize = (size) => { setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]) }

  // Changement de catégorie
  const handleCategoryChange = (e) => { setCategory(e.target.value); setSizes([]) }

  // Changement de sous-catégorie
  const handleSubCategoryChange = (e) => { setSubCategory(e.target.value); setSizes([]) }

  // Enregistrement du produit
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestSeller', bestSeller)

      // Taille unique automatique pour les sacs
      const productSizes = subCategory === 'Bags' ? ['One Size'] : sizes

      // Vérification des tailles
      if (productSizes.length === 0) {
        toast.error('Please select at least one size')
        return
      }

      formData.append('sizes', JSON.stringify(productSizes))

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)

        // Réinitialisation du formulaire
        setName('')
        setDescription('')
        setPrice('')
        setSizes([])
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setBestSeller(false)

      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* UPLOAD DES IMAGES */}
      <div>
        <p className="mb-2">Upload Image</p>

        <div className="flex gap-2">
          <label htmlFor="image1">
            <img className="w-20 cursor-pointer" src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="Upload 1" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" accept="image/*" hidden />
          </label>

          <label htmlFor="image2">
            <img className="w-20 cursor-pointer" src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="Upload 2" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" accept="image/*" hidden />
          </label>

          <label htmlFor="image3">
            <img className="w-20 cursor-pointer" src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="Upload 3" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" accept="image/*" hidden />
          </label>

          <label htmlFor="image4">
            <img className="w-20 cursor-pointer" src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="Upload 4" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" accept="image/*" hidden />
          </label>
        </div>
      </div>

      {/* NOM DU PRODUIT */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] py-2 px-3" type="text" placeholder="Type here" required />
      </div>

      {/* DESCRIPTION */}
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] py-2 px-3" placeholder="Write product description" />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        {/* CATÉGORIE */}
        <div>
          <p className="mb-2">Product category</p>
          <select value={category} onChange={handleCategoryChange} className="w-full px-3 py-2">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* SOUS-CATÉGORIE */}
        <div>
          <p className="mb-2">Sub category</p>
          <select value={subCategory} onChange={handleSubCategoryChange} className="w-full px-3 py-2">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
            <option value="Bags">Bags</option>
            <option value="Shoes">Shoes</option>
          </select>
        </div>

        {/* PRIX */}
        <div>
          <p className="mb-2">Product price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full px-3 py-2 sm:w-[120px]" type="number" min="0" step="0.01" placeholder="25" required />
        </div>
      </div>

      {/* GESTION DYNAMIQUE DES TAILLES */}
      <div>
        <p className="mb-2">{subCategory === 'Shoes' ? 'Shoe sizes' : subCategory === 'Bags' ? 'Bag size' : 'Product sizes'}</p>
        {
          subCategory === 'Bags' ? (
            // SACS : TAILLE UNIQUE
            <div className="bg-green-100 px-4 py-2 rounded">
              <p className="text-green-800">One Size</p>
            </div>

          ) : (

            // VÊTEMENTS ET CHAUSSURES
            <div className="flex flex-wrap gap-3">
              {
                availableSizes.map((size) => (
                  <div key={size} onClick={() => toggleSize(size)} className={`px-3 py-1 cursor-pointer   rounded transition-colors   ${sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'} `}>
                    <p>{size}</p>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>

      {/* BESTSELLER */}
      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestSeller(prev => !prev)} checked={bestSeller} type="checkbox" id="bestSeller" />
        <label className="cursor-pointer" htmlFor="bestSeller">Add to bestseller</label>
      </div>

      {/* BOUTON AJOUTER */}
      <button className="w-28 py-3 mt-4 bg-black text-white" type="submit">ADD</button>
    </form>
  )
}

export default Add
