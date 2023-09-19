// fiberNode节点类型
export type WorkTag =
	| typeof FunctionComponent //
	| typeof HostRoot // 根节点
	| typeof HostComponent // 节点 比如 <div>
	| typeof HostText; // 文字 比如 <div>123</div>里的123

export const FunctionComponent = 0;

export const HostRoot = 3;

export const HostComponent = 5;

export const HostText = 6;
