import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';

// 正在工作的tree
let workInProgress: FiberNode | null = null;

// 初始化操作
function prepareFreshStack(root: FiberRootNode) {
	// root.current指向了hostRootFiber
	// 创建root.current对应的workInProgress hostRootFiber
	workInProgress = createWorkInProgress(root.current, {});
}

// fiber中安排update
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	// 拿到fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	// 从根节点开始更新
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	// 跳出循环， 遍历到hostRoot
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

// 谁调用renderRoot？
function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			// 深度遍历
			workLoop();
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop发生错误', e);
			}
			workInProgress = null;
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

// 单次工作
function performUnitOfWork(fiber: FiberNode) {
	// next可能是子fiber，或者null
	const next = beginWork(fiber);
	// 工作完成，props确定下来了
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// 深度遍历到最深的节点（当前节点没有子节点了）
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

// 结束单次工作
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		// 深度遍历，没有子节点了，那么就遍历兄弟节点
		const sibling = node.sibling;

		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		// 没有兄弟节点，递归往上到父节点
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
