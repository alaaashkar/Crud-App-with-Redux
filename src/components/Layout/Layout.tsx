import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserList } from "../../state/UsersSlice";
import { AppDispatch } from "../../state/store";

export const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    dispatch(fetchUserList());
  }, []);


  return (
    <div className="App">
      <Navbar
      />

      <Outlet
      />
    </div>
  )
};
