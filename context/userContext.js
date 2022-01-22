import { createContext, useState } from "react";

const UserContext = createContext();

export default function User({ children }) {
  const [hearts, setHearts] = useState(true);

  return (
    <UserContext.Provider
      value={{
        hearts,
        setHearts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const UserContextConsumer = UserContext.Consumer;

export { UserContextConsumer, UserContext };
