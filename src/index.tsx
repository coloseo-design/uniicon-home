import ReactDOM from 'react-dom/client';
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import File from './file';
import Layout from './layout';
import Design from './design';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Layout>
      <HashRouter>
        <Routes>
          <Route  element={<Home />} path="/" />
          <Route  element={<File />} path="/file" />
          <Route  element={<Design />} path="/design" />
        </Routes>
      </HashRouter>
    </Layout>
  </React.StrictMode>,
)