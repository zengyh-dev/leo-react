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
		$$typeof: REACT_ELEMENT_TYPE, // 内部使用字段
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
	...maybeChildren: any
) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

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
	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		// [child]  |  [child, child, child]
		if (maybeChildren === 1) {
			// 一个reactElement
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

export const jsxDEV = jsx;
