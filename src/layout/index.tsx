import React from 'react';
import Header from './header';
import './index.less';


const Layout = (props: any) => {
  const tabs = [
    { title: '设计', key: 'design' },
    { title: '文档', key: 'file' },
    { title: '组件', key: 'develop' },
    { title: '下载', key: 'download' },
  ];
  return (
    <div>
      <Header tabs={tabs} />
      <div className='layout-content'>{props.children}</div>
    </div>
  )
};

export default Layout;
