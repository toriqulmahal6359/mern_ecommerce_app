import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SideBar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";

const NewProduct = ({ history }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    'PC', 'XBOX 360', 'Playstation 4', 'XBOX One', 'Playstation 5', 'Nintendo', 'PSP', 'Playstation 3', 'Nintendo DS', 'Wii'
  ];

  const genres = [
    'First-Person', 'Third-person', 'Arcade', 'Shooting', 
    'Racing', 'Sports', 'Spy', 'Military', 'Sci-Fi', 'Mystery', 'Horror', 'Adventure',
    'Open-World', 'Puzzle', 'Action', 'Fighting', 'Ancient', 'Survival', 'Simulation', 'Fantasy'  
  ];

  const [genre, setGenre] = useState([]);
  const [availableGenre, setAvailableGenre] = useState(genres);
  const [inputValue, setInputValue] = useState('');


  const removeSelectedGenre = (index) => {
    const removedOption = genre[index];
    setGenre((prevGenre) => {
      const updatedGenre = [...prevGenre];
      updatedGenre.splice(index, 1);
      return updatedGenre;
    });
    setAvailableGenre((preAvailableGenre) => [...preAvailableGenre, removedOption]);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      // history.push("/admin/dashboard");
      navigate("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, navigate, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    for(let i = 0; i < genre.length; i++){
      myForm.append('genre[]', genre[i]);
    }
    
    images.forEach((image) => {
      myForm.append("images", image);
    });
    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form className="createProductForm" encType="multipart/form-data" onSubmit={createProductSubmitHandler}>
            <h1>Create Product</h1>
            <div>
              <SpellcheckIcon />
              <input type="text" placeholder="Product Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <AttachMoneyIcon />
              <input type="number" placeholder="Price" required onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <DescriptionIcon />
              <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} cols="30" rows="1"></textarea>
            </div>
            <div>
              <AccountTreeIcon />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>
            <div>
                <GroupWorkIcon />
                <select
                    onChange={(e) => {
                    const selectedGenre = e.target.value;
                    if (selectedGenre !== "") {
                      setGenre([...genre, selectedGenre]);
                      setAvailableGenre(availableGenre.filter((option) => option !== selectedGenre));
                      e.target.value = ""; // Reset the select value to default
                    }
                  }}
                >
                  <option value="">Choose Genre</option>
                      {availableGenre.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                  ))}
                </select>
            </div>
            <div className="selectedOptions">
              {genre.map((option, index) => (
                <div className="selectedOption" key={index}>
                  <input type="text" value={option} onChange={()=> {}} readOnly/>
                  <span
                    className="closeOption"
                    onClick={() => removeSelectedGenre(index)}
                  >x</span>
                </div>
              ))}
            </div>
            <div>
              <StorageIcon />
              <input type="number" placeholder="Stock" required onChange={(e) => setStock(e.target.value)} />
            </div>
            <div id="createProductFormFile">
              <input type="file" name="avatar" accept="image/*" onChange={createProductImagesChange} multiple />
            </div>
            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>
            <Button id="createProductBtn" type="submit" disabled={loading ? true : false}> Create </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
