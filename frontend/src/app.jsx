import './app.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import  {ReportResultPage}  from './pages/ReportResultPage';
import AppBar from './components/AppBar';
import {BiblioResultPage} from './pages/BiblioResultPage';

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
      path: '/results/report',
      element: (
        <>
          <AppBar />
          <ReportResultPage />
        </>
      ),
    },
    {
      path: '/results/biblio',
      element: (
        <>
          <AppBar />
          <BiblioResultPage />
        </>
      ),
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
