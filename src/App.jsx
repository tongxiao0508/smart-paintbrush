import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, ChevronRight, Check, Star, Sparkles, Palette,
  Paintbrush, Target, Camera, BookImage, Frame, Lightbulb, UserRound, Crown,
  Undo, Eraser, Download, Wand2, PartyPopper, Award, Home, Image as ImageIcon,
  Scan, Video, Share2, Lock
} from 'lucide-react';

const App = () => {
  // 步骤说明: 
  // 0: 欢迎, 1: 年龄, 2: 偏好, 3: 完成过渡, 4: 绘画大厅(第2层)
  // 5: 工作台(第3层), 6: 评价反馈(第4层)
  // 7: AR扫描, 8: 我的作品集, 9: 主题挑战, 10: 美术素材库
  const [step, setStep] = useState(0); 
  const [ageGroup, setAgeGroup] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // --- 画板与 AI 功能状态 ---
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [canvasStyle, setCanvasStyle] = useState('none'); 
  const [aiTip, setAiTip] = useState(null); 
  const [showMagicStep, setShowMagicStep] = useState(false);

  // 语音播报函数
  const speak = (text) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9; 
    utterance.pitch = 1.2; 
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // 监听步骤变化，自动播放提示音
  useEffect(() => {
    if (step === 1) speak("哈喽小画家！我是画笔精灵。请问你几岁啦？");
    else if (step === 2) speak("太棒啦！告诉我你最喜欢画什么呢？");
    else if (step === 3) {
      speak("准备完成！神奇的绘画大厅马上开启啦！");
      const timer = setTimeout(() => setStep(4), 2500);
      return () => clearTimeout(timer);
    } 
    else if (step === 4) speak("欢迎来到绘画大厅！今天想画点什么呢？");
    else if (step === 5) {
      speak("欢迎来到魔法工作台！遇到困难随时呼叫 AI 助手哦！");
      initCanvas(); 
    }
    else if (step === 6) speak("哇噢！画得真是太漂亮了！恭喜你获得‘色彩大师’勋章！");
    else if (step === 7) speak("AR扫描已开启！对准你的画作，让它变成 3D 立体模型吧！");
    else if (step === 8) speak("这里是你的专属画廊，每一幅作品都棒极啦！");
    else if (step === 9) speak("接受主题挑战，赢取更多闪亮亮的徽章吧！");
    else if (step === 10) speak("欢迎来到素材库，这里有超多灵感等你发现！");
  }, [step, isMuted]);

  // --- 画板交互核心逻辑 ---
  const initCanvas = () => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
      }
    }, 100);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if(canvas) canvas.getContext('2d').closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // --- AI 模块模拟函数 ---
  const triggerMagicStep = () => {
    speak("AI已解析当前画面。你看，在这里画两个圆圈做耳朵，它就变成小熊啦！");
    setShowMagicStep(true);
    setAiTip("半成品识别成功：建议添加【耳朵】特征。");
    setTimeout(() => {
      setShowMagicStep(false);
      setAiTip(null);
    }, 4000);
  };

  const triggerShapeCompletion = () => {
    speak("哎呀，是不是有点画偏啦？试试沿着虚线调整一下造型！");
    setAiTip("造型补全：已生成参考轮廓，请沿着引导线描绘！");
    setTimeout(() => setAiTip(null), 3000);
  };

  // --- 前置步骤交互函数 ---
  const handleStart = () => setStep(1);
  const handleAgeSelect = (age) => { setAgeGroup(age); setTimeout(() => setStep(2), 500); };
  const togglePreference = (pref) => {
    if (preferences.includes(pref)) setPreferences(preferences.filter(p => p !== pref));
    else setPreferences([...preferences, pref]);
  };

  const THEMES = [
    { id: 'animals', icon: '🦁', name: '可爱动物', color: 'bg-orange-100 border-orange-300' },
    { id: 'daily', icon: '🍎', name: '日常用品', color: 'bg-red-100 border-red-300' },
    { id: 'fairytale', icon: '🧚', name: '奇幻童话', color: 'bg-pink-100 border-pink-300' },
    { id: 'vehicles', icon: '🚗', name: '酷炫交通', color: 'bg-blue-100 border-blue-300' },
    { id: 'space', icon: '🚀', name: '神秘太空', color: 'bg-indigo-100 border-indigo-300' },
    { id: 'nature', icon: '🌳', name: '美丽自然', color: 'bg-green-100 border-green-300' },
  ];

  // 公共 Header
  const MascotHeader = ({ text }) => (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm mb-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <div className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-yellow-300 shadow-lg border-4 border-white ${isSpeaking ? 'animate-bounce' : ''}`}>
          <Palette className="w-8 h-8 text-yellow-700" />
        </div>
        <div className="relative bg-blue-100 py-3 px-6 rounded-2xl rounded-tl-none text-blue-800 font-bold text-lg shadow-sm">
          {text}
        </div>
      </div>
      <button 
        onClick={() => { setIsMuted(!isMuted); if (!isMuted) window.speechSynthesis.cancel(); }}
        className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
      
      {/* 步骤 0: 欢迎页 */}
      {step === 0 && (
        <div className="flex flex-col items-center text-center transition-opacity duration-500">
          <div className="relative mb-8">
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl border-8 border-yellow-300 relative z-10 animate-bounce">
              <Palette className="w-20 h-20 text-blue-500" />
            </div>
            <Sparkles className="absolute -top-4 -right-4 w-12 h-12 text-yellow-400" />
            <Star className="absolute -bottom-2 -left-4 w-10 h-10 text-pink-400" />
          </div>
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4 tracking-wider" style={{ textShadow: '2px 2px 0px #fff' }}>智能小画笔</h1>
          <p className="text-xl text-blue-800 font-medium mb-12">开启你的奇妙艺术之旅！</p>
          <button onClick={handleStart} className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-2xl rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
            开始设置 <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* 步骤 1: 年龄选择 */}
      {step === 1 && (
        <div className="w-full flex flex-col items-center">
          <MascotHeader text="哈喽小画家！请问你今年几岁啦？" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
            {[
              { id: '3-5', title: '3-5 岁', sub: '启蒙涂鸦班', icon: '👶', bg: 'bg-green-100 hover:bg-green-200 border-green-300' },
              { id: '6-8', title: '6-8 岁', sub: '趣味简笔班', icon: '🧒', bg: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
              { id: '9-12', title: '9-12 岁', sub: '创意创作班', icon: '👦', bg: 'bg-purple-100 hover:bg-purple-200 border-purple-300' }
            ].map((age) => (
              <button key={age.id} onClick={() => handleAgeSelect(age.id)} className={`${age.bg} border-4 rounded-3xl p-8 flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}>
                <div className="text-7xl">{age.icon}</div>
                <h2 className="text-3xl font-extrabold text-gray-800">{age.title}</h2>
                <p className="text-lg font-bold text-gray-600 bg-white/50 px-4 py-1 rounded-full">{age.sub}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 步骤 2: 偏好选择 */}
      {step === 2 && (
        <div className="w-full flex flex-col items-center">
          <MascotHeader text="太棒啦！你最喜欢画什么呢？可以多选哦！" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl mt-4">
            {THEMES.map((theme) => {
              const isSelected = preferences.includes(theme.id);
              return (
                <button key={theme.id} onClick={() => togglePreference(theme.id)} className={`${theme.color} border-4 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${isSelected ? 'scale-105 shadow-xl border-opacity-100 ring-4 ring-yellow-400 ring-opacity-50' : 'hover:scale-105 border-opacity-50'}`}>
                  {isSelected && <div className="absolute top-2 right-2 bg-yellow-400 text-white rounded-full p-1 shadow-sm"><Check className="w-5 h-5" /></div>}
                  <div className="text-5xl">{theme.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800">{theme.name}</h3>
                </button>
              );
            })}
          </div>
          <div className="mt-12 flex gap-6">
            <button onClick={() => setStep(1)} className="px-6 py-3 rounded-full text-blue-600 font-bold bg-white/50 hover:bg-white/80 transition-colors">返回修改</button>
            <button onClick={() => setStep(3)} disabled={preferences.length === 0} className={`px-10 py-4 rounded-full font-extrabold text-xl flex items-center gap-2 ${preferences.length > 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-105 shadow-xl transition-transform' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>去画画！<Sparkles className="w-6 h-6" /></button>
          </div>
        </div>
      )}

      {/* 步骤 3: 初始化完成 */}
      {step === 3 && (
        <div className="flex flex-col items-center text-center">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl border-8 border-green-400 mb-8 animate-bounce"><Check className="w-24 h-24 text-green-500" /></div>
          <h1 className="text-4xl font-extrabold text-green-600 mb-4 tracking-wider">设置完成！</h1>
          <p className="text-2xl text-gray-700 font-bold mb-8">正在为你定制专属绘画大厅...</p>
        </div>
      )}

      {/* 步骤 4: 绘画大厅 */}
      {step === 4 && (
        <div className="w-full max-w-6xl flex flex-col h-full transition-opacity duration-500">
          <header className="flex justify-between items-center bg-white/70 backdrop-blur-md rounded-3xl p-4 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-200 rounded-full border-4 border-white flex items-center justify-center"><UserRound className="w-8 h-8 text-yellow-600" /></div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">绘画大厅 <Sparkles className="w-5 h-5 text-yellow-500" /></h1>
                <p className="text-sm font-bold text-gray-500 bg-white/60 px-3 py-1 rounded-full mt-1">欢迎回来，小画家！</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-200 px-4 py-2 rounded-full border-2 border-yellow-300"><Crown className="w-5 h-5 text-yellow-600" /><span className="font-bold text-yellow-800">Lv.3 创意新星</span></div>
              <button 
                onClick={() => { setIsMuted(!isMuted); if (!isMuted) window.speechSynthesis.cancel(); }}
                className="p-3 rounded-full bg-white text-gray-500 hover:bg-gray-100 shadow-sm transition-colors"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-xl border-t-4 border-t-pink-400 flex flex-col relative group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 right-0 bg-pink-400 text-white px-4 py-1 rounded-bl-2xl font-bold text-sm">AI 智能推荐</div>
              <div className="flex items-center gap-3 mb-4"><Lightbulb className="w-8 h-8 text-pink-500" /><h2 className="text-2xl font-extrabold text-gray-800">每日推荐</h2></div>
              <div className="flex-1 bg-pink-50 rounded-2xl border-2 border-pink-100 flex flex-col items-center justify-center p-4">
                <div className="text-8xl mb-4 group-hover:scale-110 transition-transform">🦁</div>
                <h3 className="text-xl font-bold text-pink-800 mb-2">画一只大狮子</h3>
                <p className="text-center text-sm text-pink-600 font-medium">难度：⭐⭐ </p>
                <button onClick={() => setStep(5)} className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-pink-600 transition-colors">去学画</button>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button onClick={() => setStep(5)} className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl p-6 shadow-xl border-b-8 border-orange-500 text-white flex flex-col items-center justify-center gap-4 hover:-translate-y-2 transition-all group">
                <div className="bg-white/30 p-6 rounded-full group-hover:scale-110 transition-transform"><Paintbrush className="w-16 h-16 text-white" /></div>
                <h2 className="text-3xl font-extrabold tracking-wide drop-shadow-md">自由涂鸦</h2>
                <p className="font-medium text-orange-100 bg-black/10 px-4 py-1 rounded-full">发挥想象，尽情创作</p>
              </button>
              <button onClick={() => setStep(9)} className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl p-6 shadow-xl border-b-8 border-purple-600 text-white flex flex-col items-center justify-center gap-4 hover:-translate-y-2 transition-all group">
                <div className="bg-white/30 p-6 rounded-full group-hover:scale-110 transition-transform"><Target className="w-16 h-16 text-white" /></div>
                <h2 className="text-3xl font-extrabold tracking-wide drop-shadow-md">主题挑战</h2>
                <p className="font-medium text-purple-100 bg-black/10 px-4 py-1 rounded-full">完成任务，获取徽章</p>
              </button>
            </div>
            
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
              <button onClick={() => setStep(7)} className="bg-emerald-100 border-2 border-emerald-300 rounded-3xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group"><div className="bg-emerald-400 p-4 rounded-2xl text-white group-hover:rotate-12 transition-transform"><Camera className="w-8 h-8" /></div><div className="text-left"><h3 className="text-xl font-extrabold text-emerald-800">AR 扫描</h3><p className="text-emerald-600 font-bold text-sm">沉浸式互动拓展</p></div></button>
              <button onClick={() => setStep(8)} className="bg-blue-100 border-2 border-blue-300 rounded-3xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group"><div className="bg-blue-500 p-4 rounded-2xl text-white group-hover:-rotate-12 transition-transform"><Frame className="w-8 h-8" /></div><div className="text-left"><h3 className="text-xl font-extrabold text-blue-800">我的作品集</h3><p className="text-blue-600 font-bold text-sm">画作与评价记录</p></div></button>
              <button onClick={() => setStep(10)} className="bg-violet-100 border-2 border-violet-300 rounded-3xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group"><div className="bg-violet-500 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform"><BookImage className="w-8 h-8" /></div><div className="text-left"><h3 className="text-xl font-extrabold text-violet-800">美术素材库</h3><p className="text-violet-600 font-bold text-sm">分类高清素材索引</p></div></button>
            </div>
          </div>
        </div>
      )}

      {/* 步骤 5: 核心创作工作台 */}
      {step === 5 && (
        <div className="w-full max-w-7xl h-[90vh] flex flex-col bg-gray-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-200">
          <div className="h-20 bg-white border-b-2 border-gray-200 flex items-center justify-between px-6 shrink-0">
            <button onClick={() => setStep(4)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold bg-gray-100 px-4 py-2 rounded-full">
              <ChevronRight className="w-6 h-6 rotate-180" /> 退出大厅
            </button>
            <h2 className="text-2xl font-extrabold text-blue-600 flex items-center gap-2">
              <Palette className="text-yellow-500" /> 核心创作工作台
            </h2>
            <button onClick={() => setStep(6)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-extrabold px-6 py-3 rounded-full shadow-md transition-transform hover:scale-105">
              <Check className="w-6 h-6" /> 提交作品
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-24 bg-white border-r-2 border-gray-200 p-4 flex flex-col items-center gap-6 overflow-y-auto">
              <div className="text-sm font-bold text-gray-400 mb-2">画笔工具</div>
              <button onClick={() => { setIsEraser(false); setBrushColor('#000000'); }} className={`p-4 rounded-2xl transition-all ${!isEraser && brushColor==='#000000' ? 'bg-blue-100 ring-4 ring-blue-400' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <Paintbrush className="w-8 h-8 text-black" />
              </button>
              <button onClick={() => { setIsEraser(false); setBrushColor('#ef4444'); }} className={`p-4 rounded-2xl transition-all ${!isEraser && brushColor==='#ef4444' ? 'bg-red-100 ring-4 ring-red-400' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
              </button>
              <button onClick={() => { setIsEraser(false); setBrushColor('#3b82f6'); }} className={`p-4 rounded-2xl transition-all ${!isEraser && brushColor==='#3b82f6' ? 'bg-blue-100 ring-4 ring-blue-400' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
              </button>
              <button onClick={() => setIsEraser(true)} className={`p-4 rounded-2xl transition-all ${isEraser ? 'bg-purple-100 ring-4 ring-purple-400' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <Eraser className="w-8 h-8 text-purple-600" />
              </button>
              <button onClick={clearCanvas} className="p-4 rounded-2xl bg-gray-100 hover:bg-red-100 transition-all mt-auto group">
                <Undo className="w-8 h-8 text-gray-500 group-hover:text-red-500" />
                <span className="text-xs font-bold text-gray-500 mt-1 block">清空</span>
              </button>
            </div>

            <div className="flex-1 bg-gray-200 p-6 relative flex items-center justify-center overflow-hidden">
              {aiTip && (
                <div className="absolute top-8 z-50 bg-yellow-100 border-4 border-yellow-400 text-yellow-800 px-6 py-3 rounded-full font-bold shadow-xl animate-bounce flex items-center gap-3">
                   <Sparkles className="text-yellow-500" /> {aiTip}
                </div>
              )}

              <div className="w-full h-full relative rounded-3xl shadow-lg bg-white overflow-hidden border-4 border-transparent focus-within:border-blue-400 transition-all">
                {showMagicStep && (
                  <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-8 border-dashed border-blue-400 rounded-full animate-pulse opacity-50 relative top-[-40px]">
                      <div className="absolute -top-12 -left-4 text-2xl bg-blue-100 px-3 py-1 rounded-full text-blue-600 font-bold shadow-md">画耳朵!</div>
                    </div>
                  </div>
                )}

                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair z-10 relative"
                  style={{
                    filter: canvasStyle === 'watercolor' ? 'contrast(1.1) saturate(1.3) sepia(0.1)' : 
                            canvasStyle === 'crayon' ? 'contrast(1.3) saturate(1.5)' : 'none'
                  }}
                />
              </div>
            </div>

            <div className="w-72 bg-white border-l-2 border-gray-200 p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <h3 className="text-blue-800 font-extrabold text-lg flex items-center gap-2 mb-3">
                   <Wand2 className="w-5 h-5" /> 魔法步骤
                </h3>
                <p className="text-sm text-blue-600 mb-3 font-medium">不知道下一步画什么？AI 来帮你解析并拆解笔画！</p>
                <button onClick={triggerMagicStep} className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold py-3 rounded-xl shadow-md hover:scale-105 transition-transform">
                  识别半成品
                </button>
              </div>

              <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4">
                <h3 className="text-pink-800 font-extrabold text-lg flex items-center gap-2 mb-3">
                   <Target className="w-5 h-5" /> AI辅助
                </h3>
                <p className="text-sm text-pink-600 mb-3 font-medium">1. 检测构图，卡通提示轮廓</p>
                <button onClick={triggerShapeCompletion} className="w-full bg-pink-400 text-white font-bold py-2 rounded-xl shadow-md hover:bg-pink-500 transition-colors mb-4">
                  一键造型补全
                </button>
                <p className="text-sm text-pink-600 mb-2 font-medium">2. 风格变身：一键艺术化</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setCanvasStyle('none')} className={`py-2 rounded-lg font-bold text-sm ${canvasStyle==='none' ? 'bg-pink-500 text-white' : 'bg-white text-pink-600 border border-pink-200'}`}>原画</button>
                  <button onClick={() => { setCanvasStyle('watercolor'); setAiTip("已转换为水彩风格！"); setTimeout(()=>setAiTip(null), 2000);}} className={`py-2 rounded-lg font-bold text-sm ${canvasStyle==='watercolor' ? 'bg-pink-500 text-white' : 'bg-white text-pink-600 border border-pink-200'}`}>水彩</button>
                  <button onClick={() => { setCanvasStyle('crayon'); setAiTip("已转换为蜡笔风格！"); setTimeout(()=>setAiTip(null), 2000);}} className={`py-2 rounded-lg font-bold text-sm col-span-2 ${canvasStyle==='crayon' ? 'bg-pink-500 text-white' : 'bg-white text-pink-600 border border-pink-200'}`}>蜡笔肌理</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 步骤 6: 趣味评价与反馈 */}
      {step === 6 && (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl p-12 border-8 border-yellow-300 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-200 via-pink-100 to-transparent"></div>
          <PartyPopper className="w-24 h-24 text-red-500 animate-bounce mb-4 relative z-10" />
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 mb-6 relative z-10">作品提交成功啦！</h1>

          <div className="flex flex-col md:flex-row items-center gap-12 my-8 relative z-10">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-48 h-48 rounded-full border-8 border-white shadow-xl flex flex-col items-center justify-center transform -rotate-6">
              <span className="text-gray-500 font-bold text-lg mb-[-10px]">AI 评分</span>
              <div className="flex items-baseline"><span className="text-7xl font-extrabold text-orange-500">98</span><span className="text-2xl font-bold text-orange-400">分</span></div>
              <div className="flex text-yellow-400 mt-1"><Star fill="currentColor" /> <Star fill="currentColor" /> <Star fill="currentColor" /></div>
            </div>

            <div className="flex flex-col items-center md:items-start max-w-md">
              <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-3xl rounded-tl-none relative mb-6">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"><Palette className="w-6 h-6 text-blue-500" /></div>
                <h3 className="text-xl font-extrabold text-blue-800 mb-2">精灵评语：</h3>
                <p className="text-lg text-blue-600 font-medium leading-relaxed">“哇噢！你的颜色搭配就像彩虹一样美丽！线条也非常流畅，你简直是个小小艺术家！”</p>
              </div>
              <div className="flex items-center gap-4 bg-gradient-to-r from-purple-100 to-pink-100 pr-6 pl-2 py-2 rounded-full border-2 border-pink-200 shadow-sm">
                <div className="bg-pink-500 p-3 rounded-full text-white shadow-inner"><Award className="w-8 h-8" /></div>
                <div><div className="text-sm font-bold text-purple-500">获得新勋章</div><div className="text-2xl font-extrabold text-pink-600 tracking-wider">「色彩大师」</div></div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 mt-4 relative z-10">
            <button onClick={() => setStep(4)} className="flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xl rounded-full transition-colors border-2 border-gray-300">
              <Home className="w-6 h-6" /> 返回大厅
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-extrabold text-xl rounded-full shadow-lg transition-transform hover:scale-105">
              <Download className="w-6 h-6" /> 保存作品集
            </button>
          </div>
        </div>
      )}

      {/* 步骤 7: AR 扫描体验室 */}
      {step === 7 && (
        <div className="w-full max-w-5xl h-[85vh] bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800 relative flex flex-col items-center justify-center transition-opacity duration-500">
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <button onClick={() => setStep(4)} className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full backdrop-blur-md transition-colors">
            <ChevronRight className="w-6 h-6 rotate-180" /> 返回大厅
          </button>
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-72 h-72 border-4 border-emerald-400 rounded-3xl relative flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(52,211,153,0.5)] bg-black/30 backdrop-blur-sm">
                <Scan className="absolute top-4 left-4 w-8 h-8 text-emerald-400" />
                <Scan className="absolute top-4 right-4 w-8 h-8 text-emerald-400 rotate-90" />
                <Scan className="absolute bottom-4 right-4 w-8 h-8 text-emerald-400 rotate-180" />
                <Scan className="absolute bottom-4 left-4 w-8 h-8 text-emerald-400 -rotate-90" />
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-[ping_2s_linear_infinite]"></div>
                <div className="w-32 h-32 text-8xl animate-bounce drop-shadow-[0_20px_20px_rgba(255,255,255,0.2)] transform hover:rotate-12 transition-transform cursor-pointer">🦁</div>
             </div>
             <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-3xl text-center max-w-lg border border-gray-700">
               <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center justify-center gap-2"><Sparkles className="text-yellow-400" /> 魔法生效啦！</h2>
               <p className="text-gray-300 font-medium mb-6">你的画作“小狮子”已经变成 3D 立体模型啦！赶快和它互动吧！</p>
               <div className="flex justify-center gap-4">
                 <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105">
                   <Video className="w-5 h-5" /> 互动视频
                 </button>
                 <button className="flex-1 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105">
                   <Share2 className="w-5 h-5" /> 拍照分享
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* 步骤 8: 我的作品集 */}
      {step === 8 && (
        <div className="w-full max-w-6xl h-[85vh] bg-blue-50 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-blue-200 flex flex-col transition-opacity duration-500">
          <div className="h-20 bg-white border-b-2 border-blue-100 flex items-center justify-between px-6 shrink-0">
            <button onClick={() => setStep(4)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold bg-gray-100 px-4 py-2 rounded-full">
              <ChevronRight className="w-6 h-6 rotate-180" /> 返回大厅
            </button>
            <h2 className="text-2xl font-extrabold text-blue-600 flex items-center gap-2"><Frame className="text-blue-500" /> 我的奇妙画廊</h2>
            <div className="w-24"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-3xl border-2 border-yellow-300">
              <div className="bg-yellow-400 p-4 rounded-full text-white"><Award className="w-10 h-10" /></div>
              <div><h3 className="text-xl font-extrabold text-yellow-800">我的荣誉墙</h3><p className="text-yellow-600 font-bold">已收集 3 枚大师勋章！继续加油哦！</p></div>
            </div>
            <h3 className="text-xl font-extrabold text-blue-800 mb-6 border-l-4 border-blue-500 pl-4">近期佳作</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { title: '魔法森林', score: 98, date: '今天', icon: '🌲', color: 'bg-green-100' },
                { title: '太空飞船', score: 95, date: '昨天', icon: '🚀', color: 'bg-indigo-100' },
                { title: '我的好朋友', score: 90, date: '3天前', icon: '🐕', color: 'bg-orange-100' },
                { title: '美味蛋糕', score: 88, date: '上周', icon: '🎂', color: 'bg-pink-100' }
              ].map((art, idx) => (
                <div key={idx} className="bg-white p-4 rounded-3xl shadow-md border-2 border-transparent hover:border-blue-400 transition-all hover:-translate-y-2 cursor-pointer group">
                  <div className={`w-full aspect-square ${art.color} rounded-2xl flex items-center justify-center text-7xl mb-4 group-hover:scale-105 transition-transform`}>{art.icon}</div>
                  <h4 className="font-extrabold text-gray-800 text-lg">{art.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-gray-400">{art.date}</span>
                    <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {art.score}分</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 步骤 9: 主题挑战 */}
      {step === 9 && (
        <div className="w-full max-w-6xl h-[85vh] bg-purple-50 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-purple-200 flex flex-col transition-opacity duration-500">
          <div className="h-20 bg-white border-b-2 border-purple-100 flex items-center justify-between px-6 shrink-0">
            <button onClick={() => setStep(4)} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold bg-gray-100 px-4 py-2 rounded-full">
              <ChevronRight className="w-6 h-6 rotate-180" /> 返回大厅
            </button>
            <h2 className="text-2xl font-extrabold text-purple-600 flex items-center gap-2"><Target className="text-purple-500" /> 主题闯关挑战</h2>
            <div className="w-24"></div>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: '拯救小恐龙', desc: '给小恐龙画一个坚固的盾牌！', status: 'unlocked', reward: '勇气徽章', icon: '🦕' },
                { title: '深海大冒险', desc: '画出你想象中最奇特的海洋生物。', status: 'unlocked', reward: '探索徽章', icon: '🐙' },
                { title: '魔法城堡', desc: '需要 Lv.5 解锁', status: 'locked', reward: '建筑师徽章', icon: '🏰' },
                { title: '星际赛车', desc: '需要 Lv.6 解锁', status: 'locked', reward: '极速徽章', icon: '🏎️' }
              ].map((task, idx) => (
                <div key={idx} className={`relative flex items-center p-6 rounded-3xl border-2 transition-transform ${task.status === 'unlocked' ? 'bg-white border-purple-200 shadow-lg hover:-translate-y-1' : 'bg-gray-100 border-gray-200 opacity-70 grayscale'}`}>
                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shrink-0 ${task.status === 'unlocked' ? 'bg-purple-100' : 'bg-gray-200'}`}>{task.icon}</div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">{task.title} {task.status === 'locked' && <Lock className="w-4 h-4 text-gray-400" />}</h3>
                    <p className="text-gray-500 font-medium text-sm mt-1">{task.desc}</p>
                    {task.status === 'unlocked' ? (
                      <button onClick={() => setStep(5)} className="mt-4 bg-purple-500 text-white font-bold px-6 py-2 rounded-full shadow-md hover:bg-purple-600 transition-colors">立即挑战</button>
                    ) : (<div className="mt-4 text-gray-400 font-bold text-sm bg-gray-200 inline-block px-4 py-1 rounded-full">未解锁</div>)}
                  </div>
                  {task.status === 'unlocked' && (
                    <div className="absolute top-4 right-4 text-xs font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1 border border-yellow-200">奖励: {task.reward}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 步骤 10: 美术素材库 */}
      {step === 10 && (
        <div className="w-full max-w-6xl h-[85vh] bg-green-50 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-green-200 flex flex-col transition-opacity duration-500">
          <div className="h-20 bg-white border-b-2 border-green-100 flex items-center justify-between px-6 shrink-0">
            <button onClick={() => setStep(4)} className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold bg-gray-100 px-4 py-2 rounded-full">
              <ChevronRight className="w-6 h-6 rotate-180" /> 返回大厅
            </button>
            <h2 className="text-2xl font-extrabold text-green-600 flex items-center gap-2"><BookImage className="text-green-500" /> 奇妙美术馆素材</h2>
            <div className="w-24"></div>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-48 bg-white border-r-2 border-green-100 p-4 flex flex-col gap-2 overflow-y-auto shrink-0">
              {['全部', '小动物', '交通工具', '植物', '人物', '建筑', '科幻'].map((cat, idx) => (
                <button key={idx} className={`text-left px-4 py-3 rounded-xl font-bold transition-colors ${idx === 1 ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>{cat}</button>
              ))}
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                 {['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐒'].map((emoji, idx) => (
                   <div key={idx} className="bg-white aspect-square rounded-3xl flex flex-col items-center justify-center text-6xl shadow-sm border-2 border-transparent hover:border-green-400 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                     <span className="group-hover:scale-110 transition-transform">{emoji}</span>
                     <span className="text-sm font-bold text-gray-400 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">点击临摹</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;