import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
// 实际上不同宿主环境，都要实现各自的hostConfig
import { Container } from 'hostConfig';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	ref: Ref;

	memoizedProps: Props | null;
	memoizedState: any;
	alternate: FiberNode | null;
	flags: Flags;
	updateQueue: unknown;

	// tag: 节点类型（数字编号）
	// pendingProps: 是接下来会改变的属性
	// key: 对应reactElement的key
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例的属性
		this.tag = tag; // 节点类型（仅仅是数字编号）
		this.key = key;
		// HostComponent <div> div DOM
		this.stateNode = null; // 保存了dom
		// FunctionComponent () => (<div></div>)
		this.type = null; // 节点实际类型

		// 节点关系,构成树状结构
		this.return = null; // 指向父节点，因为作为工作单位，深度遍历的顺序当前工作完就指向父节点
		this.sibling = null; // 兄弟节点
		this.child = null; // 子节点
		this.index = 0; // 在同级节点中的索引

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps; // 刚开始工作的props，是需要改变的属性
		this.memoizedProps = null; // 结束工作时候的props，工作后确定下来的属性
		this.memoizedState = null; // 更新完成的state，子element
		this.updateQueue = null; // 更新队列

		// 交替的树，如果当前是current的fibeNode树，另一个就是workInProgress的fiberNode树
		this.alternate = null;
		// 副作用(标记，也就是各种操作)
		this.flags = NoFlags;
	}
}

// 因为更新可能发生于任何部分，而更新只能从根节点开始（为什么？）
// 需要一个统一的根节点保存通用信息
export class FiberRootNode {
	container: Container; // 宿主环境挂载的节点，每个环境都不一样，
	current: FiberNode; // 当前fiberNode
	finishedWork: FiberNode | null; // 更新完成的fiberNode
	constructor(container: Container, hostRootFiber: FiberNode) {
		// 联系hostRootFiber
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

// 创建WorkInProgress
export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	// workInProgress简写
	// 要返回的是对应的 workInProgress，双缓存（current 和 workInProgress）
	let wip = current.alternate;

	if (wip === null) {
		// mount（首屏渲染）
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update（更新）
		wip.pendingProps = pendingProps;
		// 清除副作用（上次更新的不要留着）
		wip.flags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue; // current 和 workInProgress 共用一个updateQueue
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
};
