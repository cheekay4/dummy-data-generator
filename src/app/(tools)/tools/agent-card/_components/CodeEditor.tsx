'use client';

import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    color: '#e5e7eb',
  },
  '.cm-gutters': {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#D84835',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgba(216, 72, 53, 0.15)',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'rgba(216, 72, 53, 0.25)',
  },
});

export default function CodeEditor({ value, onChange, readOnly = false }: CodeEditorProps): JSX.Element {
  return (
    <div className="rounded-2xl overflow-hidden border-2 border-[rgba(255,255,255,0.1)]">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[json(), darkTheme]}
        readOnly={readOnly}
        height="400px"
        className="bg-[rgba(17,24,39,0.9)]"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: true,
        }}
      />
    </div>
  );
}
