import React from 'react';
import { Icon, Popover } from '@uni/design';
import { DataType } from './index';
import ReactIcon from '@uni/icons-react';

const CurrentIcon = (props: any) => {
  const {
    data ,
    setSimple,
    simple, batchData, active, setActive,
    lineWidth,
    size,
    popNode,
    handleClick,
    color,
    idx,
    title,
    isBatch = false,
  } = props;
 
  return (
    <div>
      <div className='right-header' id={`${title}图标`}>
        {data.length && <div className='info'>{`${title}图标（${data.length}）`}</div>}
        {idx === 0 && <div className='btns' style={{ marginRight: 16 }}>
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
              placement="rightTop"
              className='popIcon'
              visible={isBatch ? false : undefined}
              overlayStyle={{ height: 184 }}
            >
              <div
                className='current'
                style={{
                  width: simple ? 55 : 93,
                  height: simple ? 55 : 93,
                  margin: simple ? '0px 8px 8px 0px' : '0px 16px 16px 0px',
                  border: batchData.some((i: DataType) => i.englishName === item.englishName) ? '1px solid #326EFF' : undefined,
                }}
                onMouseOut={() => {
                  if (active === item.englishName) {
                    setActive('');
                  }
                }}
                onClick={handleClick.bind(null, item)}
              >
                <div className='icon-div' style={{ alignItems: simple ? 'center' : 'flex-end', height: simple ? 55 : 47 }}>
                  <ReactIcon spin={false} name={item.englishName || ''} lineWidth={lineWidth} style={{ fontSize: size, color: active === item.englishName ? 'rgb(74, 127, 255)' : color }} />
                </div>
                  {!simple && <div className='text'>{item.chineseName}</div>}
              </div>
            </Popover>
          </div>
        ))}
      </div>
    </div>
  )
};

export default CurrentIcon;