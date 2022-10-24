import svgToImage from 'svg-to-image';
import JSZip from 'jszip';
import { DataType, ListType } from './icon/index';


function childrenLoop(data: DataType[], info: any): string {
  const { color, lineWidth, type, isSpecial } =  info;
  let result = '';
  (data || []).forEach((item: any) => {
    let res = '';
    if (type === 'Surface') {
      if (item.attrs && !isSpecial) {
        Object.assign(item.attrs, {
          fill: color || 'currentColor',
        });
      }
    }
    if (type === 'Line') {
      if (item.attrs) {
        Object.assign(item.attrs, {
          stroke: item.attrs.stroke && item.attrs.stroke !== 'none' ? color || 'currentColor' : 'none',
          fill: item.attrs.fill && item.attrs.fill !=='none' ? color || 'currentColor' : 'none',
        })
        lineWidth  && Object.assign(item.attrs, {
          'stroke-width': item.attrs['stroke-width'] && item.attrs['stroke-width'] !== 'none' ? lineWidth : 'none',
        });
      }
    }
    for (const key in item.attrs) {
      res += ` ${key}="${item.attrs[key]}"`
    }
    result += ` <${item.tag} ${res}>${item.children && item.children.length > 0 ? childrenLoop(item.children, info) : ''}</${item.tag}>`
  });
  return result
}

export function objectToSvg(icon: DataType, size: number, color: string, lineWidth: number) { // 把对象转成svg标签字符串
  const info = { color, lineWidth, type: icon.type || '', isSpecial: icon.isSpecial };
  const children = icon.children && icon.children.length > 0 ? childrenLoop(icon.children, info) : '';
  const svg = `<svg viewBox="${icon.attrs.viewBox}" fill="${icon.attrs.fill}" width="${size}px" height="${size}px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${children}</svg>`;
  return svg;
}


export function DownloadCopyPNG(icon: DataType, size: number, color: string, lineWidth: number, isDownload: boolean = false) {
  const data = [objectToSvg(icon, size, color, lineWidth)];
  svgToImage(data, (err: any, image: any) => { // 将svg转换成图片
    if (err) throw err;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    context?.drawImage(image, 0, 0);
    if (isDownload) { // 下载png
      Download(canvas.toDataURL('image/png'), `${icon.englishName}-${icon.chineseName}` || '');
    } else { // 复制图片
      canvas.toBlob(async (blob) => {
        if (blob) {
          const item = new ClipboardItem({ [blob.type]: blob });
          await navigator.clipboard.write([item]);
        }
      });
    }
  });
}


export function DownloadCopySVG(icon: DataType, size: number, color: string, lineWidth: number, isDownload: boolean = false) {
  const svg = objectToSvg(icon, size, color, lineWidth);
  if (isDownload) { // 下载svg
    const svg = objectToSvg(icon, size, color, lineWidth);
    const blob = new Blob([svg], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    Download(url, `${icon.englishName}-${icon.chineseName}` || '');
  } else { // 复制svg
    Copy(svg);
  }
}

export function BatchDownload(data: ListType[]) { // 批量下载
  const zip = new JSZip();
  data.forEach((obj) => zip.file(obj.name + '.svg', obj.svgHTML));
  zip.generateAsync({ 
    type: 'blob'
  }).then((content) => {
    const filename = 'download' + '.zip';
    Download(URL.createObjectURL(content), filename);
  });
}

export function Copy(content: string) { // 复制
  const aux = document.createElement("textarea"); 
  aux.value = content;
  document.body.appendChild(aux); 
  aux.select();
  if (document.execCommand("copy")) {
    document.execCommand("copy"); 
  }
  document.body.removeChild(aux);
}


export function Download(url: string, name: string = 'download'){ // 下载
  const oA = document.createElement("a");
  oA.download = name;// 设置下载的文件名，默认是'下载'
  oA.href = url;
  document.body.appendChild(oA);
  oA.click();
  oA.remove();
}
