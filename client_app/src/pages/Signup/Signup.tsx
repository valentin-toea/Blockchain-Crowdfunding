import { styled } from "@stitches/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { supabase } from "../../supabaseClient";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [error, setError] = useState("");

  const handleSignup = async (e: any) => {
    e.preventDefault();

    if (password !== copyPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    if (!firstName.length || !lastName.length) {
      setError("First name or last name are empty.");
      toast.error("First name or last name are empty.");
      return;
    }

    try {
      const { user, session, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (user) {
        const { data, error: error2 } = await supabase.from("profiles").insert({
          firstName,
          lastName,
          email: user?.email,
          userId: user?.id,
        });
      }

      console.log(user, session, error);
      if (error) throw error;
      toast.success("Account created");
    } catch (error: any) {
      toast.error(error.error_description || error.message);
      setError(error.error_description || error.message);
    }
  };

  return (
    <SignupPage>
      <Card css={{ padding: 50 }}>
        <Form>
          <h3>Sign Up</h3>
          <TextField
            bold
            type="email"
            placeholder="Andrew"
            label="First Name"
            value={firstName}
            onChange={(event) => {
              setError("");
              setFirstName(event.target.value);
            }}
          />
          <TextField
            bold
            type="email"
            placeholder="Chr"
            label="Last Name"
            value={lastName}
            onChange={(event) => {
              setError("");
              setLastName(event.target.value);
            }}
          />
          <TextField
            label="Email"
            placeholder="email"
            value={email}
            onChange={(event) => {
              setError("");
              setEmail(event.target.value);
            }}
          />
          <TextField
            label="Password"
            placeholder="*****"
            type="password"
            value={password}
            onChange={(event) => {
              setError("");
              setPassword(event.target.value);
            }}
          />
          <TextField
            label="Check Password"
            placeholder="*****"
            type="password"
            value={copyPassword}
            onChange={(event) => {
              setError("");
              setCopyPassword(event.target.value);
            }}
          />
          <label style={{ color: "red" }}>{error}</label>
          <Button onClick={handleSignup} color="violet300">
            SUBMIT
          </Button>
        </Form>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 10 }}
        >
          <Link to="/login" style={{ marginTop: 40 }}>
            To Login
          </Link>
        </div>
      </Card>
    </SignupPage>
  );
};

export default Signup;

const SignupPage = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 50,
});

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  width: 300,
  gap: 20,
});
