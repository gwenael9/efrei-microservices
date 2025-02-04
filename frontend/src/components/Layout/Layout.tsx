import Head from "next/head";
import { Header } from "./Header";
import { ReactNode } from "react";
import { Toaster } from "../ui/toaster";
import React from "react";

interface LayoutProps {
    title: string;
    children: ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <main>{children}</main>
      <Toaster />
    </>
  );
}
