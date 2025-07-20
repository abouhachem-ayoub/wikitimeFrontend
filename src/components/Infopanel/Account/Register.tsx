'use client';
import '../../../styles/infopanel.scss';
import {ChangeEvent, FormEvent, useState,useEffect} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import FbLogo from '../../../assets/social-login/facebook-logo.png'
import GoogleLogo from '../../../assets/social-login/google-logo.png'
import GithubLogo from '../../../assets/social-login/github-logo.png'
import {getAuth, signInWithPopup, GoogleAuthProvider,FacebookAuthProvider,GithubAuthProvider,createUserWithEmailAndPassword} from "firebase/auth";
import { useUser } from 'contexts/UserContext';
import { signInWithEmailAndPassword } from "firebase/auth";


const defaultFormData = {
    email:'',
    password:'',
    password2:'',
    firstName:'',
    lastName:'',
    phone:'',
    pseudo:''
}
const RegisterForm = ({ toggleForm, onLoginSuccess }: { toggleForm: () => void; onLoginSuccess: (userId: string, token: string, user: string) => void }) => {
    const [loading, setLoading] = useState(false);
    const [formData,setFormData] = useState(defaultFormData);
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('password');
    const[type2, setType2] = useState('password');
    const [debouncedPseudo, setDebouncedPseudo] = useState('');
    const [pseudo, setPseudo] = useState('');
    const[pseudoErrorMessage,setPseudoErrorMessage] = useState('');
    const [pseudoExists, setPseudoExists] = useState(false);
    const [debouncedformData, setDebouncedformData] = useState(defaultFormData);
    const[emailErrorMessage,setEmailErrorMessage] = useState('');
    const [emailExists, setEmailExists] = useState(false);
    const [passwordErrorMessage,setPasswordErrorMessage] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const { userId, setUserId } = useUser();
    const auth = getAuth();
    const debug_mode=import.meta.env.VITE_DEBUG_MODE;
    // Access the context's setUserId function
    const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in:", user);
    // Handle successful login
    return user;
  } catch (error: any) {
    console.error("Login error:", error.message);
    throw error;
  }
};
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedPseudo(pseudo);
        }, 500);
    
        return () => {
            clearTimeout(handler);
        };
    }, [pseudo]);
    useEffect(() => {
        if (debouncedPseudo.trim() !== '') {
            const fetchData = async () => {
                try {
                    const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/pseudoexists", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                        },
                    body: JSON.stringify({ pseudo : debouncedPseudo }),
                    });
                    const data = await response.json();                    
                    if (data.exists) {
                        setPseudoErrorMessage(debouncedPseudo+' already exists');
                        setPseudoExists(true);
                    } 
                    else if (debouncedPseudo.length < 5) {
                        setPseudoErrorMessage(debouncedPseudo+' is too short, at least 5 characters');
                        setPseudoExists(true);
                    }
                    else {
                        setPseudoErrorMessage(debouncedPseudo+' is available');
                        setPseudoExists(false);
                    }
                } catch (error) {
                }
            };
            fetchData();
        }
    }, [debouncedPseudo]);

    const handlePseudoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPseudo(value);
        setFormData({ ...formData, pseudo: value });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedformData(formData);
        }, 500);
    
        return () => {
            clearTimeout(handler); 
        };
    }, [formData]);
    useEffect(() => {
        if (debouncedformData.email.trim() !== '') {
            const fetchData = async () => {
                try {
                    if(!emailRegex.test(debouncedformData.email)) {
                      setEmailErrorMessage('Invalid email format');
                      setEmailExists(true);
                        return;
                    }
                    const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/emailexists", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                        },
                    body: JSON.stringify({ email : debouncedformData.email }),
                    });
                    const data = await response.json(); 

                    if (data.exists) {
                        setEmailErrorMessage(debouncedformData.email+'\talready exists; login instead');
                        setEmailExists(true);
                    } else {
                        setEmailErrorMessage(debouncedformData.email+'\t is available');
                        setEmailExists(false);
                    }
                } catch (error) {
                }
            };
            fetchData();
        }
    }, [debouncedformData]);

    useEffect(() => {
        const checkPassword = () => {
            /*if(!passwordRegex.test(debouncedformData.password) ){
                setPasswordErrorMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            }*/
            if (debouncedformData.password.length == 0){
                setPasswordErrorMessage('')      
            }
            else if(debouncedformData.password.length > 0 && debouncedformData.password.length < 8 && debouncedformData.password !== debouncedformData.password2){
                    setPasswordErrorMessage('Passwords are too short, and did not match')      
                }
            else if (debouncedformData.password.length < 8){
            setPasswordErrorMessage('Password is too short, at least 8 characters');
            }
            else if(debouncedformData.password != debouncedformData.password2){
            setPasswordErrorMessage('Passwords did not match');
            }   
            else if(debouncedformData.password == debouncedformData.password2 && debouncedformData.password.length >= 8){
            setPasswordErrorMessage('');}
    
            else{
            setPasswordErrorMessage('');
            }
    }
    checkPassword();
    }
    , [debouncedformData.password,debouncedformData.password2]);
    
    const handleInputChange = (e :ChangeEvent <HTMLInputElement>) => {
        try{
        const{name,value}=e.target;
        setFormData({...formData,[name]:value});
        }
        catch(error){
            console.log(error);
        }
    }
  
    const handlePhoneChange = (value: string) => {
        setPhone(value); 
        setFormData({ ...formData, phone: value }); 
    };
    const handleToggle = () => {
        if (type==='password'){
           setType('text')
        } else {
           setType('password')
        }
     }
    const handleToggle2 = () => {
        if (type2==='password'){
           setType2('text')
        } else {
           setType2('password')
        }
     }

    const handleSubmit =async(e : FormEvent <HTMLFormElement>)=>{
        e.preventDefault();
        try{
            if(!pseudoExists && !emailExists && passwordErrorMessage === '' && formData.password === formData.password2){
                setLoading(true);
                    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                    const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/register", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        toast.error(data.message || "Something went wrong", { position: "bottom-center" });
                        throw new Error(data.message || "Something went wrong");
                      }
                        localStorage.setItem("token", data.token);
                        window.dispatchEvent(new Event("storage"));
                        toggleForm();
                        toast.success("Registration successful! You can now log in.");
                        //add logic to log the user in directly after registration
                        await loginWithEmailPassword(formData.email, formData.password);
                        const loginResponse = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/login", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({email:formData.email,allowpasswordless:true,preVerified:false}),
                        });
                        const loginData = await loginResponse.json();
                        if (!loginResponse.ok) {
                            toast.error(loginData.message || "Something went wrong", { position: "bottom-center" });
                            throw new Error(loginData.message || "Something went wrong");
                          }
                        console.log('Setting userId:', loginData.user_id);
                        onLoginSuccess(loginData.user_id, loginData.token, loginData.user); // Notify the parent component
                        toast.success("Login successful!");
                        // Reset form data and state
                      setFormData({
                        email:'',
                        password:'',
                        password2:'',
                        firstName:'',
                        lastName:'',
                        phone:'',
                        pseudo:''
                        }
                      )
                      setPhone('');
                      setPseudo('');
                } 
                else{
                    toast.error('Something went wrong, try again!');
            }}
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }
    const checkifsocialemailexists = async (email:any)=>{
        try {
            const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/emailexists", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
                },
            body: JSON.stringify({ email : email }),
            });
            const data = await response.json(); 
            if (data.exists) {
               return true;
            } 
            else {
                return false;
            }
    }
    catch(error){
        return 'something went wrong';
    }}
const registerwithsocials = async(formData:any)=>{
    if(!(await checkifsocialemailexists(formData.email))){
        try{
    let response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData,emailVerified:true})
    });
    let  data = await response.json();
    if (!response.ok) {
        toast.error(data.message || "Something went wrong", { position: "bottom-center" });
        throw new Error(data.message || "Something went wrong");
      }
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("storage"));
        toast.success("Registration successful!");
        response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email:formData.email,allowpasswordless:true,preVerified:true}),
        });
        data = await response.json();
        if (!response.ok) {
            toast.error(data.message || "Something went wrong", { position: "bottom-center" });
            throw new Error(data.message || "Something went wrong");
          }
          console.log('Setting userId:', data.user_id);
          onLoginSuccess(data.user_id, data.token, data.user); // Notify the parent component
          toast.success("Login successful!");
        }
        catch(error){
                console.log(error)
        }}
    else{
        try{
                const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/login", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email:formData.email,allowpasswordless:true,preVerified:true}),
                });
                const data = await response.json();
                if (!response.ok) {
                    toast.error(data.message || "Something went wrong", { position: "bottom-center" });
                    throw new Error(data.message || "Something went wrong");
                  }
                  console.log('Setting userId:', data.user_id);
                  onLoginSuccess(data.user_id, data.token, data.user); // Notify the parent component
                  toast.success("Login successful!");
                                    }
        catch(error){
                console.log(error);
        }
        }
            }
const handlesociallogin= async (authProvider:string) => {
    if(authProvider == 'google'){
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    //check if email exists in the firestore database
    //if so than check if its verified and then make it verified
    //check if phone exists if not replace it with user.phone
    //if the email is not in the database register the user and then log him in directly
        const socialFormData = {
                        email: user.email || '',
                        password: '',
                        password2: '',
                        firstName: '',
                        lastName: '',
                        phone: user.phoneNumber || '',
                        pseudo: user.displayName || '',
                      };
                    registerwithsocials(socialFormData);
                }
  ).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
    }
    else if(authProvider=='facebook'){
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    console.log('result',result);
    console.log('user',user);
    const socialFormData = {
        email: user.email || '',
        password: '',
        password2: '',
        firstName: '',
        lastName: '',
        phone: user.phoneNumber || '',
        pseudo: user.displayName || '',
      };
    console.log('token',token);
    localStorage.setItem('scoialformdata',JSON.stringify(socialFormData));
    localStorage.setItem('fbemail',socialFormData.email);
    registerwithsocials(socialFormData);
  }).catch((error) => {
    const errorCode = error.code;
    localStorage.setItem('fberrorcode',error.code);
    const errorMessage = error.message;
    localStorage.set('fberrormessage',error.message);
    const email = error.customData.email;
    localStorage.setItem('fberrorcustomemail',error.email);
    const credential = FacebookAuthProvider.credentialFromError(error);
    console.log(error);
    toast.error('try to sign up with google instead, you already have an account');
  });
    }
    else if(authProvider == 'github'){
        const provider = new GithubAuthProvider
        signInWithPopup(auth, provider)
        .then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log('result',result);
        console.log('user',user);
        console.log('userid',user.uid)
        const socialFormData = {
            email: user.email || '',
            password: '',
            password2: '',
            firstName: '',
            lastName: '',
            phone: user.phoneNumber || '',
            pseudo: user.displayName || '',
        };
    console.log('token',token);
    console.log(socialFormData);
    registerwithsocials(socialFormData);
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    console.log(email,errorMessage);
    const credential = GithubAuthProvider.credentialFromError(error);
    console.log(email,errorMessage,credential);
    toast.error('try to sign up with google instead, you already have an account');
}  
  )
    }}
   

    return (
        <div className="min-w-md max-w-lg mx-auto bg-white shadow-md rounded px-8 py-6"> 
            <Toaster/>
            {debug_mode==='true' && <p>Sign up page Register.tsx</p>}
            <form method='post' onSubmit={handleSubmit}>
            <div className="mb-4">
                    <label htmlFor="firstName" className="required block text-gray-700 font-medium mb-2">
                        First Name
                    </label>
                    <input
                        maxLength={30}
                        type="text"
                        id="firstName"
                        name='firstName'
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="first name"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="lastName" className="required block text-gray-700 font-medium mb-2">
                        Last Name
                    </label>
                    <input
                        maxLength={30}
                        type="text"
                        id="lastName"
                        name='lastName'
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="last name"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="pseudo" className="required block text-gray-700 font-medium mb-2">
                        Pseudo
                    </label>
                    <input
                        maxLength={30}
                        type="text"
                        id="pseudo"
                        name='pseudo'
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Pseudo"
                        required
                        value={pseudo}
                        onChange={handlePseudoChange}
                    />
                    {pseudoExists?
                        (<p className="text-red-500 text-sm">{pseudoErrorMessage}</p>) : 
                        (<p className="text-green-500 text-sm">{pseudoErrorMessage}</p> 
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="required block text-gray-700 font-medium mb-2">
                        Email
                    </label>
                    <input
                        maxLength={100}
                        type="email"
                        id="email"
                        name='email'
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                     {emailExists?
                        (<p className="text-red-500 text-sm">{emailErrorMessage}</p>) : 
                        (<p className="text-green-500 text-sm">{emailErrorMessage}</p> 
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="required block text-gray-700 font-medium mb-2">
                        Password
                    </label>
                    <div className='mb-4 flex'>
                    <input
                        maxLength={30}
                        name='password'
                        type={type}
                        id="password"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        minLength={8}
                    />
                       <span className="border border-gray-300 rounded" title="show/hide"  onClick={handleToggle}>
                       {(type=="password")? (<FiEye className='custom-class'/>):(<FiEyeOff className='custom-class'/>)}
                       </span>
                       </div>
                       {passwordErrorMessage &&
                        (<p className="text-red-500 text-sm">{passwordErrorMessage}</p> )}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="required block text-gray-700 font-medium mb-2">
                        Repeat password
                    </label>
                    <div className = 'mb-4 flex'>
                    <input
                        maxLength={30}
                        type={type2}
                        name='password2'
                        id="password2"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password again"
                        required
                        value={formData.password2}
                        onChange={handleInputChange}
                        minLength={8}
                    />
                      <span className="border border-gray-300 rounded" title="show/hide"  onClick={handleToggle2}>
                       {(type2=="password")? (<FiEye className='custom-class'/>):(<FiEyeOff className='custom-class'/>)}
                       </span>
                       </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                        Phone Number
                    </label>
                    <PhoneInput
                        enableSearch={true}
                        country={'us'}
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="Enter your phone number"
                    />
                </div>
                <div className="mb-4 text-right">
                    <a
                        onClick={toggleForm}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        Already have an account? login instead!
                    </a>
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:bg-gray-300"                >
                         {loading ? 'Submitting...' : 'Sign Up'}

                </button>
            </form>
            <div className="mt-6">
                <p className="text-center text-gray-600 mb-4">Or sign up with</p>
                <div className="">
                    <button className="social-login-button"
                        onClick={() => handlesociallogin('google')}
                    >
                        <img src={GoogleLogo} alt="Google" className="social-login" />
                    </button>
                    <button className="social-login-button"
                        onClick={() => handlesociallogin('facebook')}
                    >
                        <img src={FbLogo} alt="Facebook" className="social-login" />
                    </button>
                    <button className="social-login-button"
                       onClick={() => handlesociallogin('github')}
                    >
                        <img src={GithubLogo} alt="GitHub" className="social-login" />
                    </button>
                </div>
            </div>
        </div> 
    );
};

export default RegisterForm;