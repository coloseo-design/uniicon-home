import ReactDOM from 'react-dom/client';
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import Design from './design';
import Layout from './layout';
import IconPage from './icon';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
      <HashRouter>
        <Layout>
          <Routes>
            <Route  element={<Home />} path="/" />
            <Route  element={<Design />} path="/design" />
            <Route  element={<IconPage />} path="/icon" />
          </Routes>
        </Layout>
      </HashRouter>
  </React.StrictMode>,
)