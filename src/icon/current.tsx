import React from 'react';
import { Icon, Popover } from '@uni/design';
import ReactIcon from 'uni-icons-react';
import { DataType } from './index';

const CurrentIcon = (props: any) => {
  const {
    data , setSimple, simple, batchData, active, setActive,
    lineWidth,
    size,
    popNode,
    handleClick,
    color,
    idx,
    title,
  } = props;

  return (
    <>
      <div className='right-header'>
        {data.length && <div className='info'>{`${title}名称（${data.length}）`}</div>}
        {idx === 0 && <div className='btns'>
          <div
            className='btns-left'
            style={{ border: simple ? '1px solid #326EFF' : 'undefined', background: simple ? undefined : '#326EFF' }}
            onClick={() => setSimple(false)}
          >
            <Icon type="app-line" style={{ fontSize: 16, color: simple ? '#326EFF' : '#fff' }} />
          </div>
          <div
            className='btns-right'
            style={{ border: !simple ? '1px solid #326EFF' : 'undefined', background: !simple ? undefined : '#326EFF' }}
            onClick={() => setSimple(true)}
          >
            <div>
              <Icon type="more" style={{ fontSize: 16, display: 'block', color: !simple ? '#326EFF' : '#fff' }} />
              <Icon type="more" style={{ fontSize: 16, marginTop: -11, display: 'block', color: !simple ? '#326EFF' : '#fff' }} />
              <Icon type="more" style={{ fontSize: 16, marginTop: -11, display: 'block', color: !simple ? '#326EFF' : '#fff' }} />
            </div>
          </div>
        </div>}
      </div>
      <div className='right-section'>
        {data.map((item: DataType) => (
          <div key={item.englishName}>
            <Popover
              content={popNode(item)}
              placement="right"
              className='popIcon'
            >
              <div
                className='current'
                style={{
                  width: simple ? 55 : 93,
                  height: simple ? 55 : 93,
                  border: batchData.some((i: DataType) => i.englishName === item.englishName) ? '1px solid #326EFF' : undefined,
                }}
                onMouseOut={() => {
                  if (active === item.englishName) {
                    setActive('');
                  }
                }}
                onClick={handleClick.bind(null, item)}
              >
                <div style={{ width: '100%', padding: '0px 8px' }}>
                  <ReactIcon name={item.englishName} lineWidth={lineWidth} style={{ fontSize: size, color: active === item.englishName ? 'rgb(74, 127, 255)' : color }} />
                  {!simple && <div className='text'>{item.chineseName}</div>}
                </div>
              </div>
            </Popover>
          </div>
        ))}
      </div>
    </>
  )
};

export default CurrentIcon;