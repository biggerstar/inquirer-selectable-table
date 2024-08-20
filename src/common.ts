/**
 * 是否是中文字符
 * */
export function isChineseChar(char: string) {
  return /[\u4e00-\u9fff]/.test(char);
}
/**
 * 看看有多少个中文字符
 * */
export function findChineseLength(str: string) {
  const newLen =  str.replace(/[\u4e00-\u9fff]/g, '').length;
  return str.length - newLen;
}
