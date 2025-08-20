import { useElements, useStripe } from "@stripe/react-stripe-js"
import { CardNumberElement, CardExpiryElement,CardCvcElement } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateShipping } from "./Shipping";
import axios from "axios";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";
import { createOrder } from "../../actions/orderActions";
import { clearError as clearOrderError  } from "../../slices/orderSlice";

export default function Payment(){

    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const naviagte = useNavigate();

    // const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    // const orderTotalPrice= orderInfo.totalPrice?orderInfo.totalPrice:0;
    // console.log(orderTotalPrice);
    
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo') || '{}');
    const orderTotalPrice = orderInfo.totalPrice || 0;
    console.log(orderTotalPrice);


    //const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))

    const {user} = useSelector(state=> state.authState)
    const {items:cartItems, shippingInfo} = useSelector(state=> state.cartState)

    const {error:orderError} = useSelector(state=> state.orderState);
   
    const paymentData = {
        amount : Math.round( orderTotalPrice * 100),
        shipping :{
            name: user.name,
            address:{
                city: shippingInfo.city,
                postal_code : shippingInfo.postalCode,
                country: shippingInfo.country,
                state: shippingInfo.state,
                line1 : shippingInfo.address
            },
            phone: shippingInfo.phoneNo
        }
    }

const order = {
    orderItems:cartItems,
    shippingInfo
}




if(orderInfo){
    order.itemsPrice = orderInfo.itemsPrice
    order.shippingPrice = orderInfo.shippingPrice
    order.taxPrice = orderInfo.taxPrice
    order.totalPrice = orderTotalPrice
}



const submitHandler = async (e) =>{
    e.preventDefault();
    document.querySelector('#pay_btn').disabled =true;
    try {
        const {data} = await axios.post('/api/v1/payment/process', paymentData)
        console.log("api requested");
        
        const clientSecret=data.client_secret
        const result =await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
                card:elements.getElement(CardNumberElement),
                billing_details:{
                    name:user.name,
                    email:user.email
                }
            }
        })

        if(result.error){
            toast((await result).error.message,{
                type:'error',
                position: 'bottom-center'
            })
            document.querySelector('#pay_btn').disabled =false;

        }
        else{
            if((await result).paymentIntent.status === 'succeeded' && shippingInfo ){
                toast("Payment Success",{
                    type:'success',
                    position: 'bottom-center'
                })
                console.log("Payment Successfull")
                order.paymentInfo={
                    id:(await result).paymentIntent.id,
                    status:(await result).paymentIntent.status
                }
                dispatch(orderCompleted())
                dispatch(createOrder(order))
                naviagte('/order/success')
            }
            else{
                toast('Please try again',{
                type:'warning',
                position: 'bottom-center'
            })
            }
        }

    } catch (error) {
        toast('Server issue! Please try again later',{
                type:'warning',
                position: 'bottom-center'
                })
    }
}

useEffect(()=>{
    if(order.paymentInfo){
        naviagte('/order/success')
        return
    }
    if (!order.paymentInfo ) {
        validateShipping(shippingInfo, naviagte);
    }

    if(orderError){
        toast(orderError,{
                    position: "bottom-center",
                    type:'error',
                    onOpen: () => {dispatch(clearOrderError())}
                })
                return
    }
},[ orderError, dispatch,naviagte ])


    return(
         <div className="row wrapper">
		<div className="col-10 col-lg-5">
            <form onSubmit={submitHandler} className="shadow-lg">
                <h1 className="mb-4">Card Info</h1>
                <div className="form-group">
                  <label htmlFor="card_num_field">Card Number</label>
                  <CardNumberElement
                    type="text"
                    id="card_num_field"
                    className="form-control"
                    
                  />
                </div>
				
				<div className="form-group">
                  <label htmlFor="card_exp_field">Card Expiry</label>
                  <CardExpiryElement
                    type="text"
                    id="card_exp_field"
                    className="form-control"
                    
                  />
                </div>
				
				<div className="form-group">
                  <label htmlFor="card_cvc_field">Card CVC</label>
                  <CardCvcElement
                    type="text"
                    id="card_cvc_field"
                    className="form-control"
                    value=""
                  />
                </div>
      
            
                <button
                  id="pay_btn"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  Pay = {` ${orderInfo && orderTotalPrice } LKR`}
                </button>
    
              </form>
			  </div>
        </div>
    )
}