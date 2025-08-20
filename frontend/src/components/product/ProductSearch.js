import { Fragment, useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import { getProducts } from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/Loader";
import Product from "./Product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from 'react-js-pagination';
import { useParams } from "react-router-dom";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css' //'rc-tooltip/assets/bootstrap_white.css' for white theme

export default function ProductSearch(){

    const dispatch= useDispatch();
    const {products, loading, error, productsCount, resPerPage} = useSelector((state)=>state.productsState);
    const [currentPage, setCurrentPage] =useState(1);
    const [price, setPrice] =useState([1,1000000]);
    const [priceChanged, setPriceChanged] =useState(price);
    const [category, setCategory] =useState(null);
    const [rating, setRating] =useState(0);


    const {keyword} =useParams();
    const Categories=[
        'Electronics',
        'Mobile Phones',
        'Smart Watch',
        'Desktop/Laptops',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ];

    
    const setCurrentPageNo = (pageNo) =>{
        setCurrentPage(pageNo);

    }


    useEffect(() => {
    if (error) {
        toast.error(error, {
            position: "bottom-center"
        });
    }

    dispatch(getProducts(keyword, priceChanged, category, rating, currentPage));
}, [dispatch, error, currentPage, keyword, priceChanged, category, rating]);




    return (// loading? loader : fragment // loading false page will show
        <Fragment>
            
        {loading ? <Loader/> :
                <Fragment>
                <MetaData title={'Find Best Products'}/>
                <h1 id="products_heading">Search Products</h1>
    
                    <section id="products" className="container mt-5">
                        <div className="row">
                            <div className="cols-6 col-md-3 mb-5 mt-5">
                                {/* filter portion */}
                                    {/* price Filter */}
                                <div className="px-5" onMouseUp={()=>setPriceChanged(price)}>
                                    <Slider
                                        range={true}
                                        marks={
                                            {
                                                1:"1LKR",
                                                1000000:"1000000LKR"
                                            }
                                        }
                                        min={1}
                                        max={1000000}
                                        defaultValue={price}
                                        onChange={(price)=>{
                                            setPrice(price)
                                        }}
                                        handleRender={(renderProps) => {
                                                return (
                                                <Tooltip overlay={`${renderProps.props['aria-valuenow']} LKR`}>
                                                    <div {...renderProps.props} />
                                                </Tooltip>
                                                )
                                            }}
                                    />
                                </div>

                                <hr className="my-5"/>

                                    {/* Category Filter */}
                                <div className="mt-5">
                                    <h3 className="mb-2 pl-2">Categories</h3>
                                    <ul className="pl-4 ">
                                        {
                                            Categories.map((category,index)=>(
                                            <li
                                                style={{
                                                    cursor:"pointer",
                                                    listStyleType:"none"
                                                }}

                                                key={index}
                                                className="pb-1"
                                                onClick={()=>{
                                                    setCategory(category)
                                                }}
                                            >
                                                {category}
                                            </li>
                                            ))
                                        }
                                    </ul>

                                </div>

                                <hr className="my-5"/>
                                
                                    {/* Rating Filter */}
                                <div className="mt-5">
                                    <h4 className="mb-3 pl-2">Ratings</h4>
                                    <ul className="pl-4 ">
                                        {
                                            [5,4,3,2,1].map((star,index)=>(
                                            <li
                                                style={{
                                                    cursor:"pointer",
                                                    listStyleType:"none"
                                                }}

                                                key={index}
                                                className="pb-1"
                                                onClick={()=>{
                                                    setRating(star)
                                                }}
                                            >
                                                <div className="rating-outer">
                                                    <div className="rating-inner" 
                                                    style={{
                                                        width:`${star*20}%`
                                                    }}
                                                    >

                                                    </div>
                                                </div>
                                            </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                
                            </div>

                            <div className="cols-6 col-md-9">
                                <div className="row ">
                                    {
                                        products && products.map(product =>(
                                            <Product col={4} key={product._id} product={product}/>
                                        ))
                                    }

                                </div>

                                {/* Pagination with condition*/}
                                {productsCount>0 && productsCount > resPerPage ?
                                <div className="d-flex justify-content-center mt-5">
                                    <Pagination
                                        activePage={currentPage}
                                        onChange={setCurrentPageNo}
                                        totalItemsCount={productsCount}
                                        itemsCountPerPage={resPerPage}
                                        nextPageText={"Next"}
                                        firstPageText={"First"}
                                        lastPageText={"Last"}
                                        itemClass={'page-item'}
                                        linkClass={"page-link"}
                                    />
                                </div> : null}
                            </div>
                            
                            
                        </div>
                    </section>

                    
                </Fragment>
        }
        </Fragment>
    )
}
 