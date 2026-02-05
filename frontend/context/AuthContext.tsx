"use client"

import { createContext ,useContext , useEffect , useState , ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User  {
    fullName : string;
    email : string;
    password : string;
    roles : [];
    
}

const AuthContext = createContext<any>(null);

export  function AuthProvider({ children } : {children : ReactNode}){

    const router = useRouter();
    const [user , setUser]= useState<User | null>(null);




    useEffect(()=>{
      
        const store = localStorage.getItem("auth");

        if(store){
           setUser(JSON.parse(store).user)
        }
    },[]);


      const login = async (email: string, password: string) => {
        const res = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        localStorage.setItem("auth", JSON.stringify(data));
        setUser(data.user);

        redirectByRole(data.user.roles);
      };

    const register = async(fullName : string , email:string , password : string)=>{
        
        const res = await fetch("http://localhost:3000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password }),
        });

        const data = await  res.json();
        // Ne pas sauvegarder l'utilisateur après l'inscription
        // L'utilisateur doit se connecter manuellement
        
        // Rediriger vers la page de connexion
        router.push("/auth/login");
    } 

      const redirectByRole = (roles: string[]) => {
        if (roles.includes("admin")) router.push("/dashboard/admin");
        else router.push("/dashboard/participant");
      };


      return(
        <AuthContext.Provider value={{ user  , register , login}}>
            {children}
        </AuthContext.Provider>
      )
}

export const useAuth = ()=> useContext(AuthContext);