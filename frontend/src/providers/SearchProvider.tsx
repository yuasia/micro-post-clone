import { Dispatch, useState } from "react";
import { createContext } from "react";

export const SearchContext = createContext(
  {} as {
    searchText: string;
    setSearchText: Dispatch<React.SetStateAction<string>>;
  }
);

export const SearchProvider = (props: any) => {
  const { children } = props;
  const [searchText, setSearchText] = useState<string>("");

  return (
    <SearchContext.Provider value={{ searchText, setSearchText }}>
      {children}
    </SearchContext.Provider>
  );
};
