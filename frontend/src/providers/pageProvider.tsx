import { createContext, useState } from "react";

export const PageContext = createContext(
  {} as {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
  }
);

export const PageProvider = (props: any) => {
  const { children } = props;
  const [page, setPage] = useState<number>(1);

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
};
