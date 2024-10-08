import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const tokenType = params.get('token_type');

    if (accessToken && tokenType) {
      localStorage.setItem(`${tokenType}_access_token`, accessToken);
      navigate('/transfer');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default Callback;