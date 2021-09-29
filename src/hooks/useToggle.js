import { useState } from 'react';

const useToggle = (defaultState) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const toggle = () => setIsOpen(!isOpen);

  return [isOpen, toggle];
};

export default useToggle;
