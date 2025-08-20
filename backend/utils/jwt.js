const sendToken= (user,statusCode,res)=>{
    // creatign jwt token
    const token=user.getJwtToken();


    //setting cookies
    const options={
        expires:new Date(
            Date.now()+(process.env.COOKIE_EXPIRES_TIME*24*60*60*1000)
        ),
        httpOnly:true,// only access through request can't by javascript

    }

    res.status(statusCode)
    .cookie('token',token,options)// create cookie , name for key value, which want to save, extra informations
    .json({
        success:true,
        token,
        user
    })

}

module.exports=sendToken;