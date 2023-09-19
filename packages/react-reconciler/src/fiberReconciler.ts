import { Container } from 'hostConfig';
import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, FiberRootNode } from './fiber';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';
import { HostRoot } from './workTags';

// ReactDOM.createRoot(rootElement).render(<App/>)

// 执行createRoot(rootElement)时候调用
// 创建应用根节点 FiberRootNode
export function createContainer(container: Container) {
	// rootElement这个节点对应的fiberNode就是hostRootFiber
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	// 统一的根节点，需要和hostRootFiber联系起来
	const root = new FiberRootNode(container, hostRootFiber);
	// 创建更新队列
	hostRootFiber.updateQueue = createUpdateQueue();
	return root;
}

// 执行render(<App />)时候调用
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	// 当前fiber
	const hostRootFiber = root.current;
	// 创建新的update，加入到update队列，将首屏渲染和触发更新的机制连接起来
	// 这里实际返回的update就是一个包含<App />元素的对象
	const update = createUpdate<ReactElementType | null>(element); // element: <App />
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	// 在fiber中安排update
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
