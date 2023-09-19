import { ReactElementType } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';

// 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
	// 比较，返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText: // 没有子节点，直接返回null
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
	return null;
};

// 更新hostRoot
function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;

	// 执行render(<App />)时候调用updateContainer，创建了updateQueue
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	// pending（等待执行的一个update）就是一个包含<App />元素的对象
	const pending = updateQueue.shared.pending;

	// 更新操作
	const { memoizedState } = processUpdateQueue(baseState, pending);
	// 最新状态，在这里其实就是<App/>这个元素
	wip.memoizedState = memoizedState;

	// 更新完pending就没有用了，赋值为null
	updateQueue.shared.pending = null;

	// 通过对比 子current fiberNode与子 reactElement，生成子对应wip fiberNode
	const nextChildren = wip.memoizedState; // 子reactElement
	// 创建子fiberNode
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

// 无法触发更新，只能创建子fiberNode
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

// 创建子fiberNode
function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	// 因为要对比子节点的current fiberNode，和子节点的 reactElement
	// 先获取父节点的current FiberNode
	const current = wip.alternate;

	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
