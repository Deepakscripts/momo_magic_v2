// admin/src/pages/Add/Add.jsx
import React, { useState } from 'react'
import './Add.css'
import { url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const CATEGORIES = [
  "Sizzlers",
  "Coffee",
  "Maggi",
  "Dessert",
  "Beverages",
  "Chinese Magic",
  "Soup",
  "Pasta",
  "Moburg",
  "MMC Special Dishes",
  "Chinese Magic Noodles",
  "Chinese Magic Rice",
  "Momos • Special Magic (8 pcs)",
  "Momos • Steam & Fried",
  "Momos • Tandoori (8 pcs)"
];

const Add = () => {
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: CATEGORIES[0]
  });

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: Number(data.price),
        category: data.category
      };
      const response = await axios.post(`${url}/api/food/add`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      if (response.data?.success) {
        toast.success(response.data.message || "Item added");
        setData({ ...data, name: "", description: "", price: "" });
      } else {
        toast.error(response.data?.message || "Failed to add item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Request failed");
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className='add-product-name flex-col'>
          <p>Product name</p>
          <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Type here' required />
        </div>

        <div className='add-product-description flex-col'>
          <p>Product description</p>
          <textarea name='description' onChange={onChangeHandler} value={data.description} type="text" rows={6} placeholder='Write content here' required />
        </div>

        <div className='add-category-price'>
          <div className='add-category flex-col'>
            <p>Product category</p>
            <select name='category' onChange={onChangeHandler} value={data.category}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className='add-price flex-col'>
            <p>Product Price</p>
            <input type="number" min="0" step="1" name='price' onChange={onChangeHandler} value={data.price} placeholder='100' required />
          </div>
        </div>

        <button type='submit' className='add-btn'>ADD</button>
      </form>
    </div>
  )
}

export default Add
