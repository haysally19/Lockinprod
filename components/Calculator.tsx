import React, { useState } from 'react';
import { Delete, Equal, X, Minus, Plus, Divide, RotateCcw, Pi } from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [resetNext, setResetNext] = useState(false);

  const handleNum = (num: string) => {
    if (display === '0' || resetNext) {
      setDisplay(num);
      setResetNext(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setResetNext(true);
  };

  const calculate = () => {
    try {
      // Basic safe eval replacement
      const safeEval = new Function('return ' + (expression + display).replace(/×/g, '*').replace(/÷/g, '/'));
      const result = safeEval();
      if (!isFinite(result) || isNaN(result)) {
        setDisplay('Error');
      } else {
        setDisplay(String(Number(result.toFixed(8)))); // Avoid long decimals
      }
      setExpression('');
      setResetNext(true);
    } catch (e) {
      setDisplay('Error');
      setResetNext(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setResetNext(false);
  };

  const scientific = (func: string) => {
    try {
      const val = parseFloat(display);
      let res = 0;
      switch (func) {
        case 'sin': res = Math.sin(val); break;
        case 'cos': res = Math.cos(val); break;
        case 'tan': res = Math.tan(val); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'sq': res = Math.pow(val, 2); break;
      }
      if (!isFinite(res) || isNaN(res)) {
         setDisplay('Error');
      } else {
         setDisplay(String(Number(res.toFixed(8))));
      }
      setResetNext(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleConstant = (c: string) => {
    let val = 0;
    if (c === 'pi') val = Math.PI;
    if (c === 'e') val = Math.E;
    setDisplay(String(Number(val.toFixed(8))));
    setResetNext(true);
  };

  const btnClass = "p-3 rounded-lg font-bold text-sm transition-colors active:scale-95 flex items-center justify-center shadow-sm";
  const numBtnClass = `${btnClass} bg-slate-700 text-white hover:bg-slate-600 border-b-2 border-slate-800`;
  const opBtnClass = `${btnClass} bg-blue-600 text-white hover:bg-blue-500 border-b-2 border-blue-800`;
  const sciBtnClass = `${btnClass} bg-slate-800 text-slate-300 hover:bg-slate-700 border-b-2 border-slate-900 text-xs`;
  const clearBtnClass = `${btnClass} bg-red-500/20 text-red-400 hover:bg-red-500/30 border-b-2 border-red-900/50`;

  return (
    <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-xs mx-auto animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-800 p-4 rounded-xl mb-4 text-right shadow-inner border border-slate-700/50">
        <div className="text-slate-400 text-xs h-4 font-mono">{expression.replace(/\*/g, '×').replace(/\//g, '÷')}</div>
        <div className="text-white text-3xl font-mono overflow-hidden text-ellipsis tracking-wider">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button onClick={() => scientific('sin')} className={sciBtnClass}>sin</button>
        <button onClick={() => scientific('cos')} className={sciBtnClass}>cos</button>
        <button onClick={() => scientific('tan')} className={sciBtnClass}>tan</button>
        <button onClick={clear} className={clearBtnClass}>AC</button>

        {/* Row 2 */}
        <button onClick={() => scientific('ln')} className={sciBtnClass}>ln</button>
        <button onClick={() => scientific('log')} className={sciBtnClass}>log</button>
        <button onClick={() => scientific('sqrt')} className={sciBtnClass}>√</button>
        <button onClick={() => handleOp('÷')} className={opBtnClass}><Divide className="w-5 h-5"/></button>

        {/* Row 3 */}
        <button onClick={() => scientific('sq')} className={sciBtnClass}>x²</button>
        <button onClick={() => handleConstant('pi')} className={sciBtnClass}><Pi className="w-4 h-4"/></button>
        <button onClick={() => handleConstant('e')} className={sciBtnClass}>e</button>
        <button onClick={() => handleOp('×')} className={opBtnClass}><X className="w-5 h-5"/></button>

        {/* Row 4 */}
        <button onClick={() => handleNum('7')} className={numBtnClass}>7</button>
        <button onClick={() => handleNum('8')} className={numBtnClass}>8</button>
        <button onClick={() => handleNum('9')} className={numBtnClass}>9</button>
        <button onClick={() => handleOp('-')} className={opBtnClass}><Minus className="w-5 h-5"/></button>

        {/* Row 5 */}
        <button onClick={() => handleNum('4')} className={numBtnClass}>4</button>
        <button onClick={() => handleNum('5')} className={numBtnClass}>5</button>
        <button onClick={() => handleNum('6')} className={numBtnClass}>6</button>
        <button onClick={() => handleOp('+')} className={opBtnClass}><Plus className="w-5 h-5"/></button>

        {/* Row 6 & 7 */}
        <button onClick={() => handleNum('1')} className={numBtnClass}>1</button>
        <button onClick={() => handleNum('2')} className={numBtnClass}>2</button>
        <button onClick={() => handleNum('3')} className={numBtnClass}>3</button>
        <button onClick={calculate} className={`${opBtnClass} row-span-2 bg-emerald-600 hover:bg-emerald-500 border-b-emerald-800`}><Equal className="w-6 h-6"/></button>

        <button onClick={() => handleNum('0')} className={`${numBtnClass} col-span-2`}>0</button>
        <button onClick={() => handleNum('.')} className={numBtnClass}>.</button>
      </div>
    </div>
  );
};

export default Calculator;