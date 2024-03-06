import { createContext, useContext, useState } from "react";

const CampaignTemplateContext = createContext();

export const useCampaignTemplateContext = () => useContext(CampaignTemplateContext);

export function CampaignTemplateProvider({ children }) {
    const [reset, setReset] = useState(false)

    const contextValue = {
        reset, 
        setReset,
    };
    
    return (
        <>
            <CampaignTemplateContext.Provider value={contextValue}>
                {children}
            </CampaignTemplateContext.Provider>
        </>
    )
}