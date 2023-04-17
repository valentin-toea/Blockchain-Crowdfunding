import { styled } from "@stitches/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { supabase } from "../../supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (!email && !password) {
      setError("Empty fields");
      return;
    }

    try {
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
      else toast.success("Logged in successfully.");
    } catch (error: any) {
      setError(error.error_description || error.message);
      toast.error(error.error_description || error.message);
    }
  };

  return (
    <LoginPage>
      <Card css={{ padding: 50 }}>
        <Form>
          <h3>Login</h3>
          <TextField
            bold
            type="email"
            placeholder="email"
            value={email}
            onChange={(event) => {
              setError("");
              setEmail(event.target.value);
            }}
            error={!!error}
          />
          <TextField
            bold
            placeholder="password"
            type="password"
            value={password}
            onChange={(event) => {
              setError("");
              setPassword(event.target.value);
            }}
            error={!!error}
          />
          <label style={{ color: "red" }}>{error}</label>
          <Button onClick={handleLogin} color="violet300">
            SUBMIT
          </Button>
        </Form>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 10 }}
        >
          <Link to="/signup" style={{ marginTop: 40, maxWidth: "100%" }}>
            To Signup
          </Link>
        </div>
      </Card>
    </LoginPage>
  );
};

export default Login;

const LoginPage = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 300,
});

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  width: 300,
  gap: 20,
});
