import CampaignTemplatesPage from "../CampaignTemplates/CampaignTemplatesPage/CampaignTemplatesPage";
import CharactersPage from "../Characters/CharactersPage";
import "./HomePage.css";

function HomePage () {
    return (
        <>
            <div className="home_page-characters">
                <CharactersPage />
            </div>
            <div className="home_page-mission_statement"></div>
            <div className="home_page-templates">
                <CampaignTemplatesPage />
            </div>
            <div className="home_page-dev_info"></div>
        </>
    );
}

export default HomePage;