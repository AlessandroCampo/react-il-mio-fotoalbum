import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();
// Definiamo un custom Provider
function GlobalProvider({ children }) {
    // Aggiungiamo le varibili di stato che vogliamo condividere
    const [store, setStore] = useState({});
    return (
        <GlobalContext.Provider
            value={{
                store,
                setStore,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
// Definiamo un hook per consumare il contesto
function useGlobal() {
    const context = useContext(GlobalContext);
    return context;
}
export { GlobalProvider, useGlobal }