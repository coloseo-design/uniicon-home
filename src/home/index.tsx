import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.less';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='home' onClick={() => {
      navigate('/file');
    }}>
      <div className='banner'></div>
      <div className='production'>
        <div className='production-header'>产品特点</div>
      </div>
      <div className='function'>
        <div className='function-header'>众多功能 全面覆盖</div>
      </div>
    </div>
  )
};

export default Home;