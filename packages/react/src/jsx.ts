import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	Type,
	Key,
	Ref,
	Props,
	ReactElementType,
	ElementType
} from 'shared/ReactTypes';

const ReactElement = (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType => {
	// 定义一个react element
	// 无法表达
	const element = {
		$$typeof: REACT_ELEMENT_TYPE, // 内部使用字段，表明当前字段是react element
		type, // 元素类型
		key, // 索引
		ref, // 引用
		props, // 属性
		__mark: 'leo' // 用于区分真实的react
	};
	return element;
};

export const createElement = (
	type: ElementType,
	config: { [key: string]: any },
	...maybeChildren: any // 子元素可能会有多个
) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

	// config中的key和ref要单独提取出来，作为创建reactElement的参数
	for (const prop in config) {
		const val = config[prop];

		if (prop === 'key') {
			// 提取key
			if (val !== undefined) {
				key = String(val);
			}
			continue;
		}

		if (prop === 'ref') {
			// 提取ref
			if (val !== undefined) {
				ref = String(val);
			}
			continue;
		}

		if (Object.prototype.hasOwnProperty.call(config, prop)) {
			// 只复制私有的，不复制原型上的
			props[prop] = val;
		}
	}
	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		// child  |  [child, child, child]
		if (maybeChildrenLength === 1) {
			// 单独一个reactElement
			props.children = maybeChildren[0];
		} else {
			// reactElement数组
			props.children = maybeChildren;
		}
	}
	return ReactElement(type, key, ref, props);
};

export const jsx = (
	type: ElementType,
	config: { [key: string]: any },
	maybeKey: any
) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

	if (maybeKey !== undefined) {
		key = '' + maybeKey;
	}

	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			// 特殊处理key
			if (val !== undefined) {
				key = String(val);
			}
			continue;
		}
		if (prop === 'ref') {
			// 特殊处理ref
			if (val !== undefined) {
				ref = String(val);
			}
			continue;
		}
		if (Object.prototype.hasOwnProperty.call(config, prop)) {
			// 只复制私有的，不复制原型上的
			props[prop] = val;
		}
	}
	return ReactElement(type, key, ref, props);
};

// 开发环境jsx和测试环境jsxDEV是一样的
// 真实的react不一样，测试环境会处理
export const jsxDEV = jsx;
