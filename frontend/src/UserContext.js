import React from 'react';

const UserContext = React.createContext({
  anonymous: false, name: 'stranger',
});

export default UserContext;
