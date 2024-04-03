import React, { useState } from "react";
import userIcon from "../img/user.png";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../auth/authContext";


const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, /* setError */] = useState('');
  const [errNoMatch, setNoMatch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
        setNoMatch('New password and confirm password do not match.');
        return;
    }
    console.log(currentUser.id);
    try {
      const res = await axios.put(`/user/${currentUser.id}/changepasword/`, {
        password,
        newPassword,
        confirmNewPassword
      });
      if (res.status === 200)
        setSuccessMessage(res.data.message);

    } catch (err) {
        console.log(err);
        setNoMatch(err.response.data.error || err.response.data);
    }
  };

  const handleUpdateImage = async () => {
    try {
        const pathImg = await upload();
        console.log(pathImg);
        const res = await axios.put(`/user/${currentUser.id}/profile/image/`, {pathImg});
        if (res.status === 200) {
            console.log(res.data)
        }
      } catch (err) {
        console.log(err);
    }
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const res = await axios.post("/user/imageUser", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h2>Profile</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <div className="container mt-5 profile">
        
        <div className="row">
            <div className="col-md-6">
                <h6 className="h6">Change Password</h6>
                <form onSubmit={handleChangePassword} className="inputsPassword">
                    <input type="password" className="form-control" placeholder="Current Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="password" className="form-control" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                    <input type="password" className="form-control" placeholder="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    {errNoMatch && <span style={{ color: 'red' }}>{errNoMatch}</span>}
                    <button className="btn-prim" type="submit">Change Password</button>
                </form>
            </div>
            <div className="col-md-6">
                <h6 className="h6">Update Profile Image</h6>
                <div>
                    <div className="mb-3">
                        <div className="d-flex justify-content-center mb-2">
                            <img id="selectedAvatar" src={imageUrl || userIcon} className="rounded-circle" width={100} height={100} alt="example placeholder" />
                        </div>
                        <input type="file" className="form-control form-control-sm" onChange={(e) => {setImage(e.target.files[0]); setImageUrl(URL.createObjectURL(e.target.files[0] || null));}} accept=".png, .jpg, .jpeg" id="photo" required />
                    </div><br />
                    <button type="button" className="btn-prim" onClick={handleUpdateImage} disabled={!image}>Update Image</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Profile;
