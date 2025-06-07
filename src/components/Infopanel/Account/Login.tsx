import '../../../styles/infopanel.scss';
import React, { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from 'contexts/UserContext';
import FbLogo from '../../../assets/social-login/facebook-logo.png'
import GoogleLogo from '../../../assets/social-login/google-logo.png'
import GithubLogo from '../../../assets/social-login/github-logo.png'
import {getAuth, signInWithPopup, GoogleAuthProvider,FacebookAuthProvider,GithubAuthProvider} from "firebase/auth";
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};
const firebaseapp = initializeApp(firebaseConfig);
const auth = getAuth();
const Login: React.FC = () => {
  const [forgottenPassword, setForgottenPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false); // New state for reset password form
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [type, setType] = useState('password');
  const params = new URLSearchParams(window.location.search);
  const resetpasswordtoken = params.get('token');
  const { setUserId } = useUser();

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
      console.log(socialFormData);
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
              body: JSON.stringify({email:formData.email,allowpasswordless:true}),
          });
          data = await response.json();
          if (!response.ok) {
            toast.error(data.message || "Something went wrong", { position: "bottom-center" });
              throw new Error(data.message || "Something went wrong");
            }
              localStorage.setItem("token", data.token);
              window.dispatchEvent(new Event("storage"));
              toast.success("Registration successful! You can now log in.");
              setUserId(data.user_id); // Set userId in context
              toast.success("Login successful!");
              localStorage.setItem('token', data.token); 
              localStorage.setItem('userid',data.user_id||'nothing');
              localStorage.setItem('user',data.user||'nothin')
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
                      body: JSON.stringify({email:formData.email,allowpasswordless:true}),
                  });
                  const data = await response.json();
                  if (!response.ok) {
                    toast.error(data.message || "Something went wrong", { position: "bottom-center" });
                      throw new Error(data.message || "Something went wrong");
                    }
                      localStorage.setItem("token", data.token);
                      window.dispatchEvent(new Event("storage"));
                      setUserId(data.user_id); // Set userId in context
                      toast.success("Login successful!");
                      localStorage.setItem('userid',data.user_id||'nothing');
                      localStorage.setItem('user',data.user||'nothin')
                      toast.success("Registration successful! You can now log in.");
                      }
          catch(error){
                  console.log(error);
          }
          }
              }
  
  useEffect(() => {
    // Reset states on page reload
    setForgottenPassword(false);
    setResetPassword(false);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('resetPassword') === 'true') {
      setResetPassword(true);
    }
  }, []);
  useEffect(() => {
    if (forgottenPassword) {
      console.log("Switched to forgotten password form");
    } else if (resetPassword) {
      console.log("Switched to reset password form");
    } else {
      console.log("Switched to login form");
    }
  }, [forgottenPassword, resetPassword]);

  const handleForgottenPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cooldownKey = 'resetPasswordCooldown';
    const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const lastAttempt = localStorage.getItem(cooldownKey);
    const now = Date.now();
    if (lastAttempt && now - parseInt(lastAttempt, 10) < cooldownTime) {
      const remainsInSeconds = (cooldownTime-(now - parseInt(lastAttempt, 10))* 0.001).toFixed(2);
      toast.error("Please wait"+remainsInSeconds+" seconds before trying again.");
      return;
    }
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Something went wrong", { position: "bottom-center" });
        throw new Error(data.message || "Password reset failed");
      }
      toast.success("Password reset link sent to your email!");
      localStorage.setItem(cooldownKey, now.toString()); // Store the timestamp of the attempt
      setForgottenPassword(false); // Switch back to login form
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(resetpasswordtoken);
    console.log(formData.password);
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/setnewpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: formData.password, token:resetpasswordtoken}),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Something went wrong", { position: "bottom-center" });
        throw new Error(data.message || "Password reset failed");
      }
      if (data.redirectUrl) {
        toast.success("Password reset successful! You can now log in.");
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 200);
    }
      setResetPassword(false); // Switch back to login form
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Something went wrong", { position: "bottom-center" });
        throw new Error(data.message || "Login failed");
      }
      //localStorage.setItem("token", data.token);
      //window.dispatchEvent(new Event("storage"));
      console.log('user data',data);
      setUserId(data.user_id); // Set userId in context
      toast.success("Login successful!");
      localStorage.setItem('token', data.token); 
      localStorage.setItem('userid',data.user_id||'nothing');
      localStorage.setItem('user',data.user||'nothin')// Save token if needed
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = () => {
    setType(type === 'password' ? 'text' : 'password');
  };

  return (
    <div>
      <Toaster />
      {!forgottenPassword && !resetPassword ? (
        <div>
          {/* Login Form */}
          <form method="post" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="mb-4 flex">
                <input
                  name="password"
                  type={type}
                  id="password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <span
                  className="border border-gray-300 rounded cursor-pointer"
                  title="show/hide"
                  onClick={handleToggle}
                >
                  {type === "password" ? <FiEye className="custom-class" /> : <FiEyeOff className="custom-class" />}
                </span>
              </div>
            </div>
            <div className="mb-4 text-right">
              <a
                onClick={() => setForgottenPassword(true)}
                className="text-sm text-blue-500 hover:underline cursor-pointer"
              >
                Did you forget your password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Login
            </button>
          </form>
          <div className="mt-6">
                <p className="text-center text-gray-600 mb-4">Or log in using:</p>
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
      ) : forgottenPassword ? (
        <div>
          {/* Forgotten Password Form */}
          <form method="post" onSubmit={handleForgottenPassword}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Enter your email to receive a password reset link:
              </label>
              <input
                name="email"
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Send Reset Link
            </button>
            <div className="mt-4 text-right">
              <a
                onClick={() => setForgottenPassword(false)}
                className="text-sm text-blue-500 hover:underline cursor-pointer"
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {/* Reset Password Form */}
          <form method="post" onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <input
                name="password"
                type="password"
                id="password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your new password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your new password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Reset Password
            </button>
            <div className="mt-4 text-right">
              <a
                onClick={() => setResetPassword(false)}
                className="text-sm text-blue-500 hover:underline cursor-pointer"
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;