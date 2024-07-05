export default function (arr: Array<any>) {
	return arr
		.reduce((prev, curr) => {
			return `${prev}, ` + `${curr.msg}`;
		}, "")
		.slice(2);
}
