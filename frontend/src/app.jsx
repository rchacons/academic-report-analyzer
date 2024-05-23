import './app.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/homepage/HomePage';
import { ResultPage } from './pages/result-page/ResultPage';
import AppBar from './components/AppBar';

export const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <AppBar />
          <HomePage />
        </>
      ),
    },
    {
      path: '/results',
      element: (
        <>
          <AppBar />
          <ResultPage />
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
