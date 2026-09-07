
import React, { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import {validateEmail} from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';
import { API_PATHS } from '../../utils/api.Paths';

function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {updateUser}=useContext(UserContext)
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl=""

    // Basic validation
    if (!fullName || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("")
    // Example: API call or local signup logic
    
    try{
      if(profilePic)
      {
        const imgUploadRes=await uploadImage(profilePic)
        profileImageUrl=imgUploadRes.imageurl || ""
      }
      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
      fullName,
      email,
      password,
      profileImageUrl
      })
      const {token,user}=response.data
      if(token)
      {
        localStorage.setItem("token",token)
        updateUser(user)
        navigate("/dashboard")
      }
    }
    catch(error)
    {
      if(error.response && error.response.data.message)
      {
       setError(error.response.data.message)
      }
      else{
        setError("Something went wrong. Please try again.")
      }
    }
  };

  return (
    <AuthLayout reverse>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-l font-semibold text-black">Create an Account</h3>
        <p className="text-l font-semibold text-black mt-1.25 mb-6">
          Join us by entering your details
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />

            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Min 8 characters"
                type="password"
              />
            </div>
          </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="btn-primary"
          >
            SIGN UP
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?
            <Link className='font-medium text-primary underline' to="/login">
            Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;