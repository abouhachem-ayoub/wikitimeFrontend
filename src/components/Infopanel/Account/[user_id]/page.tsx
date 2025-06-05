import { useEffect, useState } from "react";
import '../../../../styles/infopanel.scss';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FiEdit } from "react-icons/fi";
import toast,{Toaster} from "react-hot-toast";
import { useUser } from "contexts/UserContext";
import ConfirmDeleteModal from "../confirmDeleteModal";
const ProfilePage = ({ params }: { params: { user_id: string }}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string|undefined; emailVerified?: boolean,firstName:string|undefined,lastName:string|undefined,pseudo:string|undefined,password?:string,phone:string|undefined} | null>(null);
  const {userId,setUserId} = useUser()
  const [error, setError] = useState<string | null>(null);
  const [edit,setEdit] = useState(false);  
  const [debouncedPseudo, setDebouncedPseudo] = useState('');
  const[pseudoErrorMessage,setPseudoErrorMessage] = useState('');
  const [formData,setFormData] = useState({
    firstName: user?.firstName,
    lastName:user?.lastName,
    pseudo: user?.pseudo,
    phone: user?.phone});
  const[phone,setPhone] = useState(user?.phone);
  const [pseudoExists,setPseudoExists] = useState(false);
  const [loading,setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleDeleteAccount = async (password:string) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/deleteaccount", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token: localStorage.getItem("token") }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete account");
      }
  
      alert("Your account has been deleted. You will be logged out.");
      localStorage.removeItem("token");
      localStorage.removeItem("userid");
      localStorage.removeItem("user");
      window.location.href = "/"; // Redirect to the homepage or login page
    } catch (error: any) {
      alert(error.message || "An error occurred while deleting your account.");
    }}
const handleSubmit = async (e : React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  const previousUser = user;
  setUser((prevUser) => ({
    ...prevUser,
    ...formData,
  }));
   try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/edituserinfo", {
    method: "POST",
    headers: {
    Authorization: `Bearer ${token}`, // Send the token in the Authorization header
    "Content-Type": "application/json",
        },
    body: JSON.stringify({...formData,userid:userId}),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...formData,
    }));
    toast.success('Your data was updated successfully');
    setEdit(false);
}
catch(error){
    setUser(previousUser);
    console.log('this went wrong:',error)
}
}

  const toggleEdit =()=>{
    setEdit(!edit);
  }
  const handlePhoneChange = (value: string) => {
    setPhone(value); // Update the phone state
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: value, // Use the value directly from the onChange handler
    }));
  };
     const handleInputChange = (e :React.ChangeEvent <HTMLInputElement>) => {
          try{
          const{name,value}=e.target;
          setFormData({...formData,[name]:value});
          }
          catch(error){
              console.log(error);
          }
      }

       useEffect(() => {
             const handler = setTimeout(() => {
                 setDebouncedPseudo(formData?.pseudo||'');
             }, 500);
         
             return () => {
                 clearTimeout(handler);
             };
         }, [formData.pseudo]);

          useEffect(() => {
                  if (debouncedPseudo.trim() !== '' && debouncedPseudo!==user?.pseudo) {
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
          

  useEffect(() => {
    const fetchUserData = async () => {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (!token) {
            // Redirect to login if no token is found
            return;
          }
      try {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL+`api/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          });        
          if (!response.ok) {
          if (response.status === 404) {
            setError("User not found");
          } else {
            throw new Error("Failed to fetch user data");
          }
          return;
        }

        const data = await response.json();
        setUser(data);
        console.log(data);
        setFormData({...data,phone:phone});
      } catch (error:Error|any) {
        console.error(error);
        localStorage.setItem('error',error.message+import.meta.env.VITE_API_BASE_URL+`api/user/${userId}`);
        setError("An error occurred while fetching user data");
      }
    };

    fetchUserData();
  }, [userId,user?.emailVerified]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-w-md max-w-lg mx-auto bg-white shadow-md rounded px-8 py-6">
      <Toaster/>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user.pseudo}!</h2>
      {user.emailVerified ? (
        <div>
                  <p>Your email is verified. You can now access all features.</p>
                  <h1>Your personal information</h1>
                  <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="firstName" className="required block text-gray-700 font-medium mb-2">
                        First Name
                    </label>
                    {!edit &&
                    <div>
                      <br />
                      <p className="edit-paragraph">Click the icon below to edit your personal info</p>
                      <br />
                      
                      <FiEdit onClick={toggleEdit}
                      size={20}
                      color="blue"
                      className="edit-icon"
                      />
                      <br />
                    </div>
                   
                    }
                    {edit && <input
                        maxLength={30}
                        type="text"
                        id="firstName"
                        name='firstName'
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="First name"
                        value={formData?.firstName}
                        onChange={handleInputChange}
                        
                    />}
                    {!edit && <p className="non-editable">
                      {user.firstName}
                      </p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="lastName" className="required block text-gray-700 font-medium mb-2">
                        Last Name
                    </label>
                    {edit &&
                    <input
                        maxLength={30}
                        type="text"
                        id="lastName"
                        name='lastName'
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="last name"
                        required
                        value={formData?.lastName}
                        onChange={handleInputChange}
                    />}
                    {!edit && <p className="non-editable">
                      {user.lastName}
                      </p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="pseudo" className="required block text-gray-700 font-medium mb-2">
                        Pseudo
                    </label>
                    {edit &&
                    <div>
                       <input
                        maxLength={30}
                        type="text"
                        id="pseudo"
                        name='pseudo'
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Pseudo"
                        required
                        value={formData?.pseudo}
                        onChange={handleInputChange}
                    />
                     {pseudoExists?
                        (<p className="text-red-500 text-sm">{pseudoErrorMessage}</p>) : 
                        (<p className="text-green-500 text-sm">{pseudoErrorMessage}</p> 
                    )}
                    </div>
                   }
                    {
                      !edit && <p className="non-editable">{user.pseudo}</p>
                    }
                </div>
      
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                        Phone Number
                    </label>
                    {edit && 
                    <PhoneInput
                        enableSearch={true}
                        country={'us'}
                        value={user.phone}
                        onChange={handlePhoneChange}
                    />}
                    {!edit && 
                     <p className="non-editable">{user.phone}</p>
                  }
                </div>
                <button
                    hidden={!edit}
                    type="submit"
                    className="edit-info-button"                >
                         {loading ? 'Saving...' : 'Save'}

                </button>
                <button
                    onClick={()=>{setEdit(false);
                      setFormData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        pseudo: user?.pseudo || '',
                        phone: user?.phone || '',
                      }); 
                    }}
                    hidden={!edit}
                    type='reset'
                    className="edit-info-cancel"                >
                        Cancel
                </button>
                  </form>
                  <div>
    {/* Other profile content */}
    <button
      onClick={()=> setIsModalOpen(true)}
      className="bg-red-500"
    >
      Delete My Account
    </button>
  </div>
        </div>
      ) : (
        <p className="text-yellow-500">
          Your email is not verified. Please check your inbox to verify your email and unlock all
          features.
          <br />
          <a
            href='#'
            className="text-blue-500 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              // Logic to resend verification email
              fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/send_verification_email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ email: user.email,userid: params.user_id }),
              })
                .then((res) => {
                  if (res.ok) {
                    alert("Verification email resent. Please check your inbox.");
                  } else {
                    alert("Failed to send verification email.");
                  }
                })
                .catch((err) => localStorage.setItem('error',err.message));
            }}
       >Click here to send verification e-mail</a>
       </p>
      )}
      {!user.password && <div>
        <h1>Set up a password to protect your account</h1>
        <form action="">
        </form>
        <div>
    {/* Other profile content */}
    <button
      onClick={()=>{setIsModalOpen(true)}}
      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4"
    >
      Delete My Account
    </button>
    <div className="modal-z-index">
    <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(password) => {
          setIsModalOpen(false);
          localStorage.setItem('ismodalopen',isModalOpen.toString())
          handleDeleteAccount(password);
        }}
      />
      </div>
  </div>
      </div> }
      </div>
  );
}
      

export default ProfilePage;