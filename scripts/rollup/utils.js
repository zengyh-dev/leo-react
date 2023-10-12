import path from 'path';
// 处理文件读写
import fs from 'fs';

import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

// __dirname是node环境下的全局变量，这里报错显示不存在
// 需要到.eslintrc.json中给env添加"node":true选项

// 包路径
const pkgPath = path.resolve(__dirname, '../../packages');

// 按照node规范，打出来的包react/react-dom,应该存在node_modules下
// 打包产物路径
const distPath = path.resolve(__dirname, '../../dist/node_modules');

// 根据包名获取包 打包后路径
export const resolvePkgDistPath = (pkgName) => `${distPath}/${pkgName}`;

// 根据包名获取包 源文件路径
export const resolvePkgSourcePath = (pkgName) => `${pkgPath}/${pkgName}`;

// 根据包名获取packageJSON文件
export const getPackageJSON = (pkgName) => {
	// package.json路径
	const path = `${resolvePkgSourcePath(pkgName)}/package.json`;
	// JSON文件读成字符串
	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	// JSON字符串转成对象
	return JSON.parse(str);
};

// 获取公用plugins
// 功能：解析commonjs 和 ts转js
export function getBaseRollupPlugins({
	alias = {
		__DEV__: true
	},
	typescript = {}
} = {}) {
	// typesciprt的plugin需要配置项
	return [replace(alias), cjs(), ts(typescript)];
}
