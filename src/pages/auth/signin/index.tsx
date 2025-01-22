import { Button, Form, Input, message } from "antd";
import datareport from "@/assets/signindatareport.png";
import { Logo } from "@/components/logo";
import styles from "./index.module.css";
import { CloseCircleOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services";
import { setUserCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import { Navigate, useLocation } from "react-router-dom";

function SignIn() {
    const token = useAppSelector((state) => state.authState.token);
    const location = useLocation();
    const [ loginRequest, {isLoading, data} ] = useLoginMutation();
    const [showPassword,setShowPassword] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useAppDispatch();

    useEffect(() => {
      if ( data ) {
        // If Error
        if ( data?.error ) {
          messageApi.open({
            type: "error",
            content: "You have entered wrong credentials",
          });
        } else {
          messageApi.open({
            type: "success",
            content: "You logged in successfully !",
          });

          dispatch(setUserCredentials({
            user: data.user,
            token: data.token,
          }))
        }
      }
    }, [data]);

  return (
    token ?
    <Navigate to={'/dashboard'} state={{from: location}} replace />
    : <div className={styles.container}>
      {contextHolder}
      <Form
        onFinish={(data) => {
          loginRequest(data);
        }}
      >
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
            <Form.Item
              name={'userName'}
              rules={[
                {
                  required: true,
                  message: "Please enter your username"
                }
              ]}
            >
              <Input placeholder="" className={styles.input_bg} suffix={<CloseCircleOutlined  />} />
            </Form.Item>
          </div>
          <div className={styles.input_container}>
            <label>Password</label>
            <Form.Item
              name={'password'}
              rules={[
                {
                  required: true,
                  message: "Please enter your password"
                }
              ]}
            >
              <Input placeholder="" className={styles.input_bg} type={showPassword ? "text" :"password" }  suffix={showPassword ? <EyeOutlined onClick={()=>setShowPassword(!showPassword)}/>:<EyeInvisibleOutlined onClick={()=>setShowPassword(!showPassword)} />}  />
            </Form.Item>
          </div>

          <Button htmlType="submit" type="primary" loading={isLoading} className={styles.primary_btn}>
            Login
          </Button>
        </div>
      </div>
      </Form>
    </div>
  );
}

export default SignIn;
