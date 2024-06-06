import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Bingo from './Bingo';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Verdana, sans-serif;
  }
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Bingo />,
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <GlobalStyle />
    <RouterProvider router={router} />
  </>
);