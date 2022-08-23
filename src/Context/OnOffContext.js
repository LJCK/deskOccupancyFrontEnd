import { useContext } from "react";
import { createContext,useState } from "react";

const OnOffContext = createContext()

export function useCustemContext(){
  return useContext(OnOffContext)
}

export const OnOffContextProvider = ({children})=>{
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  return (
    <OnOffContext.Provider value = {{isSideBarOpen, setIsSideBarOpen}}>
      {children}
    </OnOffContext.Provider>
  )
}