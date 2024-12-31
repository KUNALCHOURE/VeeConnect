const withAuth=(wrappedcomponent)=>{
    const authcomponent=(props)=>{
        const router=useNavigate();

        const isAuthenticated=()=>{
            if(localStorage.getItem("token")){
                return true;
            }
            return false;
        }
        useEffect(()=>{
          if(!isAuthenticated){
               router("/auth")
          }
        },[])
        return <wrappedcomponent {...props}/>
    }
    return authcomponent;
}

export default withAuth;