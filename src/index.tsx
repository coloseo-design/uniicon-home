import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import File from './file';
import Layout from './layout'

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route  element={<Home />} path="/" />
          <Route  element={<File />} path="/file" />
        </Routes>
      </BrowserRouter>
    </Layout>
  </React.StrictMode>,
)