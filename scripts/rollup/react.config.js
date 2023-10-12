import {
	getPackageJSON,
	resolvePkgDistPath,
	resolvePkgSourcePath,
	getBaseRollupPlugins
} from './utils';
// 打包结果需要packageJson
import generatePackageJson from 'rollup-plugin-generate-package-json';

const { name, module } = getPackageJSON('react');
// react包的路径
const pkgPath = resolvePkgSourcePath(name);
// react产物路径
const pkgDistPath = resolvePkgDistPath(name);

// 数组中的每一项都是一个配置
export default [
	// react包
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'react',
			format: 'umd' // 兼容es module和cjs
		},
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				// 不希望直接复制一份源码的packages.json
				// 因为那里面依赖了shared（不希望打包后文件带有shared）
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: 'index.js' // umd格式支持cjs，可以用main字段
				})
			})
		]
	},
	// jsx runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		// 输出两个，就用数组
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime',
				formate: 'umd'
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime',
				formate: 'umd'
			}
		],
		plugins: getBaseRollupPlugins()
	}
];
