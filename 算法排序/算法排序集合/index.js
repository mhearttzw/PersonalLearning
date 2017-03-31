// https://github.com/norahiko/sort-visualize

var helper = {
    //创建范围内数组
    range: function(min, max) {
        var res = [];
        for(var i = min; i < max; i++) {
            res.push(i);
        }
        return res;
    },
    //对数组进行乱序处理
    shuffle: function(ary) {
        for(var i = ary.length - 1; i>=0/*0 <= i*/; i--) {
            var rnd = Math.random() * (i + 1) | 0;
            //函数参数都是是按值传递，引用类型可视作传递内存指针，函数内部成为局部变量
            helper.swap(ary, i, rnd);
        }
    },
    //交换函数
    swap: function(ary, a, b) {
        if(a < 0 || b < 0 || ary.length <= a || ary.length <= b) {
            throw new Error('IndexError ' + a + " - " + b);
        }
        var temp = ary[a];
        ary[a] = ary[b];
        ary[b] = temp;
    },

    insert: function(ary, from, to) {
        while(from != to) {
            if(from < to) {
                helper.swap(ary, from, from + 1);
                from += 1;
            } else {
                helper.swap(ary, from, from - 1);
                from -= 1;
            }
        }
    },

    median3: function(a, b, c) {
        if(b <= a)
            if (a <= c)
                return a;
            else if(c <= b)
                return b;
            else
                return c;
        else if(c <= a)
            return a;
        else if(c <= b)
            return c;
        else
            return b;
    },

    getCanvas: function(id) {
        var canvas = document.getElementById(id);
        if(canvas === null || canvas.nodeName.toLowerCase() !== 'canvas') {
            return document.createElement('canvas');
        }
        return canvas;
    }
};


var graph = {};

(function() {
    var canvas;
    var ctx;
    var width;
    var height;

    var bgColor = '#333';
    var barColor = '#6cf';
    var highlightColor = '#cf6';

    graph.init = function(c) {
        canvas = c;
        ctx = canvas.getContext('2d');
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
    };

    graph.draw = function(highlightIndexes, values) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        var idx1 = highlightIndexes[0];
        var idx2 = highlightIndexes[1];
        //数组的总数
        var size = values.length;
        //每个bar之间留1的宽度
        var barWidth = (width - size + 1) / size;
        var barHeightUnit = height / size;

        var x = 0;
        var h = 0;
        ctx.fillStyle = barColor;
        for(var i = 0; i < values.length; i++) {
            h = values[i] * barHeightUnit;
            if(i === idx1 || i === idx2) {
                ctx.fillStyle = highlightColor;
                ctx.fillRect(x, height- h, barWidth, h);
                ctx.fillStyle = barColor;
            } else {
                ctx.fillRect(x, height- h, barWidth, h);
            }
            x = x + barWidth + 1;
        }
    };
})();

//排序步骤记录，indexes对于快排是左右数组当前边界索引值[a,b]
function SortStep(type, indexes) {
    // type = 'swap' | 'highlight' | 'insert'
    this.type = type;
    // アニメーション時にハイライトさせるインデックスの配列
    this.indexes = indexes;
}

//函数的属性
SortStep.SWAP = 'swap';
SortStep.HIGHLIGHT = 'highlight';
SortStep.INSERT = 'insert';

SortStep.prototype.run = function(ary) {
    if(this.type === SortStep.SWAP) {
        helper.swap(ary, this.indexes[0], this.indexes[1]);
    } else if(this.type === SortStep.INSERT) {
        helper.insert(ary, this.indexes[0], this.indexes[1]);
        this.indexes[0] = -1;
    }
};

/**
 * 委托代理模式
 * var sortAlgorithm= {
 *     init：function init () {
 *     
 *     },
 *
 *     sort: function sort() {
 *     
 *     }
 * }
 */
//排序算法构造函数
function SortAlgorithm(values) {
    this.values = values;
    this.size = values.length;
    this.steps = [];    //步骤记录数组
    this.finished = false;
}


SortAlgorithm.prototype.sort = function(algorithm) {
    //此时algorithm是string所以用[]来引用属性名；
    this[algorithm]();
    this.steps.reverse();
    // ボゴソートはソートが完了せずに終了する
    if(algorithm !== 'bogo') {
        this.finished = true;
    }
};

//将交换类型和步骤实例化对象后添加进steps数组中
SortAlgorithm.prototype.addStep = function(type, indexes) {
    this.steps.push(new SortStep(type, indexes));
};

//交换元素同时把交换步骤添加进步骤数组中
SortAlgorithm.prototype.swap = function(a, b) {
    helper.swap(this.values, a, b);
    this.addStep(SortStep.SWAP, [a, b]);
};

//不交换元素但吧交换步骤添加进steps数组中
SortAlgorithm.prototype.highlight = function(a, b) {
    this.addStep(SortStep.HIGHLIGHT, [a, b]);
};

//插入元素并把插入步骤添加进steps数组中
SortAlgorithm.prototype.insert = function(from, to) {
    helper.insert(this.values, from, to);
    this.addStep(SortStep.INSERT, [from, to]);
};

//冒泡排序，从低到高去比较序列里的每个元素
SortAlgorithm.prototype.bubble = function bubbleSort() {
    for(var i = this.size - 1; 0 < i; i--) {
        for(var k = 0; k < i; k++) {
            if(this.values[k] > this.values[k + 1]) {
                this.swap(k, k + 1);
            } else {
                this.highlight(k, k + 1);
            }
        }
    }
};
/**
function bubble1() {
    for(var i=0; i<len, i++) {
        for(var j=i; j<len; j++) {
            if(a[i]>a[j]) {
                var temp= a[i];
                a[i]= a[j];
                a[j]= temp;
            }
        }
    }
}
**/

//选择排序
SortAlgorithm.prototype.selection = function selectionSort() {
    for(var i = 0; i < this.size - 1; i++) {
        var min = i;
        for(var k = i + 1; k < this.size; k++) {
            this.highlight(min, k);
            if(this.values[k] < this.values[min]) {
                min = k;
            }
        }
        this.swap(i, min);
    }
};

//希尔排序；从低到高然后从高到低来回排序
SortAlgorithm.prototype.shaker = function shakerSort() {
    var left = 0;
    var right = this.size - 1;
    var incr = 1;   //方向标识符
    var i = 0;
    var next;   //看作游标
    var lastSwapped = 0;    //截取需要排序的部分

    var count = 0;
    while(left < right) {
        next = i + incr;
        if((incr === 1 && this.values[i] > this.values[next]) || (incr === -1 && this.values[next] > this.values[i])) {
            this.swap(i, next);
            lastSwapped = i;    //单次排序最后的交换节点处
        } else {
            this.highlight(i, next);
        }
        //单向排序结束后反向
        if(next === right) {
            i = right = lastSwapped;    //单次排序最后的交换节点处，不交换的部分元素是有序的
            incr = -incr;   //设置方向
        } else if(next === left) {
            i = left = lastSwapped;
            incr = -incr;
        } else {
            i = next;   //单向排序是i为初始边界
        }
    }
};

//插入排序
SortAlgorithm.prototype.insertion = function insertionSort() {
    for(var i = 1; i < this.size; i++) {
        for(var k = i; 0 < k; k--) {
            if(this.values[k - 1] > this.values[k]) {
                this.swap(k - 1, k);
            } else {
                this.highlight(k - 1, k);
                break;  //这里退出比较，因为前面都是有序的，减少了比较次数，效率提高；
            }
        }
    }
};

//希尔排序(缩小增量排序)
SortAlgorithm.prototype.shell = function shellSort() {
    var gap = 1;
    while(gap < this.size) {
        gap = gap * 3 + 1;
    }

    while(1 < gap) {
        gap = gap / 3 | 0;  //有gap的插入排序
        for(var i = gap; i < this.size; i++) {
            for(var k = i; 0 < k; k -= gap) {
                if(this.values[k - gap] > this.values[k]) {
                    this.swap(k - gap, k);
                } else {
                    this.highlight(k - gap, k);
                    break;
                }
            }
        }
    }
};

SortAlgorithm.prototype.merge = function mergeSort() {
    this.mergeSortImpl(0, this.size - 1);
};

SortAlgorithm.prototype.mergeSortImpl = function(left, right) {
    if(right <= left) {
        return;
    }
    var middle = (left + right) / 2 | 0;
    this.mergeSortImpl(left, middle);
    this.mergeSortImpl(middle + 1, right);

    var l = left;
    var m = middle + 1;
    while(l < m && m <= right) {
        this.highlight(l, m);
        if(this.values[l] >= this.values[m]) {
            this.insert(m, l);  //一直交换到前面的元素，相当于插入m插入到了l前面；
            m++;
        }
        l++;
    }
};


//快速排序；在原数组上更改
SortAlgorithm.prototype.quick = function quickSort() {
    this.quickSortImpl(0, this.size - 1);
};

SortAlgorithm.prototype.quickSortImpl = function(left, right) {
    var values = this.values;
    var middle = (left + right) / 2 | 0;
    var pivot = helper.median3(values[left], values[middle], values[right]);
    var l = left;
    var r = right;
    while(true) {
        //相当于移位push到左数组
        while(values[l] < pivot) {
            this.highlight(l, r);
            l++;
        }
        //相当于移位push到右数组
        while(pivot < values[r]) {
            this.highlight(l, r);
            r--;
        }
        //循环结束判断
        if(r <= l) {
            break;
        }
        //交换左右数组值，同时移位push到左右数组
        this.swap(l, r);
        l++;
        r--;
    }
    //递归排序左部数组，if判断是递归的边界条件
    if(left < l - 1) {
        this.quickSortImpl(left, l - 1);
    }
    //递归排序右部数组，if判断是递归的边界条件
    if(r + 1 < right) {
        this.quickSortImpl(r + 1, right);
    }
};
//快速排序2；返回新数组
/*function quickSort(arr) {
    if(arr.length< 1) {
        return [];
    }
    var pivot= arr[0],
        left= new Array(),
        right= new Array();
    for(var i=1; i<arr.length; i++) {
        if(arr[i]<= pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat(pivot, quickSort(right));
}*/


SortAlgorithm.prototype.heap = function heapSort() {
    //遍历构造最大堆
    for(var i = 0; i < this.size; i++) {
        this.swapUp(i);
    }

    //把最大值交换到最后的位置；然后调整最大堆
    for(i = this.size - 1; 0 < i; i--) {
        if(this.values[0] > this.values[i]) {
            this.swap(0, i);
        } else {
            this.highlight(0, i);
        }
        this.swapDown(0, i);
    }
};

/**
 * [swapUp description]
 * @param  {[type]} cur [description]
 * @return {[type]}     [description]
 * 数组是zero-Based，所以
 * -   Parent(i)= floor(i-1)/2;
 * -   Left(i)= 2*i+1;
 * -   Right(i)= 2(i+1);
 */
SortAlgorithm.prototype.swapUp = function(cur) {
    var parent;
    while(cur !== 0) {
        parent = (cur - 1) / 2 | 0;
        if(this.values[parent] >= this.values[cur]) {
            this.highlight(parent, cur);
            break;
        }
        this.swap(parent, cur);
        cur = parent;
    }
};

//这里的length是指最后边界；应该取个更贴切的名字
//向下重构最大堆；
SortAlgorithm.prototype.swapDown = function(cur, length) { 
    var values = this.values;
    var child;
    while(true) {
        child = cur * 2 + 1;
        //找出两个子节点中的较大值；
        if(values[child] < values[child + 1]) {
            child += 1;
        }
        //如果比较大值大，则满足最大堆并退出循环；
        if(values[cur] >= values[child]) {
            this.highlight(cur, child);
            break;
        }
        //边界判断语句；
        if(length <= child) {
            break;
        }
        //不满足最大堆性质，所以交换节点来重构；
        this.swap(cur, child);
        cur = child;
    }
};

SortAlgorithm.prototype.bogo = function bogoSort() {
    for(var i = 0; i < this.size; i++) {
        var rnd = (Math.random() * (this.size - i) | 0) + i;
        this.swap(i, rnd);
    }

    // valuesが整列済みになっているか調べる
    for(i = 0; i < this.size - 1; i++) {
        this.highlight(i, i + 1);
        if(this.values[i] > this.values[i + 1]) {
            return;
        }
    }
    this.finished = true;
};


function ViewModel() {
    this.algorithm = ko.observable('Bubble');
    this.size = ko.observable(50);
    this.speed = ko.observable(9);

    this.sort = null;
    this.nums = [];
    this.algorithmList = ['Bubble', 'Selection', 'Shaker', 'Insertion', 'Shell', 'Merge', 'Heap', 'Quick', 'Bogo'];
    this.sizeList = [5, 10, 50, 100, 150]; //条形图宽度
    this.speedMin = 1;      // 2 seconds
    this.speedMax = 22;     // 4 milliseconds
    this.intervalId = -1;

    graph.init(helper.getCanvas('graph-canvas'));

    this.changed = ko.computed({
        read: function() {
            //传入排序算法名，数组长度
            this.start(this.algorithm(), this.size());
        },
        owner: this,
        deferEvaluation: true,
    });
}

ViewModel.prototype.start = function(algorithm, size) {
    //this的使用，别名
    var vm = this;
    //创建既定大小数组
    this.nums = helper.range(1, size + 1);
    //对数组进行乱序操作
    helper.shuffle(this.nums);
    //为什么不直接传入this.num；而是传入nums.slice()：因为this.nums根本不要求改变？！
    //实例化算法对象
    this.sort = new SortAlgorithm(this.nums.slice()); 

    //先初始化清除定时对象
    clearInterval(this.intervalId);
    this.intervalId = setTimeout(animationFrame, 0);

    function animationFrame() {
        //如果函数还未开始排序，或者渲染操作完成，steps数组元素全部弹出，此时排序步骤为零；
        if(vm.sort.steps.length === 0) {
            //数组排序完成且渲染操作完成
            if(vm.sort.finished) {
                graph.draw([-1, -1], vm.nums);
                return;
            } else {
                //按既定算法开始排序，其中vm.sort.finished赋值为flase；
                //排序完之后finished数值变为true
                //执行后排序步骤存在steps数组中
                vm.sort.sort(algorithm.toLowerCase());
                //输出排序步骤数
                console.log(vm.sort.steps.length);
            }
        }
        //弹出排序步骤
        var step = vm.sort.steps.pop();
        //对混乱的数组执行排序步骤
        step.run(vm.nums);
        graph.draw(step.indexes, vm.nums);
        vm.intervalId = setTimeout(animationFrame, vm.getIntervalTime());
    }
};

ViewModel.prototype.restart = function() {
    this.start(this.algorithm.peek(), this.size.peek());
};

ViewModel.prototype.getIntervalTime = function() {
    var speed = parseInt(this.speed.peek(), 10);
    return 2000 / speed / speed | 0;
};


if(document.documentElement.hasAttribute('sort-visualize-app')) {
    document.addEventListener('DOMContentLoaded', main);
}

function main() {
    var vm = window.vm = new ViewModel();
    ko.applyBindings(vm);
    vm.changed();
}

/**
 function addEventListener(element, eventName, handler) {
    if(element.addEventListener) {
        element.addEventListener(eventName, handler);
    } else if(element.attachEvent) {
        element.attachEvent("on"+eventName, handler);
    } else {
        element["on"+eventName]= handler;
    }
 }
**/ 