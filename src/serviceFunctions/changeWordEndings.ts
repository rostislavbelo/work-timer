// export const changeWordEndings = (num: number, type: { [N: string]: string }) => {
//     let n = num ? num.toString() : '1';
//     let last = n.slice(-1);
//     let twoLast = n.slice(-2);

//     if (twoLast === '11' || twoLast === '12' || twoLast === '13' || twoLast === '14') {
//         return `${n} ${type.firstState}`;
//     }

//     if (last === '1') {
//         return `${n} ${type.secondState}`;
//     }

//     if (last === '2' || last === '3' || last === '4') {
//         return `${n} ${type.thirdState}`;
//     }

//     return `${n} ${type.fourthState}`;
// };


export const changeWordEndings = (num: number, type: { [N: string]: string }) => {
    let n = num ? num.toString() : '1';
    let last = n.slice(-1);
    let twoLast = n.slice(-2);

    switch (twoLast) {
        case '11' || '12' || '13' || '14':
            return `${n} ${type.firstState}`;
    }

    switch (last) {
        case '1':
            return `${n} ${type.secondState}`;
            
        case '2' || '3' || '4':
            return `${n} ${type.thirdState}`;
    }

    return `${n} ${type.fourthState}`;
};