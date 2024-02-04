import {createContext} from 'react';

// Creating a context, as React Native, supposedly, does not support
// passing functions directly in the navigation state. 
const AuthContext = createContext({
    whenLoginSuccess: () => {},
    whenLogoutSuccess: () => {},
    whenUserDeleted: () => {},
  })
  
export default AuthContext;