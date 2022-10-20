import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = (props: any) => {
  const { tabs } = props;
  const [isSun, setSun] = useState(true);
  const [isHover, setHover] = useState(false);
  const [isHover1, setHover1] = useState(false);
  const [daytime, $daytime] = useState(false);

  const handleChose = () => {
    setSun(!isSun);
    setHover(false);
    $daytime(!daytime);
  };

  const navigate = useNavigate();

  return (
    <div className="header">
      <div className='left'>
        <div className='logo' onClick={() => navigate('/')}>
          <img src={require('../assets/logo.svg')} alt="" />
        </div>
        <div className="search" />
      </div>
      <div className='right'>
      <div className="tabs">
        {tabs.map((item: any) => (
          <div
            key={item.key}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className="change-time" style={{ position: 'relative' }}>
        <img
          src={isSun
            ? (isHover1 ? require('../assets/light-active.png') : require('../assets/daytime.png'))
            : (isHover1 ? require('../assets/dark-active.png') : require('../assets/dark-night.png'))}
          alt=""
          onClick={() => $daytime(!daytime)}
          onMouseOver={() => setHover1(true)}
          onMouseLeave={() => setHover1(false)}
        />
        {daytime && (
          <img
            src={!isSun
              ? (isHover ? require('../assets/light-active.png') : require('../assets/daytime.png'))
              : (isHover ? require('../assets/dark-active.png') : require('../assets/dark-night.png'))}
            alt=""
            onClick={handleChose}
            className="dropImg"
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          />
        )}
      </div>
      <div className='header-user'>
        您好，请登录
        <img
          src={require('../assets/login.png')}
          alt=""
          style={{
            width: 6, height: 10, marginLeft: 8,
          }}
        />
      </div>
      </div>
    </div>
  )
};

export default Header;