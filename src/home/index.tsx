import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.less';

const functionClassification = [
  {
    key: 1, icon: require('../assets/设计.png'), blueIcon: require('../assets/设计-蓝色.png'), title: '设计', description: '提供完善的设计原则、实践案例、设计规范和典型模板，帮助设计师、产品经理、开发人员快速产出高质量产品。',
  },
  {
    key: 2, icon: require('../assets/文档.png'), blueIcon: require('../assets/文档-蓝色.png'), title: '文档', description: '统一完备的设计与开发文档，确保实践的一致性，致力于提供给程序员愉悦的开发体验。',
  },
  {
    key: 3, icon: require('../assets/组件.png'), blueIcon: require('../assets/组件-蓝色.png'), title: '组件', description: '基于React的UI组件库，可以通过组件的Demo体验交互细节，开发人员既可以根据需要引用，也可以使用全局方式引入所有组件。',
  },
];

const contentMapping: any = {
  设计: require('../assets/design2.png'),
  文档: require('../assets/file2.png'),
  组件: require('../assets/components2.png'),
};

const Home = () => {
  const navigate = useNavigate();
  const [currentFunction, $currentFunction] = useState(0);
  const [click, $click] = useState(false);
  useEffect(() => {
    $currentFunction(1);
  }, []);

  const onTransitionEnd = () => {
    const commonFun = () => {
      if (currentFunction < functionClassification.length) {
        $currentFunction(currentFunction + 1);
      } else {
        $currentFunction(1);
      }
    };
    if (click) {
      const timer = setTimeout(() => {
        $click(false);
        commonFun();
        clearTimeout(timer);
      }, 10000);
    } else {
      commonFun();
    }
  };


  const onClick = (item: any) => () => {
    $click(true);
    $currentFunction(item.key);
  };
  return (
    <div className='home'>
      <div className='banner'>
        <div className='banner-right'>
          <div className='banner-title'>UniIcon</div>
          <div className='banner-text'>企业级图标解决方案，有效管理团队图标库，开发者灵活调用</div>
          <div className='btn'>
            <div onClick={() => {
              navigate('/icon');
            }}>开始使用</div>
            <div onClick={() => {
              navigate('/design');
            }}>设计规范</div>
          </div>
        </div>
      </div>
      <div className='section'>
        <div className='production'>
          <div className='production-header'>产品特点</div>
          <div className='production-content'>
            <div>
              <div className='img'></div>
              <div className='title'>特征</div>
              <div className='description'>特征描述特征描述特征描述特征描述特征描述特征描</div>
            </div>
            <div>
              <div className='img'></div>
              <div className='title'>特征</div>
              <div className='description'>特征描述特征描述特征描述特征描述特征描述特征描</div>
            </div>
            <div>
              <div className='img'></div>
              <div className='title'>特征</div>
              <div className='description'>特征描述特征描述特征描述特征描述特征描述特征描</div>
            </div>
          </div>
        </div>
        <div className='function'>
          <div className='function-header'>众多功能 全面覆盖</div>
          <div className="function-content">
              <div className="left">
                {functionClassification.map((item, index) => (
                  <div
                    key={item.key}
                    className={`item ${currentFunction === item.key ? 'currentFunction' : ''}`}
                    onClick={onClick(item)}
                  >
                    <div className="line" style={{ height: currentFunction === item.key ? '100%' : '0%', transition: currentFunction === item.key ? 'all 5s linear' : 'all 0s linear' }} onTransitionEnd={onTransitionEnd} />
                    <div className="icon">
                      <img
                        src={currentFunction === item.key ? item.blueIcon : item.icon}
                        alt=""
                        style={{
                          width: index === 0 ? 23 : index === 1 ? 24 : 28,
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                    <div>
                      <div className="title">{item.title}</div>
                      <div className="description">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="right">
                {currentFunction && <img src={contentMapping[functionClassification[currentFunction - 1].title]} alt="" />}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
};

export default Home;