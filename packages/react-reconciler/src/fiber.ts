import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, Noflags } from './fiberFlags';

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
	alternate: FiberNode | null;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		// HostComponent <div> div DOM
		this.stateNode = null;
		// FunctionComponent
		this.type = null;

		// 构成树状结构
		this.return = null; // 指向父节点
		this.sibling = null; // 兄弟节点
		this.child = null; // 子节点
		this.index = 0; // 在同级节点中的索引

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps; // 刚开始工作的props
		this.memoizedProps = null; // 结束工作时候的props

		this.alternate = null;
		// 副作用
		this.flags = Noflags;
	}
}
