import React from "react";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Player from "../../components/Player/Player";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Player />
      <Footer />
    </>
  );
}
