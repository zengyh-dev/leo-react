// 宿主环境可能不支持symbol
const supportSymbol = typeof Symbol === 'function' && Symbol.for;

// Symbol.for(key) 方法会根据给定的键 key，来从运行时的 symbol 注册表中找到对应的 symbol
// 如果找到了，则返回它
// 否则，新建一个与该键关联的 symbol，并放入全局 symbol 注册表中
export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7;
