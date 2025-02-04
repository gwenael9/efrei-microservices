import React from "react";
import Layout from "../../components/Layout/Layout";
import LoginForm from "../../components/Auth/login.form";

export default function Login() {

  return (
    <Layout title="Connexion">
      <LoginForm />
    </Layout>
  );
}
