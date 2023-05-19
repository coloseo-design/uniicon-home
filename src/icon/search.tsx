import React, { useState, useMemo } from 'react';
import { Icon, Button, Checkbox, Message } from '@uni/design';
import { DataType, ListType } from './index';
import { BatchDownload,  objectToSvg} from '../utils';

const Search = (props: any) => {
  const {
    $search, searchValue, isBatch,
    setChecked, batchData, resultData,
    isChecked, setBatchData,
    size, color, lineWidth,
    $isBatch,
  } = props;
  const [isOver, $over] = useState(false);
  const [temValue, $temValue] = useState(''); // 临时的搜索值用来在中文拼音输入完成时更新真正的搜索值
  const [isChinaStart, $isChinaStart] = useState(false); // 是否开始中文拼音输入

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value =  e.target.value;
    $temValue(value);
    if (isChinaStart) return;
    $search(value);
  };

  const onCompositionStart = () => {
    $isChinaStart(true);
  };

  const onCompositionEnd = () => {
    $isChinaStart(false);
    $search(temValue);
  };

  const handleEnter = () => {
    if (searchValue) {
      $over(true);
    }
  };

  const handleLeave = () => {
    if (isOver) {
      $over(false);
    }
  };

  const ChoseCurrentAll = () => {
    const tem = [...batchData];
    const lastData = (Object.values(resultData).map((i: any) => i.data) as any).flat(2);
    (lastData || []).forEach((item: DataType) => {
      if (!batchData.some((i: DataType) => i.englishName === item.englishName)) {
        tem.push(item);
      }
   });
   setBatchData([...tem]);
  };

  const handleExport = () => {
    const list: ListType[] = [];
    const exportData = isBatch ? batchData : (Object.values(resultData).map((i: any) => i.data) as any).flat(2);
    if (exportData.length) {
      exportData.forEach((item: DataType) => {
        list.push({
          name: `${item.englishName}-${item.chineseName}` || '',
          svgHTML: objectToSvg(item, size, color, lineWidth),
        });
      });
      BatchDownload(list);
    } else {
      Message.error('请选择图标');
    }
  };

  const BatchBtn = useMemo(() => (
    <div className='btn'>
      <Button
        disabled={isChecked}
        style={{ color: isChecked ? undefined : '#5c6785' }}
        onClick={ChoseCurrentAll}>
        全部
      </Button>
      <Button
        onClick={handleExport}
        style={{ margin: '0px 12px' }}
        type='primary'
      >
        导出
      </Button>
      <Button
        onClick={() => {
          $isBatch(false);
          setChecked(false);
          setBatchData([]);
        }}
        style={{ color: '#5c6785' }}
      >取消</Button>
    </div>
  ), [isChecked]);

  const Btn = useMemo(() => (
    <div className='btn'>
      <Button
        style={{ marginRight: 16, color: '#5c6785' }}
        onClick={() => $isBatch(true)}
      >
        <Icon type="add" style={{ fontSize: 12 }} />
        批量操作
      </Button>
      <Button onClick={handleExport} type="primary">全部导出</Button>
    </div>
  ), [])

  return (
    <div className='icon-header'>
    <div className='user'></div>
    <div className='search-content'>
      <div className='input'>
        <input
          onChange={handleChange}
          placeholder='输入图标关键词'
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          value={temValue}
        />
        <span
          onMouseEnter={handleEnter}
          onClick={() => {
            if (searchValue) {
              $search('');
              $temValue('');
            }
          }} 
          className='search-icon'          
        >
          <Icon
            type={searchValue && isOver ? 'delete' : 'search'}
            
          />
        </span>
      </div>
      {isBatch && <div style={{ marginTop: 5, marginLeft: 16 }}>
          <Checkbox
          onChange={(checked) => {
            setChecked(checked);
          }}
          >
            <span style={{ color: '#3e445f' }}>
              仅看已选
              {batchData.length}/{(Object.values(resultData).map((i: any) => i.data) as any).flat(2).length}
              </span>
          </Checkbox>
        </div>}
    </div>
      {isBatch ? BatchBtn : Btn}
  </div>
  )
};

export default Search;