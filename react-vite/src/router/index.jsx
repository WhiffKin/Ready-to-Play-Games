import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import UsersPage from '../components/Users/UsersPage';
import SingleUserPage from '../components/Users/SingleUserPage';
import CharactersPage from '../components/Characters/CharactersPage';
import SingleCharacterPage from '../components/Characters/SingleCharacterPage';
import CreateCharacterPage from '../components/Characters/CreateCharacterPage';
import UpdateCharacterPage from '../components/Characters/UpdateCharacterPage';
import SingleCampaignTemplatePage from '../components/CampaignTemplates/SingleCampaignTemplatePage/SingleCampaignTemplatePage';
import CampaignTemplatesPage from '../components/CampaignTemplates/CampaignTemplatesPage/CampaignTemplatesPage';
import { CampaignTemplateProvider } from '../context/CampaignTemplate/CampaignTemplate';
import CreateCampaignTemplate from '../components/CampaignTemplates/CreateCampaignTemplate/CreateCampaignTemplate';
import NotFound from '../components/NotFound';
import CampaignsPage from '../components/Campaigns/CampaignsPage';
import HomePage from '../components/HomePage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: 
      <>
        <Layout />
        <NotFound />
      </>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/:userId",
        element: <SingleUserPage />,
      },
      {
        path: "characters",
        element: <CharactersPage />
      },
      {
        path: "characters/:charId",
        element: <SingleCharacterPage />
      },
      {
        path: "characters/:charId/update",
        element: <UpdateCharacterPage />
      },
      {
        path: "characters/new",
        element: <CreateCharacterPage />
      },
      {
        path: "templates",
        element: <CampaignTemplatesPage />
      },
      {
        path: "templates/:tempId",
        element: <SingleCampaignTemplatePage />
      },
      {
        path: "templates/new",
        element:
        <CampaignTemplateProvider>
          <CreateCampaignTemplate />
        </CampaignTemplateProvider> 
      },
      {
        path: "campaigns",
        element: <CampaignsPage />
      },
    ],
  },
]);