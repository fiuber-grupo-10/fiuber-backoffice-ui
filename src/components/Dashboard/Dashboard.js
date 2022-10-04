import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("Error obteniendo los datos de usuario");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (error) { 
      alert(error)
    }
    fetchUserName();
  });
  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Inició sesión como
         <div>{name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Cerrar sesión
         </button>
       </div>
     </div>
  );
}
export default Dashboard;