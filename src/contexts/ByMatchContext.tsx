import { createContext, useContext, useState } from "react";

type ByMatchContextType = {
    byMatch: boolean;
    setByMatch: (value: boolean) => void;
};

const ByMatchContext = createContext<ByMatchContextType | undefined>(undefined);

export function ByMatchProvider({ children }: { children: React.ReactNode }) {
    const [byMatch, setByMatch] = useState<boolean>(false);
    console.log(byMatch);
    return (
        <ByMatchContext.Provider value={{ byMatch, setByMatch }}>
            {children}
        </ByMatchContext.Provider>
    );
}

export function useByMatch() {
    const context = useContext(ByMatchContext);
    if (!context) throw new Error("useByMatch must be used inside an AuthProvider");
    return context;
}
