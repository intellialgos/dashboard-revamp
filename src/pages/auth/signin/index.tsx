import { Button, Input } from "antd";
import datareport from "../../../assets/signindatareport.png";
import { Logo } from "../../../components/logo";
import styles from "./index.module.css";
import { CloseCircleOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
    const navigate = useNavigate()
    const [showPassword,setShowPassword] = useState(false)
    const onHandleLogin = () =>{
        navigate("/dashboard")
    }
  return (
    <div className={styles.container}>
        <div className={styles.bg_img} />
      <div className={styles.login_card_container}>
        <div className={styles.login_card}>
          <Logo className={styles.logo} />
          <img
            className={styles.img}
            src={datareport}
            alt={"Data report"}
          />
          <div className={styles.input_container}>
            <label>Username</label>
            <Input placeholder="" className={styles.input_bg} suffix={<CloseCircleOutlined  />} />
          </div>
          <div className={styles.input_container}>
            <label>Password</label>
            <Input placeholder="" className={styles.input_bg} type={showPassword ? "text" :"password" }  suffix={showPassword ? <EyeOutlined onClick={()=>setShowPassword(!showPassword)}/>:<EyeInvisibleOutlined onClick={()=>setShowPassword(!showPassword)} />}  />
          </div>

          <Button type="primary" className={styles.primary_btn} onClick={()=>onHandleLogin()}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
