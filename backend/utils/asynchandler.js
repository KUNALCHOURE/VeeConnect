const asynchandler=(requesthandler)=>{
    return(req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next))
        .catch((err)=>{
            console.log("Error Caught by asynchandler",err);
            err.statusCode=err.statusCode||500;
            err.message = err.message || "Internal Server Error";
            next(err);
        });
    };
};

export default asynchandler;