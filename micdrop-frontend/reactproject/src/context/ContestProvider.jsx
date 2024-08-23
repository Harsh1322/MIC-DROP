import { Dispatch,createContext,useState } from "react";


const defaultState={
    startContest:'',
    setStartContest:(_value)=>{},
}

export const ContestContext=createContext(defaultState);


export const ContestProvider = ({children}) => {
  const [startContest,setStartContest]=useState('');
  return(
    <ContestContext.Provider value={{startContest,setStartContest}}>
{children}
    </ContestContext.Provider>
  )
}

