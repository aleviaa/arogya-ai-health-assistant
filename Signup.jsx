import { useNavigate } from "react-router-dom";

export default function Signup(){
  const nav = useNavigate();

  return(
    <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
      <div className="card p-4 shadow" style={{width:"380px"}}>
        <h2 className="text-center mb-4 fw-bold">Create Account</h2>

        <input className="form-control mb-3" placeholder="Email"/>
        <input className="form-control mb-3" placeholder="Password" type="password"/>

        <button className="btn btn-success w-100 mb-2" onClick={()=>nav("/")}>Signup</button>

        <p className="text-center">
          Already have an account? <b style={{cursor:"pointer"}} onClick={()=>nav("/")}>Login</b>
        </p>
      </div>
    </div>
  )
}
