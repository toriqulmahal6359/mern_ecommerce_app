import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getproductDetails,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import StorageIcon from "@material-ui/icons/Storage";
import TheatersIcon from '@material-ui/icons/Theaters';
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SideBar from "./Sidebar";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = ({ history, match }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, product } = useSelector((state) => state.productDetails);
  const { loading, error: updateError, isUpdated } = useSelector((state) => state.product);

  const categories = [
    'PC', 'XBOX 360', 'Playstation 4', 'XBOX One', 'Playstation 5', 'Nintendo', 'PSP', 'Playstation 3', 'Nintendo DS', 'Wii'
  ];

  const genres = [
    'First-Person', 'Third-person', 'Arcade', 'Shooting', 
    'Racing', 'Sports', 'Spy', 'Military', 'Sci-Fi', 'Mystery', 'Horror', 'Adventure',
    'Open-World', 'Puzzle', 'Action', 'Fighting', 'Ancient', 'Survival', 'Simulation', 'Fantasy' 
  ];

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [trailer, setTrailer] = useState('');
  const [genre, setGenre] = useState([]);
  const [availableGenre, setAvailableGenre] = useState(genres);
  const [images, setImages] = useState([]);
  const [backdrop, setBackdrop] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [oldBackdropImages, setOldBackdropImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [bannerPreview, setBannerPreview] = useState([]);

  const productId = id;

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getproductDetails(productId));
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      setTrailer(product.trailer);
      setGenre(product.genre);
      setOldImages(product.images);
      setOldBackdropImages(product.backdrops);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      navigate("/admin/products");
      alert.success("Product Updated Successfully");
      // history.push("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [ dispatch, alert, error, navigate, isUpdated, productId, product, updateError ]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    myForm.set("trailer", trailer);
    for(let i = 0; i < genre.length; i++){
      myForm.append('genre[]', genre[i]);
    }

    images.forEach((image) => {
      myForm.append("images", image);
    });

    backdrop.forEach((banner) => {
      myForm.append("backdrops", banner);
    });

    dispatch(updateProduct(productId, myForm));
  };

  const removeSelectedGenre = (index) => {
    const updatedOptions = [...genre];
    const removedOption = updatedOptions.splice(index, 1)[0];
    setGenre(updatedOptions);
    setAvailableGenre([...availableGenre, removedOption]);
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

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

  const updateBackdropImageChange = (e) => {
    const files = Array.from(e.target.files);

    setBackdrop([]);
    setBannerPreview([]);
    setOldBackdropImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setBannerPreview((old) => [...old, reader.result]);
          setBackdrop((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Update Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form className="createProductForm" encType="multipart/form-data" onSubmit={updateProductSubmitHandler}>
            <h1>Create Product</h1>
            <div>
              <SpellcheckIcon />
              <input type="text" placeholder="Product Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <AttachMoneyIcon />
              <input type="number" placeholder="Price" required onChange={(e) => setPrice(e.target.value)} value={price} />
            </div>
            <div>
              <DescriptionIcon />
              <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} cols="30" rows="1"></textarea>
            </div>
            <div>
              <AccountTreeIcon />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
              <input type="number" placeholder="Stock" required onChange={(e) => setStock(e.target.value)} value={stock} />
            </div>
            <div>
              <TheatersIcon />
              <input type="text" placeholder="Trailer URL" value={trailer} onChange={(e) => setTrailer(e.target.value)} />
            </div>
            <div id="createProductFormFile">
              <input type="file" name="avatar" accept="image/*" onChange={updateProductImagesChange} multiple />
            </div>
            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Product Preview" />
                ))}
            </div>
            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>
            <span>Banner Image:</span>
            <div id="createProductBackdropFile">
              <input type="file" name="avatar" accept="image/*" onChange={updateBackdropImageChange} multiple />
            </div>
            <div id="createProductBackdropImage">
              {oldBackdropImages &&
                oldBackdropImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Product Preview" />
                ))}
            </div>
            <div id="createProductBackdropImage">
              {bannerPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>
            <Button id="createProductBtn" type="submit" disabled={loading ? true : false}> Update </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
