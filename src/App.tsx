import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuestbookForm from "./guestbook";
import Blog from "./blog";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/guestbook" element={<GuestbookForm />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
