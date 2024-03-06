import { createContext, useContext } from "react";

const CampaignTemplateContext = createContext();

export const useCampaignTemplateContext = () => useContext(CampaignTemplateContext);

export function CampaignTemplateProvider({ children }) {
    

    const contextValue = {
        
    };
    
    return (
        <>
            <CampaignTemplateContext.Provider value={contextValue}>
                {children}
            </CampaignTemplateContext.Provider>
        </>
    )
}