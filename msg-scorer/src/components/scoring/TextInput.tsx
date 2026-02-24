'use client';
import { useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';
import InputMethodTabs, { type InputMethod } from './InputMethodTabs';
import HtmlInput from './HtmlInput';
import JsonInput from './JsonInput';
import LineJsonInput from './LineJsonInput';

const LINE_MAX = 500;

export default function TextInput() {
  const { channel, text, subject, setText, setSubject } = useScoringStore();
  const [inputMethod, setInputMethod] = useState<InputMethod>('text');

  const handleMethodChange = (method: InputMethod) => {
    setInputMethod(method);
    setText('');
  };

  // 非テキストタブは共通レンダー
  if (inputMethod === 'html') {
    return (
      <div className="space-y-3">
        <InputMethodTabs value={inputMethod} onChange={handleMethodChange} />
        <HtmlInput />
      </div>
    );
  }
  if (inputMethod === 'json') {
    return (
      <div className="space-y-3">
        <InputMethodTabs value={inputMethod} onChange={handleMethodChange} />
        <JsonInput />
      </div>
    );
  }
  if (inputMethod === 'line-json') {
    return (
      <div className="space-y-3">
        <InputMethodTabs value={inputMethod} onChange={handleMethodChange} />
        <LineJsonInput />
      </div>
    );
  }

  // テキストタブ（channel別）
  const textLen = text.length;
  const lineOver = channel === 'line' && textLen > LINE_MAX;

  if (channel === 'email-subject') {
    const IPHONE_LIMIT = 33;
    const GMAIL_LIMIT = 60;
    const overIphone = textLen > IPHONE_LIMIT;
    const overGmail  = textLen > GMAIL_LIMIT;
    const lenColor = overGmail ? 'text-red-500 font-bold'
      : overIphone ? 'text-amber-500 font-semibold'
      : textLen >= 15 && textLen <= 25 ? 'text-emerald-600'
      : 'text-stone-400';
    return (
      <div className="space-y-3">
        <InputMethodTabs value={inputMethod} onChange={handleMethodChange} />
        <div className="border border-stone-200 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200">
          <div className="flex items-center px-4 py-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例: 【期間限定】春の新作コスメが最大50%OFF"
              className="flex-1 bg-transparent outline-none text-base text-stone-900 placeholder:text-stone-300"
            />
            <span className={`text-sm font-mono-score shrink-0 ml-3 ${lenColor}`}>
              {textLen}
            </span>
          </div>
          {/* 文字数ガイド */}
          <div className="px-4 pb-3 flex items-center gap-4">
            <span className={`text-xs flex items-center gap-1 ${overIphone ? 'text-amber-500' : 'text-stone-400'}`}>
              📱 iPhone 上限 {IPHONE_LIMIT}文字
              {overIphone && <span className="font-semibold">（{textLen - IPHONE_LIMIT}文字オーバー）</span>}
            </span>
            <span className={`text-xs flex items-center gap-1 ${overGmail ? 'text-red-500' : 'text-stone-400'}`}>
              🖥 Gmail 上限 {GMAIL_LIMIT}文字
              {overGmail && <span className="font-semibold">（{textLen - GMAIL_LIMIT}文字オーバー）</span>}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (channel === 'email-body') {
    return (
      <div className="space-y-3">
        <InputMethodTabs value={inputMethod} onChange={handleMethodChange} />
        <div className="border border-stone-200 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200 px-4 py-3">
          <label className="block text-xs text-stone-400 mb-1">
            件名（任意：入力するとより精度の高い評価になります）
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="例: 春の新作コスメが最大50%OFF"
            className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-300"
          />
        </div>
        <div className="border border-stone-200 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="メール本文を貼り付けてください..."
            rows={6}
            className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-300 p-4 rounded-xl min-h-[200px]"
          />
          <div className="flex justify-end px-4 pb-3">
            <span className="text-xs font-mono-score text-stone-400">{textLen}文字</span>
          </div>
        </div>
      </div>
    );
  }

  if (channel === 'blog-sns') {
    return (
      <div className="space-y-3">
        <InputMethodTabs value={inputMethod} onChange={handleMethodChange} />
        <div className="border border-stone-200 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200 px-4 py-3">
          <label className="block text-xs text-stone-400 mb-1">
            タイトル・見出し（任意）
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="例: 海外でも通用するECサイトの作り方"
            className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-300"
          />
        </div>
        <div className="border border-stone-200 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ブログ記事やSNS投稿を貼り付けてください..."
            rows={8}
            className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-300 p-4 rounded-xl min-h-[240px]"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <p className="text-xs text-stone-400">
              ✍️ スコアリング後に「海外向けリメイク」機能が使えます
            </p>
            <span className="text-xs font-mono-score text-stone-400">{textLen}文字</span>
          </div>
        </div>
      </div>
    );
  }

  // LINE
  return (
    <div className="space-y-3">
      <InputMethodTabs value={inputMethod} onChange={handleMethodChange} />
      <div className="border border-stone-200 rounded-xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-200">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="LINE配信メッセージを入力してください..."
          rows={5}
          className="w-full bg-transparent outline-none text-sm text-stone-900 placeholder:text-stone-300 p-4 rounded-xl min-h-[160px]"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <p className="text-xs text-stone-400">
            💡 LINE公式アカウントの1吹き出し500文字制限に対応
          </p>
          <span className={`text-xs font-mono-score ${lineOver ? 'text-red-500 font-bold' : 'text-stone-400'}`}>
            {textLen} / {LINE_MAX}
          </span>
        </div>
        {lineOver && (
          <p className="px-4 pb-3 text-xs text-red-500">
            ⚠️ 500文字を超えています。LINE公式アカウントの制限を確認してください。
          </p>
        )}
      </div>
    </div>
  );
}
